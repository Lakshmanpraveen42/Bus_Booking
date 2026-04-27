from test_chatbot import test_intent
from chatbot.state import reset_session

def run_tests():
    user_id = "SB_USER_6549"
    
    print("\n" + "="*50)
    print("SCENARIO 1: SINGLE-TURN SEARCH")
    print("="*50)
    reset_session("search_1")
    test_intent(user_id, "search_1", "Show me buses from Hyderabad to Vijayawada on 2026-04-26", "Direct Search")

    print("\n" + "="*50)
    print("SCENARIO 2: MULTI-TURN SEARCH (SLOT FILLING)")
    print("="*50)
    reset_session("search_2")
    test_intent(user_id, "search_2", "I want to find a bus", "Step 1: Intent")
    test_intent(user_id, "search_2", "Hyderabad", "Step 2: Source")
    test_intent(user_id, "search_2", "Vijayawada", "Step 3: Destination")
    test_intent(user_id, "search_2", "2026-04-26", "Step 4: Date")

    print("\n" + "="*50)
    print("SCENARIO 3: BOOKING FLOW (BUS SELECTION)")
    print("="*50)
    reset_session("book_1")
    test_intent(user_id, "book_1", "I want to book a ticket from Hyderabad to Vijayawada on 2026-04-26", "Step 1: Show options")
    test_intent(user_id, "book_1", "V Kaveri Travels 8", "Step 2: Select Bus Name")


if __name__ == "__main__":
    run_tests()
