import sys
import os
# Add current directory to path so we can import chatbot modules
sys.path.append(os.getcwd())

from chatbot.hanlder import chatbot_handler
from sqlalchemy.orm import Session
from db.database import SessionLocal
import json

def test_intent(user_id, session_id, message, description):
    db = SessionLocal()
    try:
        print(f"\n--- TEST: {description} ---")
        print(f"User: {message}")
        result = chatbot_handler(user_id, session_id, message, db)
        print(f"Bot: {result['response']}")
        print(f"Intent Detected: {result['intent']}")
        return result
    finally:
        db.close()

if __name__ == "__main__":
    u_id = "SB_USER_TEST"
    s_id = "TEST_SESS_999"

    # 1. GREETING
    test_intent(u_id, s_id, "Hello there!", "Greeting")

    # 2. HELP & LOGIN
    test_intent(u_id, s_id, "How do I login?", "Login Intent")
    test_intent(u_id, s_id, "I need help", "Help Intent")

    # 3. SEARCH (Multi-turn)
    test_intent(u_id, s_id, "I want to find a bus", "Search Start")
    test_intent(u_id, s_id, "Hyderabad", "Search Source")
    test_intent(u_id, s_id, "Vijayawada", "Search Destination")
    test_intent(u_id, s_id, "Tomorrow", "Search Date")

    # 4. OUT OF SCOPE
    test_intent(u_id, s_id, "What is the weather like?", "Out of Scope")

    # 5. BOOKING + SELECTION
    s_id_book = "BOOK_SESS_123"
    test_intent(u_id, s_id_book, "I want to book a ticket from Hyderabad to Vijayawada for tomorrow", "Booking with initial slots")
    # This should show the list of buses. Let's assume there are buses.
    # We will simulate choosing one.
    test_intent(u_id, s_id_book, "Airavata Express", "Selecting Bus Name")

    # 6. VIEW & CANCEL
    test_intent(u_id, s_id, "Show my bookings", "View Bookings")
    # We won't cancel in test to avoid messing up DB, but we check if it asks for ID
    test_intent(u_id, s_id, "Cancel my ticket", "Cancel Start")

    # 7. EXIT
    test_intent(u_id, s_id, "Goodbye", "Exit Intent")

    print("\n✅ All tests initiated. Check the output above for bot responses.")
