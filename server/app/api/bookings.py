from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import json
from app.db.session import get_db
from app.models.models import Booking, Trip, User
from app.api.dependencies import get_current_user
from app.schemas.schemas import BookingCreate, BookingResponse
from app.services.ticket_service import generate_ticket_qr
from app.services.email_service import send_ticket_email

router = APIRouter()

@router.post("/", response_model=BookingResponse)
async def create_booking(
    booking_in: BookingCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check if trip exists
    trip = db.query(Trip).filter(Trip.id == booking_in.trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    # Simple seat conflict check
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
        payment_status="paid",
        passenger_details=json.dumps([p.dict() for p in booking_in.passengers]),
        boarding_point=booking_in.boarding_point,
        dropping_point=booking_in.dropping_point
    )
    
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    
    # --- Post-Booking Services in Background ---
    from app.services.booking_processor import process_booking_post_success
    background_tasks.add_task(process_booking_post_success, booking_id=new_booking.id)
    
    return new_booking

@router.get("/me", response_model=List[BookingResponse])
async def get_my_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Booking).filter(Booking.user_id == current_user.id).order_by(Booking.booking_time.desc()).all()

@router.post("/{booking_id}/cancel")
async def cancel_booking(
    booking_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    booking = db.query(Booking).filter(Booking.id == booking_id, Booking.user_id == current_user.id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    if booking.status == "canceled":
        raise HTTPException(status_code=400, detail="Booking is already canceled")
    
    from datetime import timedelta
    import pytz
    
    now = datetime.now(pytz.timezone("Asia/Kolkata")).replace(tzinfo=None)
    departure_time = booking.trip.departure_time
    
    time_diff = departure_time - now
    hours_diff = time_diff.total_seconds() / 3600

    if hours_diff < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cancellation is not permitted within 2 hours of departure"
        )

    # Tiered Refund Calculation
    refund_percentage = 0.0
    if hours_diff >= 24:
        refund_percentage = 0.90
    elif hours_diff >= 6:
        refund_percentage = 0.75
    else: # 2 - 6 hours
        refund_percentage = 0.50

    refund_amount = round(booking.total_amount * refund_percentage, 2)
    booking.status = "canceled"
    booking.cancellation_time = now
    db.commit()

    # Send Notification Email
    from app.services.email_service import send_cancellation_email
    booking_details = {
        "route": f"{booking.trip.source} to {booking.trip.destination}",
        "seats": booking.seat_numbers,
        "refund_amount": refund_amount,
        "user_name": current_user.name,
        "bus_name": booking.trip.bus.name,
        "booking_time": booking.booking_time.strftime("%d %b %Y, %I:%M %p"),
        "cancellation_time": now.strftime("%d %b %Y, %I:%M %p"),
        "passengers": json.loads(booking.passenger_details) if booking.passenger_details else []
    }
    background_tasks.add_task(send_cancellation_email, current_user.email, booking_details)

    return {
        "message": "Booking canceled successfully",
        "refund_amount": refund_amount,
        "refund_percentage": int(refund_percentage * 100)
    }

