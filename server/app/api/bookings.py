from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.db.session import get_db
from app.models.models import Booking, Trip, User
from app.api.dependencies import get_current_user
from app.schemas.schemas import BookingCreate, BookingResponse

router = APIRouter()

@router.post("/", response_model=BookingResponse)
async def create_booking(
    booking_in: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check if trip exists
    trip = db.query(Trip).filter(Trip.id == booking_in.trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    # Simple seat conflict check (Production should use a more robust locking or transaction check)
    existing_bookings = db.query(Booking).filter(
        Booking.trip_id == booking_in.trip_id,
        Booking.status == "booked"
    ).all()
    
    occupied_seats = []
    for b in existing_bookings:
        occupied_seats.extend([s.strip() for s in b.seat_numbers.split(",")])
    
    requested_seats = [s.strip() for s in booking_in.seat_numbers.split(",")]
    if any(s in occupied_seats for s in requested_seats):
        raise HTTPException(status_code=400, detail="One or more seats are already booked")

    # Create booking record
    new_booking = Booking(
        user_id=current_user.id,
        trip_id=booking_in.trip_id,
        seat_numbers=booking_in.seat_numbers,
        total_amount=booking_in.total_amount,
        status="booked",
        payment_status="paid"  # Frontend simulates payment success
    )
    
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    
    return new_booking

@router.get("/me", response_model=List[BookingResponse])
async def get_my_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Booking).filter(Booking.user_id == current_user.id).order_by(Booking.booking_time.desc()).all()
