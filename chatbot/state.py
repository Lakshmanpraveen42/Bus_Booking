import json
import os

SESSION_FILE = "db/sessions.json"

def _load_all_sessions():
    if os.path.exists(SESSION_FILE):
        try:
            with open(SESSION_FILE, "r") as f:
                return json.load(f)
        except:
            return {}
    return {}

def _save_all_sessions(all_sessions):
    # Ensure directory exists
    os.makedirs(os.path.dirname(SESSION_FILE), exist_ok=True)
    with open(SESSION_FILE, "w") as f:
        json.dump(all_sessions, f, indent=4)

def get_session(session_id: str):
    all_sessions = _load_all_sessions()
    if session_id in all_sessions:
        return all_sessions[session_id]
    return {
        "user_id": None,
        "last_active_intent": None,
        "contexts": {},  # Stores state for each intent: {"book_ticket": {"step": "...", "data": {}}}
        "history": []
    }

def save_session(session_id: str, session: dict):
    all_sessions = _load_all_sessions()
    all_sessions[session_id] = session
    _save_all_sessions(all_sessions)

def reset_session(session_id: str):
    all_sessions = _load_all_sessions()
    if session_id in all_sessions:
        user_id = all_sessions[session_id].get("user_id")
        all_sessions[session_id] = {
            "user_id": user_id,
            "last_active_intent": None,
            "contexts": {},
            "history": []
        }
        _save_all_sessions(all_sessions)



