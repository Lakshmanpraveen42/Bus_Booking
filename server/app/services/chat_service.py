import re
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional

class ChatService:
    def __init__(self):
        self.festivals = {
            "diwali": "2024-11-01",
            "christmas": "2024-12-25",
            "sankranthi": "2025-01-14",
            "dasara": "2024-10-12"
        }
        
        self.cities = ["hyderabad", "tuni", "tanuku", "vijayawada", "vizag", "chennai", "bangalore"]
        
    def classify_intent(self, message: str) -> str:
        msg = message.lower()
        if any(word in msg for word in ["book", "reserve", "ticket", "seat"]):
            return "book_ticket"
        if any(word in msg for word in ["cancel", "refund"]):
            return "cancel_ticket"
        if any(word in msg for word in ["special", "festival", "buses for"]):
            return "get_festival_routes"
        return "general_query"

    def extract_entities(self, message: str) -> Dict[str, Any]:
        msg = message.lower()
        entities = {}
        
        # Extract Source and Destination
        # Example: "from Hyderabad to Tuni"
        from_to_match = re.search(r"from\s+([a-z]+)\s+to\s+([a-z]+)", msg)
        if from_to_match:
            entities["source"] = from_to_match.group(1).capitalize()
            entities["destination"] = from_to_match.group(2).capitalize()
        else:
            # Fallback: find any city name
            found_cities = [city for city in self.cities if city in msg]
            if len(found_cities) >= 2:
                entities["source"] = found_cities[0].capitalize()
                entities["destination"] = found_cities[1].capitalize()
            elif len(found_cities) == 1:
                entities["destination"] = found_cities[0].capitalize()

        # Extract Festival
        for festival in self.festivals:
            if festival in msg:
                entities["festival"] = festival.capitalize()
                entities["date"] = self.festivals[festival]

        # Extract Date (Simple format like 10th Nov or YYYY-MM-DD)
        date_match = re.search(r"(\d{4}-\d{2}-\d{2})", msg)
        if date_match:
            entities["date"] = date_match.group(1)
        
        return entities

    def process_message(self, message: str) -> Dict[str, Any]:
        intent = self.classify_intent(message)
        entities = self.extract_entities(message)
        
        if intent == "book_ticket":
            if "source" in entities and "destination" in entities:
                date = entities.get("date", datetime.now().strftime("%Y-%m-%d"))
                return {
                    "reply": f"Looking for buses from {entities['source']} to {entities['destination']} on {date}... 🚌",
                    "action": "search_trips",
                    "data": {
                        "source": entities["source"],
                        "destination": entities["destination"],
                        "date": date
                    },
                    "quick_replies": ["View Results", "Modify Search"]
                }
            else:
                return {
                    "reply": "I can help you book a ticket! Where would you like to travel from and to?",
                    "quick_replies": ["Hyderabad to Vizag", "Tuni to Vijayawada"]
                }
                
        if intent == "cancel_ticket":
            return {
                "reply": "To cancel a ticket, please provide your Booking ID or go to 'My Bookings'. Would you like me to guide you there?",
                "action": "navigate_to_bookings",
                "quick_replies": ["Yes, take me there", "Check Policy"]
            }
            
        if intent == "get_festival_routes":
            festival = entities.get("festival", "upcoming festivals")
            return {
                "reply": f"We have special buses running for {festival}! 🎊 Seasonal routes are now open for booking with extra availability.",
                "action": "show_festival_deals",
                "quick_replies": ["Diwali Specials", "Sankranthi Buses", "Dasara Routes"]
            }

        return {
            "reply": "I'm SmartBus AI! I can help you book tickets, cancel trips, or find special festival buses. Try saying 'Book a ticket to Hyderabad'!",
            "quick_replies": ["Book a Ticket", "Festival Specials", "Cancel Ticket"]
        }

chat_service = ChatService()
