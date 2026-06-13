import os
from sqlalchemy.orm import Session, joinedload
from db.models import Trip, Bus, Booking
from datetime import datetime
import json

# -----------------------------
# CORE HELPERS
# -----------------------------
def handle_greeting():
    return "Welcome to SmartBus. How may I assist with your travel today?", []

def handle_exit(session_id, reset_session):
    reset_session(session_id)
    return "Thank you for choosing SmartBus. Have a safe and pleasant journey.", []

def handle_help():
    help_url = os.getenv("HELP_URL", "#")
    return f"I can assist with searches, bookings, and cancellations. Visit our [Help Center]({help_url}) for more.", []

def handle_login():
    login_url = os.getenv("LOGIN_URL", "#")
    return f"Please [Sign In]({login_url}) to access your personalized travel details.", []

# -----------------------------
# SEARCH INTENT
# -----------------------------
def handle_search(session, entities, db, message=None):
    from services.bus_service import search_trips_service
    data = session["data"]
    step = session.get("step")
    
    # 🔒 SLOT PROTECTION: Prioritize already collected data
    source = data.get("source") or entities.get("source")
    destination = data.get("destination") or entities.get("destination")
    date = data.get("date") or entities.get("date")

    # Smart Slot Filling: Strictly follow the bot's question step
    if step == "ask_source" and (entities.get("source") or entities.get("destination") or message):
        source = entities.get("source") or entities.get("destination") or message.strip()
    
    if step == "ask_destination" and (entities.get("destination") or entities.get("source") or message):
        destination = entities.get("destination") or entities.get("source") or message.strip()
    
    if step == "ask_date" and (entities.get("date") or message):
        date = entities.get("date") or message.strip()






    if not source:
        session["step"] = "ask_source"
        return "Please provide your departure city.", []

    if not destination:
        data["source"] = source
        session["step"] = "ask_destination"
        return f"Departure: {source}. Please provide your destination.", []

    if not date:
        data["source"] = source
        data["destination"] = destination
        session["step"] = "ask_date"
        return "Please provide your date of travel (YYYY-MM-DD).", []

    data.update({"source": source, "destination": destination, "date": date})
    trips = search_trips_service(source, destination, date, db)
    
    if not trips:
        return f"No buses found for {source} to {destination} on {date}.", []

    session["step"] = None 
    return f"Found {len(trips)} buses for your trip from {source} to {destination}.", trips


# -----------------------------
# BOOKING INTENT
# -----------------------------
def handle_booking(session, entities, db, message=None):
    from services.bus_service import search_trips_service
    data = session["data"]
    step = session.get("step")
    
    # 🔒 SLOT PROTECTION
    source = data.get("source") or entities.get("source")
    destination = data.get("destination") or entities.get("destination")
    date = data.get("date") or entities.get("date")

    # Smart Slot Filling: Strictly follow the bot's question step
    if step == "ask_source" and (entities.get("source") or entities.get("destination") or message):
        source = entities.get("source") or entities.get("destination") or message.strip()
    
    if step == "ask_destination" and (entities.get("destination") or entities.get("source") or message):
        destination = entities.get("destination") or entities.get("source") or message.strip()
    
    if step == "ask_date" and (entities.get("date") or message):
        date = entities.get("date") or message.strip()



    if step == "ask_date" and (entities.get("date") or message):
        date = entities.get("date") or message.strip()

    if not source:
        session["step"] = "ask_source"
        return "Which city are you departing from?", []

    if not destination or step == "ask_destination":
        if not destination:
            data["source"] = source
            session["step"] = "ask_destination"
            return "Please provide your destination.", []

    if not date or step == "ask_date":
        if not date:
            data.update({"source": source, "destination": destination})
            session["step"] = "ask_date"
            return "Please provide your date of travel (YYYY-MM-DD).", []

    data.update({"source": source, "destination": destination, "date": date})
    trips = search_trips_service(source, destination, date, db)
    
    if not trips:
        session["step"] = None
        return f"No available buses found for {source} to {destination}.", []

    # Selection Logic
    user_choice = message.strip().lower() if message else ""
    e_trip_id = entities.get("trip_id")
    e_bus_name = entities.get("bus_name")

    selected_trip = None
    try:
        t_id = int(e_trip_id) if e_trip_id else int(user_choice)
        selected_trip = next((t for t in trips if t['trip_id'] == t_id), None)
    except:
        pass

    if not selected_trip and (e_bus_name or user_choice):
        target = (e_bus_name or user_choice).lower()
        selected_trip = next((t for t in trips if target in t['bus_name'].lower() or t['bus_name'].lower() in target), None)

    if selected_trip:
        t_id = selected_trip['trip_id']
        base_url = os.getenv("SEAT_SELECTION_URL", "http://localhost:5173/seats")
        seat_url = f"{base_url}/{t_id}"
        
        session["step"] = None
        session["data"] = {}
        return f"Selection confirmed: {selected_trip['bus_name']}. Click here to select your seats: {seat_url}/", [selected_trip]


    if step == "select_trip":
        return "I couldn't find that bus. Please provide a valid Bus Name or Trip ID.", trips

    session["step"] = "select_trip"
    return "I've found these options. Please select a bus to proceed.", trips


