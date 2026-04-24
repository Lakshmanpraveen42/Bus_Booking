from pydantic import BaseModel
from typing import List, Optional, Any

class ChatMessage(BaseModel):
    role: str # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    message: str
    user_id: Optional[int] = None
    history: Optional[List[ChatMessage]] = [] # Chat history for context

class ChatResponse(BaseModel):
    reply: str
    quick_replies: Optional[List[str]] = []
    action: Optional[str] = None 
    data: Optional[Any] = None
