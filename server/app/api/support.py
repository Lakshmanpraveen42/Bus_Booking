from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.models import Setting
from app.services.email_service import send_support_email
from pydantic import BaseModel

router = APIRouter()

class SupportMessage(BaseModel):
    name: str
    email: str
    subject: str
    message: str

@router.post("/contact")
async def receive_contact_message(
    data: SupportMessage,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    # 1. Fetch admin email from settings
    admin_email_setting = db.query(Setting).filter(Setting.key == "admin_contact_email").first()
    
    # Fallback to a default if not set
    admin_email = admin_email_setting.value if admin_email_setting else "admin@smartbus.com"
    
    print(f"DEBUG: Routing support message from {data.email} to admin: {admin_email}")
    
    # 2. Trigger background task to send the email
    background_tasks.add_task(send_support_email, admin_email, data.model_dump())
    
    return {"message": "Message sent successfully"}
