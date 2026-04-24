import json
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.models.models import Trip, Bus, Booking
from app.core.config import settings
from groq import Groq

class ChatService:
    def __init__(self):
        self.client = None
        if settings.GROQ_API_KEY:
            try:
                self.client = Groq(api_key=settings.GROQ_API_KEY)
                print(f"✅ Groq initialized with key: {settings.GROQ_API_KEY[:10]}...")
            except Exception as e:
                print(f"❌ Groq Init Error: {e}")
        else:
            print("⚠️ Warning: GROQ_API_KEY is missing from settings!")

    def get_real_buses(self, db: Session, source: str, destination: str, date: Optional[str] = None):
        """Internal helper to fetch bus data from DB."""
        query = db.query(Trip).join(Bus).filter(
            Trip.source.ilike(f"%{source}%"),
            Trip.destination.ilike(f"%{destination}%"),
            Trip.is_cancelled == False
        )
        
        # Handle natural language dates
        if date:
            now = datetime.now()
            if date.lower() == "today":
                date = now.strftime("%Y-%m-%d")
            elif date.lower() == "tomorrow":
                date = (now + timedelta(days=1)).strftime("%Y-%m-%d")
            
            try:
                dt = datetime.strptime(date, "%Y-%m-%d")
                start = dt.replace(hour=0, minute=0, second=0)
                end = dt.replace(hour=23, minute=59, second=59)
                query = query.filter(Trip.departure_time >= start, Trip.departure_time <= end)
            except:
                pass 
        
        trips = query.limit(5).all()
        if not trips:
            return []
        
        results = []
        for t in trips:
            results.append({
                "trip_id": t.id,
                "bus": t.bus.name,
                "type": t.bus.category,
                "departure": t.departure_time.strftime("%d %b, %H:%M"),
                "price": f"₹{t.price}",
                "available_seats": t.bus.total_seats 
            })
        return results

    def get_user_bookings(self, db: Session, user_id: int):
        """Internal helper to fetch user's upcoming bookings."""
        bookings = db.query(Booking).filter(
            Booking.user_id == user_id,
            Booking.status == 'booked'
        ).order_by(Booking.booking_time.desc()).limit(5).all()
        
        results = []
        for b in bookings:
            results.append({
                "booking_id": b.id,
                "route": f"{b.trip.source} to {b.trip.destination}",
                "date": b.trip.departure_time.strftime("%d %b"),
                "seats": b.seat_numbers,
                "amount": f"₹{b.total_amount}"
            })
        return results

    async def process_message(self, message: str, history: List[Dict[str, str]], db: Session, user_id: Optional[int] = None) -> Dict[str, Any]:
        """Main processing logic using Groq for intent and tool selection."""
        if not self.client:
            return {"reply": "Hi! I'm SmartBus Assistant. How can I help?", "quick_replies": ["Book a ticket"]}

        try:
            now = datetime.now()
            system_prompt = f"""
            You are the SmartBus AI Assistant, a friendly travel expert.
            ### USER CONTEXT:
            - Authentication Status: {"LOGGED_IN" if user_id else "GUEST"}
            - Current User ID: {user_id if user_id else "N/A"}

            ### YOUR CAPABILITIES:
            1. Search for real buses between cities using 'get_real_buses'.
            2. Check user's bookings (only if User ID is NOT "None").
            3. Help with cancellations and support.
            4. Provide UI Actions like navigation.

            ### STRICT RULES - DATA INTEGRITY:
            - NEVER speculate or make up bus names, operators, or prices. 
            - If you are asked about bus availability, you MUST call 'get_real_buses'.
            - If the tool returns an empty list [], you MUST state that no buses were found for that route.
            - DO NOT mention names like 'Orange Travels' or 'Diwakar Travels' unless they appear in the tool results.
            
            ### RESPONSE FORMAT (MUST BE VALID JSON):
            {{
                "reply": "Your friendly text message here",
                "action": "one_of: [navigate_to_login, search_trips, navigate_to_bookings, navigate_to_checkout, navigate_to_cancel, select_bus, null]",
                "data": {{ 
                    "booking_id": "number (for navigate_to_cancel)",
                    "trip": "object (for select_bus)",
                    "source": "string",
                    "destination": "string",
                    "date": "string"
                }},
                "quick_replies": ["List", "of", "3-4", "short", "suggestions"],
                "intent": "one_of: [greeting, book_ticket, cancel_ticket, my_bookings, support]"
            }}

            ### RULES:
            - If Authentication Status is 'GUEST' and user asks for 'my bookings' or 'cancel', set action to 'navigate_to_login' and ask them to log in.
            - If Authentication Status is 'LOGGED_IN', DO NOT ask the user to log in; proceed with tool calls (like 'get_my_bookings').
            - If user wants to cancel a specific booking, use 'navigate_to_cancel' with 'booking_id'.
            - If user picks a bus to book, use 'select_bus' with the 'trip' object data.
            - If user wants to search, ask for source, destination, and date if missing (Slot Filling).
            - When buses are found, include them in the 'reply' text nicely.
            - Keep 'reply' concise but helpful.
            """

            # Prepare messages for LLM
            messages = [{"role": "system", "content": system_prompt}]
            for msg in history[-5:]: # Use last 5 messages for context
                messages.append(msg)
            messages.append({"role": "user", "content": message})

            # Define tools for the LLM
            tools = [
                {
                    "type": "function",
                    "function": {
                        "name": "get_real_buses",
                        "description": "Fetch real bus trips from the database.",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "source": {"type": "string"},
                                "destination": {"type": "string"},
                                "date": {"type": "string", "description": "YYYY-MM-DD format"}
                            },
                            "required": ["source", "destination"]
                        }
                    }
                },
                {
                    "type": "function",
                    "function": {
                        "name": "get_my_bookings",
                        "description": "Retrieve current user's active bookings. Use this when the user asks about their trips, status, or wants to cancel.",
                        "parameters": {
                            "type": "object",
                            "properties": {}
                        }
                    }
                }
            ]

            completion = self.client.chat.completions.create(
                model="llama-3.1-8b-instant", # Faster and often more stable for tool selection
                messages=messages,
                tools=tools,
                tool_choice="auto"
            )

            response_message = completion.choices[0].message
            tool_calls = response_message.tool_calls

            # If tool called, execute and re-prompt for final JSON
            if tool_calls:
                messages.append(response_message)
                for tool_call in tool_calls:
                    func_name = tool_call.function.name
                    args = json.loads(tool_call.function.arguments)
                    
                    tool_content = ""
                    if func_name == "get_real_buses":
                        res = self.get_real_buses(db, args.get("source"), args.get("destination"), args.get("date"))
                        tool_content = json.dumps(res)
                    elif func_name == "get_my_bookings":
                        if user_id:
                            res = self.get_user_bookings(db, user_id)
                            tool_content = json.dumps(res)
                        else:
                            tool_content = "User is not logged in. Tell them to login."

                    messages.append({
                        "role": "tool",
                        "tool_call_id": tool_call.id,
                        "name": func_name,
                        "content": tool_content
                    })

                # Call LLM again to get final JSON response
                final_completion = self.client.chat.completions.create(
                    model="llama-3.3-70b-versatile",
                    messages=messages,
                    response_format={"type": "json_object"}
                )
                return json.loads(final_completion.choices[0].message.content)

            # Standard JSON response if no tool was called
            # Ensure the model knows to return JSON even if no tool was used
            final_json_completion = self.client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=messages,
                response_format={"type": "json_object"}
            )
            return json.loads(final_json_completion.choices[0].message.content)

        except Exception as e:
            print(f"❌ Chat Process Error: {e}")
            return {
                "reply": "I'm having a bit of trouble right now. Can we try again?",
                "quick_replies": ["Search Buses", "Help"]
            }

chat_service = ChatService()
