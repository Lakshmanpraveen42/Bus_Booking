from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.core.config import settings
from groq import Groq
import os

router = APIRouter()

# Initialize Groq client
client = None
if settings.GROQ_API_KEY:
    client = Groq(api_key=settings.GROQ_API_KEY)

from typing import List, Optional
import json
from datetime import datetime
from app.db.session import SessionLocal
from app.models.models import Trip, Bus

class ChatMessage(BaseModel):
    role: str # user or assistant
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []

# --- Real-time Data Tools ---
def get_real_buses(source: str, destination: str, date: Optional[str] = None):
    db = SessionLocal()
    try:
        # If date is provided, filter by it. Otherwise show upcoming
        query = db.query(Trip).join(Bus).filter(
            Trip.source.ilike(f"%{source}%"),
            Trip.destination.ilike(f"%{destination}%")
        )
        
        if date:
            try:
                dt = datetime.strptime(date, "%Y-%m-%d")
                start = dt.replace(hour=0, minute=0, second=0)
                end = dt.replace(hour=23, minute=59, second=59)
                query = query.filter(Trip.departure_time >= start, Trip.departure_time <= end)
            except:
                pass # Invalid date format, ignored
        
        trips = query.limit(5).all()
        
        if not trips:
            return "[]" # Return empty list as string
        
        results = []
        for t in trips:
            results.append({
                "trip_id": t.id,
                "bus": t.bus.name,
                "type": f"{t.bus.category} {t.bus.bus_type}",
                "departure": t.departure_time.strftime("%d %b, %H:%M"),
                "price": f"₹{t.price}",
                "available_seats": t.bus.total_seats # Simplified for chat
            })
        return json.dumps(results)
    finally:
        db.close()

TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "get_real_buses",
            "description": "Search our real database for actual bus trips, prices, and availability between two cities.",
            "parameters": {
                "type": "object",
                "properties": {
                    "source": {"type": "string", "description": "Departure city (e.g., Tuni)"},
                    "destination": {"type": "string", "description": "Arrival city (e.g., Hyderabad)"},
                    "date": {"type": "string", "description": "Travel date in YYYY-MM-DD format. Optional."}
                },
                "required": ["source", "destination"]
            }
        }
    }
]

SYSTEM_PROMPT = """
You are the SmartBus AI Assistant, a friendly and professional travel expert.

Guidelines:
1. When a user asks about buses, ALWAYS use 'get_real_buses'.
2. If NO buses are found (the tool returns '[]'):
   - Do NOT mention the 'database'.
   - Instead, say something like: "I'm sorry, we don't have any scheduled buses for that specific route right now."
   - Suggest: "Would you like to check a nearby date or a different route?"
3. When buses ARE found:
   - Present them in a helpful, easy-to-read list.
   - Mention the amenities (AC, Seating type).
4. For Festivals (Diwali, etc.), warn about the high demand and encourage booking quickly.
5. If the user chooses a bus, tell them they can book it instantly by clicking the 'Book' button on the results page or by searching for that route.
"""

@router.post("/")
async def chat_with_ai(request: ChatRequest):
    if not client:
        return {"reply": "Hi! I'm SmartBus Assistant. How can I help?"}

    try:
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        if request.history:
            for msg in request.history:
                messages.append({"role": msg.role, "content": msg.content})
        messages.append({"role": "user", "content": request.message})

        # --- First Call: Get Intent & Tool Request ---
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            tools=TOOLS,
            tool_choice="auto",
            max_tokens=500
        )
        
        response_message = response.choices[0].message
        tool_calls = response_message.tool_calls

        # --- If AI wants to call a tool ---
        if tool_calls:
            messages.append(response_message)
            
            for tool_call in tool_calls:
                function_args = json.loads(tool_call.function.arguments)
                print(f"DEBUG: AI Calling tool with args: {function_args}")
                
                tool_result = get_real_buses(
                    source=function_args.get("source"),
                    destination=function_args.get("destination"),
                    date=function_args.get("date")
                )
                
                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "name": "get_real_buses",
                    "content": tool_result
                })

            # --- Second Call: Generate Response based on tool results ---
            second_response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=messages
            )
            return {"reply": second_response.choices[0].message.content}
        
        # Default response if no tool was called
        return {"reply": response_message.content}
        
    except Exception as e:
        print(f"Chat Error: {str(e)}")
        return {"reply": "I'm having trouble retrieving real-time data right now. Please try again or check our search page!"}
