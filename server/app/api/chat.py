from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.chat_service import chat_service

router = APIRouter()

class ChatMessage(BaseModel):
    role: str # user or assistant
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []
    user_id: Optional[int] = None

@router.post("/")
async def chat_with_ai(request: ChatRequest, db: Session = Depends(get_db)):
    """
    Unified chat endpoint that uses ChatService to handle intelligence,
    intents, and UI actions.
    """
    try:
        # Format history for the service
        history_list = [
            {"role": msg.role, "content": msg.content}
            for msg in (request.history or [])
        ]
        
        result = await chat_service.process_message(
            message=request.message,
            history=history_list,
            db=db,
            user_id=request.user_id
        )
        
        return result
    except Exception as e:
        print(f"API Chat Error: {e}")
        return {
            "reply": "I'm sorry, I encountered an error while processing your request.",
            "quick_replies": ["Retry", "Contact Support"]
        }
