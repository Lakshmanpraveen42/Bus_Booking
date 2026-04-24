import re
import json
import pytz
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.models import Trip, Bus, Booking, TripStop, User
from app.schemas.chat import ChatRequest
from app.core.config import settings
from groq import Groq

class ChatService:
    def __init__(self):
        self.festivals = {
            "diwali": "2024-11-01",
            "christmas": "2024-12-25",
            "sankranthi": "2025-01-14",
            "dasara": "2024-10-12"
        }
        self.client = None
        if settings.GROQ_API_KEY:
            try:
                self.client = Groq(api_key=settings.GROQ_API_KEY)
            except Exception as e:
                print(f"❌ Groq Init Error: {e}")

    def detect_intent_and_entities(self, request: ChatRequest) -> Dict[str, Any]:
        """Context-aware intent detection and slot filling with Intent Shifting."""
        if not self.client:
            return {"intent": "general_query", "entities": {}}

        try:
            # Format history for the prompt
            history_str = ""
            for msg in (request.history or [])[-5:]: 
                history_str += f"{msg.role}: {msg.content}\n"

            prompt = f"""
            You are a Context-Aware NLU engine for 'BusGo'.
            Analyze the history and the current message to determine the user's intent.

            ### CONVERSATION HISTORY:
            {history_str}
            
            ### CURRENT USER MESSAGE:
            "{request.message}"

            ### PRIORITY RULES:
            1. INTENT SHIFTING: If the user message clearly matches a NEW INTENT (e.g., mid-booking they ask to 'cancel' or 'show my bookings'), prioritize the NEW intent.
            2. SLOT FILLING: If the message is a direct answer to a previous bot question (e.g., bot asked "Where from?" and user says "Tuni"), stay in 'book_ticket' and set 'source' to 'Tuni'.

            ### INTENTS:
            - greeting: Hellos.
            - book_ticket: Searching for buses or filling travel details.
            - cancel_ticket: Refund or cancellation requests (Priority).
            - my_bookings: Show user trips (Priority).
            - get_festival_routes: Festival specials.
            - help_support: Support info.

            ### SLOT RULES:
            - Today's date: {datetime.now().strftime('%Y-%m-%d')}.
            - Extract source, destination, date (YYYY-MM-DD), and festival.

            Return ONLY JSON:
            {{
                "intent": "string",
                "entities": {{
                    "source": "string or null",
                    "destination": "string or null",
                    "date": "string or null",
                    "festival": "string or null"
                }}
            }}
            """
            
            completion = self.client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"}
            )
            
            return json.loads(completion.choices[0].message.content)
        except Exception as e:
            print(f"❌ Groq API Error: {e}")
            return {"intent": "general_query", "entities": {}}

    def process_message(self, request: ChatRequest, db: Session) -> Dict[str, Any]:
        ai_result = self.detect_intent_and_entities(request)
        intent = ai_result.get("intent")
        entities = ai_result.get("entities", {})
        user_id = request.user_id
        
        # ─── Auth Check ───
        if intent in ["book_ticket", "cancel_ticket", "my_bookings"] and not user_id:
            return {
                "reply": "I'd love to help you with that, but you need to be logged in first! 🔒",
                "action": "navigate_to_login",
                "quick_replies": ["Login Now", "Sign Up"]
            }

        # ─── Intent Handling ───
        if intent == "greeting":
            return {
                "reply": "Hello! 👋 I'm your SmartBus assistant. How can I help you today?",
                "quick_replies": ["Book a Ticket", "Festival Specials"]
            }

        if intent == "book_ticket":
            source = entities.get("source")
            destination = entities.get("destination")
            date = entities.get("date")
            
            if not source:
                return {"reply": "Where are you traveling from?", "quick_replies": ["Tuni", "Hyderabad", "Vijayawada"]}
            if not destination:
                return {"reply": f"Got it, from {source}. Where are you going to?", "quick_replies": ["Hyderabad", "Vizag", "Bangalore"]}
            if not date:
                return {"reply": f"Perfect, {source} to {destination}. On which date would you like to travel?", "quick_replies": ["Tomorrow", "Next Friday"]}
            
            query = db.query(Trip).filter(Trip.source.ilike(f"%{source}%"), Trip.destination.ilike(f"%{destination}%"), Trip.is_cancelled == False)
            try:
                date_obj = datetime.strptime(date, "%Y-%m-%d")
                query = query.filter(Trip.departure_time >= date_obj, Trip.departure_time < date_obj + timedelta(days=1))
            except: pass
            
            trips = query.limit(3).all()
            if trips:
                reply = f"I found {len(trips)} buses from {source} to {destination} on {date}:\n"
                for t in trips: reply += f"• {t.bus.name} at {t.departure_time.strftime('%I:%M %p')} - ₹{t.price}\n"
                return {"reply": reply, "action": "search_trips", "data": {"source": source, "destination": destination, "date": date}, "quick_replies": ["View All", "Modify"]}
            else:
                return {"reply": f"Sorry, no buses found for {source} to {destination} on {date}.", "quick_replies": ["Change Date", "Other Routes"]}

        if intent == "my_bookings":
            bookings = db.query(Booking).filter(Booking.user_id == user_id).order_by(Booking.booking_time.desc()).limit(3).all()
            if bookings:
                reply = "Here are your recent bookings: 🎫\n"
                for b in bookings: reply += f"• {'✅' if b.status == 'booked' else '❌'} {b.trip.source} → {b.trip.destination} on {b.trip.departure_time.strftime('%d %b')}\n"
                return {"reply": reply, "action": "navigate_to_bookings", "quick_replies": ["Go to My Bookings"]}
            return {"reply": "You don't have any bookings yet.", "quick_replies": ["Book Now"]}

        if intent == "cancel_ticket":
            now = datetime.now(pytz.timezone("Asia/Kolkata"))
            upcoming_bookings = db.query(Booking).join(Trip).filter(
                Booking.user_id == user_id,
                Booking.status == "booked",
                Trip.departure_time >= now
            ).order_by(Trip.departure_time.asc()).limit(3).all()

            if upcoming_bookings:
                reply = "I found your upcoming tickets that can be cancelled: 🎫\n"
                for b in upcoming_bookings:
                    reply += f"• {b.trip.source} → {b.trip.destination} ({b.trip.departure_time.strftime('%d %b, %I:%M %p')})\n"
                return {
                    "reply": reply + "\nWhich one would you like to cancel? You can manage them in 'My Bookings'.",
                    "action": "navigate_to_bookings",
                    "quick_replies": ["Go to My Bookings", "Cancellation Policy"]
                }
            else:
                return {"reply": "I couldn't find any upcoming active bookings to cancel.", "quick_replies": ["Book New Ticket"]}

        if intent == "help_support":
            return {"reply": "I'm here to help! 🛠️ Support: support@smartbus.com", "quick_replies": ["Booking Help"]}

        if intent == "get_festival_routes":
            festival = entities.get("festival")
            if festival:
                fest_date = self.festivals.get(festival.lower())
                if fest_date:
                    date_obj = datetime.strptime(fest_date, "%Y-%m-%d")
                    trips = db.query(Trip).filter(Trip.departure_time >= date_obj, Trip.departure_time < date_obj + timedelta(days=1)).limit(3).all()
                    if trips:
                        reply = f"Yes! Special buses for {festival} on {fest_date}:\n"
                        for t in trips: reply += f"• {t.source} to {t.destination} ({t.bus.name})\n"
                        return {"reply": reply + "\nBook now!", "quick_replies": [f"Book for {festival}"]}
            return {"reply": "We have specials for Diwali, Sankranthi, and Dasara! Which one?", "quick_replies": ["Diwali Specials", "Sankranthi Buses"]}

        return {"reply": "I'm SmartBus AI! Try: 'Buses to Hyderabad' or 'Show my bookings'.", "quick_replies": ["Book a Ticket", "My Bookings"]}

chat_service = ChatService()
