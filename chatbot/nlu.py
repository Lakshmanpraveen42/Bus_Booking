import os
import json
from groq import Groq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


SYSTEM_PROMPT = """
You are a high-level Natural Language Understanding (NLU) engine for SmartBus. 
Your goal is to accurately identify user intent and extract entities, using the **Conversation History** to resolve ambiguous answers.

Core Responsibilities:
1. **Identify Intent**: Map the user's message to EXACTLY ONE of the following intent IDs:
   - "greeting": Casual hellos, hi, greetings, how are you.
   - "search_buses": General bus search, checking schedules, "show me buses from A to B".
   - "book_ticket": STARTING A BOOKING OR SELECTING A BUS. If the user mentions "book", "ticket", or picks a bus from a list.
   - "cancel_ticket": Requesting to cancel a trip or asking how to cancel.
   - "view_bookings": Asking to see past trips, upcoming bookings, or "show my tickets".
   - "help_faq": Asking for assistance, "how do I use this?", or specific help.
   - "exit": Saying goodbye, ending the chat, or "exit conversation".
   - "out_of_scope": Unrelated topics (weather, news, etc).




2. **Extract Entities**: Extract specific details if present:
   - "source" (City name)
   - "destination" (City name)
   - "date" (Standardize to YYYY-MM-DD format. ALWAYS calculate the exact date based on the CONTEXT provided below. For example, if today is Monday and the user says 'Friday', calculate the date for the upcoming Friday).
   - "booking_id" (Integer - for cancellations).
   - "trip_id" (Integer - for booking selection).
   - "bus_name" (The name of the bus provider, e.g., "Sri Krishna Travels").

3. **Handle Out of Scope**: If the intent is "out_of_scope", you must be very polite. 
   Response format for out_of_scope:
   "I'm sorry, I don't have information about that. I am your SmartBus chatbot assistant, and I can help you with bus bookings, schedules, and cancellations. How can I assist you with your travel today?"
4. **Use History**: If the user provides a single piece of information (like a city name or a date), check the conversation history. 
   - If the bot just asked for a destination, then a city name provided by the user IS the destination.
   - If the bot just asked for a source, then it is the source.

Return ONLY a structured JSON:
{
  "intent": "intent_name",

  "entities": {
    "date": "YYYY-MM-DD" (CRITICAL: Return ONLY the date string. Do NOT add comments, hashtags, or explanations inside the JSON value),
    "source": "City",
    "destination": "City",
    "booking_id": number,
    "trip_id": number
  },
  "polite_response": "Only for out_of_scope"
}


"""


def detect_intent(message: str, history: list = None):
    from datetime import datetime, timedelta
    now = datetime.now()
    today_str = now.strftime("%Y-%m-%d")
    day_name = now.strftime("%A")
    
    # Format history for the AI
    history_context = ""
    if history:
        history_context = "\n\nCONVERSATION HISTORY:\n"
        for h in history[-5:]: # Look at last 5 messages
            role = "User" if h["role"] == "user" else "Bot"
            history_context += f"{role}: {h['content']}\n"

    # Inject current time and history into the system prompt
    context_prompt = SYSTEM_PROMPT + f"\n\nCONTEXT: Today's date is {today_str} ({day_name})." + history_context
    
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": context_prompt},
                {"role": "user", "content": message}
            ],
            model=os.getenv("GROQ_MODEL", "llama-3.1-8b-instant"),
            response_format={"type": "json_object"}
        )

        
        response_content = chat_completion.choices[0].message.content
        return json.loads(response_content)
    except Exception as e:
        print(f"Error in NLU processing: {e}")
        return {"intent": "greeting", "entities": {}}