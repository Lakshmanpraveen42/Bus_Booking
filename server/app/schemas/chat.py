from pydantic import BaseModel
from typing import List, Optional, Any

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str
    quick_replies: Optional[List[str]] = []
    action: Optional[str] = None # e.g., "search_trips", "cancel_ticket"
    data: Optional[Any] = None # Structured data like trip search params
