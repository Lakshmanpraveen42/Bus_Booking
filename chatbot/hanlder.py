from chatbot.nlu import detect_intent
from chatbot.state import get_session, save_session, reset_session
from chatbot.intents import *

def chatbot_handler(user_id: str, session_id: str, message: str, db):
    # 1. Load session first to get history
    session = get_session(session_id)
    session["user_id"] = user_id
    
    # 2. Call NLU with history context
    nlu_result = detect_intent(message, session.get("history", []))
    intent = nlu_result.get("intent")
    entities = nlu_result.get("entities", {})

    import logging
    logger = logging.getLogger("SmartBus")
    logger.info(f"CHAT | User: {user_id} | Intent: {intent} | Entities: {entities}")



    # 🛠️ KEYWORD SHIELD (Force intent for common words)
    # Only trigger if NOT in a slot-filling step (to prevent hi/today from breaking flows)
    is_slot_filling = any(ctx.get("step") is not None for ctx in session.get("contexts", {}).values())
    
    clean_msg = message.lower().strip()
    if not is_slot_filling:
        if clean_msg in ["hi", "hello", "hey", "greetings"]:
            intent = "greeting"
        elif clean_msg in ["exit", "bye", "stop", "cancel conversation"]:
            intent = "exit"
        elif clean_msg in ["help", "support", "faq"]:
            intent = "help_faq"


    # 1. Determine which intent to process
    active_intent = intent
    
    # 🔄 AUTO-SWITCH: If searching and user provides a bus name/ID, switch to booking
    if active_intent in ["out_of_scope", "none", "greeting", "exit", "help_faq", None]:
        # If it's a definite new intent like greeting or exit, don't resume old context
        pass
    elif active_intent == "search_buses":
        if session.get("last_active_intent") == "search_buses":
            if any(char.isdigit() for char in message) or len(message.split()) > 2:
                active_intent = "book_ticket"

    # If the AI didn't find a new intent OR it found a greeting/help/view during a flow, resume last active intent
    # 🚨 STICKY FLOW: If we are in a slot-filling step, we stick to the last intent unless it's an explicit 'exit'
    if is_slot_filling and active_intent not in ["exit"]:
        active_intent = session.get("last_active_intent", active_intent)
        print(f"Sticky Flow: Staying on {active_intent}")
    elif active_intent in ["none", "greeting", "help_faq", None]:
        if session.get("last_active_intent"):
            active_intent = session["last_active_intent"]
            print(f"Flow Persistence: Resuming {active_intent}")




    # 🔐 STRICT AUTH CHECK: Force login for everything except greeting, exit, and login intents
    public_intents = ["greeting", "exit", "login", "help_faq"]
    is_guest = not user_id or user_id == "SB_GUEST"
    
    if active_intent not in public_intents and is_guest:
        return {
            "response": (
                "To help you find and book the best bus journeys, please sign in to your SmartBus account. 🔐\n\n"
                "Once you've **Logged In** or **Signed Up**, I'll be able to show you available routes, "
                "manage your tickets, and provide personalized travel updates!"
            ),
            "intent": active_intent,
            "entities": entities
        }



    # 2. Get or initialize context for this intent
    if "contexts" not in session: session["contexts"] = {}
    if active_intent not in session["contexts"]:
        session["contexts"][active_intent] = {"step": None, "data": {}}
    
    context = session["contexts"][active_intent]

    
    # 🌟 SHARED DATA: Sync source/dest/date between search and book intents
    if active_intent in ["search_buses", "book_ticket"]:
        other_intent = "book_ticket" if active_intent == "search_buses" else "search_buses"
        if other_intent in session["contexts"]:
            # Merge existing data from the other intent if missing in current
            for key in ["source", "destination", "date"]:
                if key not in context["data"] and key in session["contexts"][other_intent]["data"]:
                    context["data"][key] = session["contexts"][other_intent]["data"][key]

    # 3. ROUTING
    response = ""
    data_payload = []

    def process_result(res):
        if isinstance(res, tuple):
            return res[0], res[1]
        return res, []

    if active_intent == "greeting":
        response, data_payload = process_result(handle_greeting())

    elif active_intent == "exit":
        response, data_payload = process_result(handle_exit(session_id, reset_session))

    elif active_intent == "help_faq":
        response, data_payload = process_result(handle_help())

    elif active_intent == "login_signup":
        response, data_payload = process_result(handle_login())

    elif active_intent == "search_buses":
        response, data_payload = process_result(handle_search(context, entities, db, message))
        session["last_active_intent"] = active_intent

    elif active_intent in ["book_ticket", "booking_ticket"]:
        response, data_payload = process_result(handle_booking(context, entities, db, message))
        session["last_active_intent"] = "book_ticket"

    elif active_intent == "cancel_ticket":
        response, data_payload = process_result(handle_cancellation(context, entities, user_id, db, message))
        session["last_active_intent"] = active_intent
        if "✅" in response:
            session["last_active_intent"] = None

    elif active_intent == "view_bookings":
        response, data_payload = process_result(handle_view(user_id, db))

    elif active_intent == "out_of_scope":
        response = nlu_result.get("polite_response") or "I'm a SmartBus assistant. I can only help with bus-related queries."
        data_payload = []

    else:
        response = "Sorry, I didn’t understand that."
        data_payload = []

    # Append to history
    session.setdefault("history", []).append({"role": "user", "content": message})
    session.setdefault("history", []).append({"role": "bot", "content": response})

    save_session(session_id, session)

    return {
        "response": response,
        "intent": active_intent,
        "entities": entities,
        "data": data_payload
    }