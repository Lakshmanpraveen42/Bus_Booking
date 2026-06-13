from chatbot.hanlder import chatbot_handler
from db.database import SessionLocal
import json

def test_chat():
    import time
    db = SessionLocal()
    user_id = 'SB_USER_6549'
    sess_id = f'test_sess_{int(time.time())}'

    
    steps = [
        "i want to book a ticket",
        "palakollu",
        "hyderabad",
        "today"
    ]
    
    print(f"{'USER MESSAGE':<30} | {'INTENT':<15} | {'BOT RESPONSE'}")
    print("-" * 80)
    
    for msg in steps:
        res = chatbot_handler(user_id, sess_id, msg, db)
        intent = res.get("intent")
        response = res.get("response")
        entities = res.get("entities")
        print(f"{msg:<30} | {intent:<15} | Entities: {entities}")
        print(f"Bot: {response[:100]}...")
        print("-" * 80)


if __name__ == "__main__":
    test_chat()