# -----------------------------
# VIEW & CANCEL
# -----------------------------
def handle_view(user_id, db):
    from services.booking_service import get_user_bookings_service
    bookings = get_user_bookings_service(user_id, db)
    if not bookings:
        return "You have no active bookings at this time.", []
    
    active = [b for b in bookings if b.status == "booked"]
    past = [b for b in bookings if b.status != "booked"]
    
    response = "Here are your booking details:\n\n"
    if active:
        response += "📅 **Upcoming Trips:**\n"
        for b in active:
            response += f"- ID #{b.id}: {b.source} to {b.destination} ({b.bus_name})\n"
    
    if past:
        response += "\n🕒 **Past/Cancelled Trips:**\n"
        for b in past:
            response += f"- ID #{b.id}: {b.source} to {b.destination} ({b.status.title()})\n"
            
    raw_data = [{
        "booking_id": b.id, "bus_name": b.bus_name, "source": b.source,
        "destination": b.destination, "status": b.status, "booking_time": b.booking_time.strftime("%Y-%m-%d %H:%M")
    } for b in bookings]
    
    return response, raw_data



def handle_cancellation(session, entities, user_id, db, message=None):
    from services.booking_service import perform_cancellation, get_user_bookings_service
    data = session["data"]
    booking_id = entities.get("booking_id") or data.get("booking_id")

    # If user provided a numeric ID in response to 'ask_booking_id'
    if not booking_id and message and message.strip().isdigit():
        booking_id = message.strip()

    if not booking_id:
        # Fetch active bookings for this user
        bookings = get_user_bookings_service(user_id, db)
        # Filter for strictly "booked" status
        active_bookings = [b for b in bookings if b.status == "booked"]
        
        if not active_bookings:
            session["step"] = None
            return "I couldn't find any active bookings to cancel. Is there anything else I can help you with?", []
        
        raw_data = [{
            "booking_id": b.id, "bus_name": b.bus_name, "source": b.source,
            "destination": b.destination, "booking_time": b.booking_time.strftime("%Y-%m-%d %H:%M")
        } for b in active_bookings]

        session["step"] = "ask_booking_id"
        return "Which booking would you like to cancel? Here are your active trips:", raw_data


    data["booking_id"] = booking_id
    if not str(booking_id).strip().isdigit():
        session["step"] = "ask_booking_id"
        return "Please provide a valid numeric Booking ID.", []

    session["step"] = None
    result = perform_cancellation(int(booking_id), user_id, db)
    if "error" in result: return result["error"], []
    
    return result.get("message", "Ticket cancellation processed successfully."), []
