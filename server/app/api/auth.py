from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import random
from app.db.session import get_db
from app.models.models import User, OTP
from app.schemas.schemas import UserCreate, UserResponse, Token, OTPVerify, PasswordChange
from app.core.security import get_password_hash, verify_password, create_access_token
from app.services.email_service import send_otp_email, send_welcome_email
from app.api.dependencies import get_current_user

router = APIRouter()

@router.post("/change-password", response_model=dict)
async def change_password(
    data: PasswordChange, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify old password
    if not verify_password(data.old_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect old password")
    
    # Update password
    current_user.hashed_password = get_password_hash(data.new_password)
    db.commit()
    
    return {"message": "Password updated successfully"}

@router.post("/register", response_model=dict)
async def register(user_in: UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Check if this is the first user (if so, make them admin)
    user_count = db.query(User).count()
    is_admin = True if user_count == 0 else False

    # Create OTP
    otp_code = f"{random.randint(100000, 999999)}"
    expires_at = datetime.now() + timedelta(minutes=10)
    
    # Save OTP to DB
    db_otp = OTP(email=user_in.email, code=otp_code, expires_at=expires_at)
    db.add(db_otp)
    
    # Create inactive user
    db_user = User(
        name=user_in.name,
        email=user_in.email,
        phone=user_in.phone,
        hashed_password=get_password_hash(user_in.password),
        is_active=False,
        is_verified=False,
        is_admin=is_admin
    )
    db.add(db_user)
    db.commit()
    
    # Send OTP Email
    await send_otp_email(user_in.email, otp_code)
    
    return {"message": "OTP sent to your email. Please verify to complete registration."}

@router.post("/verify-otp", response_model=dict)
async def verify_otp(data: OTPVerify, db: Session = Depends(get_db)):
    db_otp = db.query(OTP).filter(OTP.email == data.email).order_by(OTP.id.desc()).first()
    
    if not db_otp or db_otp.code != data.code or db_otp.expires_at < datetime.now():
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_active = True
    user.is_verified = True
    db.commit()
    
    # Send Welcome Email
    await send_welcome_email(user)
    
    access_token = create_access_token(subject=user.email)
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "is_admin": user.is_admin
        }
    }

from fastapi.security import OAuth2PasswordRequestForm

@router.post("/login", response_model=dict)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    username = form_data.username
    password = form_data.password
    user = db.query(User).filter(User.email == username).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Account not found. Please sign up to continue."
        )
    
    if not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Incorrect password. Please try again."
        )
    
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
        
    access_token = create_access_token(subject=user.email)
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "is_admin": user.is_admin
        }
    }
