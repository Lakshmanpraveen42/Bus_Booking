import os
import traceback
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.models import Booking, Trip, User
from app.services.ticket_service import generate_ticket_qr
from app.services.email_service import send_ticket_email

async def process_booking_post_success(booking_id: int):
    """
    Background task to generate QR code and send ticket email.
    """
    print(f"DEBUG: Processing post-booking services for ID: {booking_id}")
    db = SessionLocal()
    try:
        # 1. Fetch booking with relationships
        booking = db.query(Booking).filter(Booking.id == booking_id).first()
        if not booking:
            print(f"DEBUG: Booking {booking_id} not found in background task")
            return

        trip = db.query(Trip).filter(Trip.id == booking.trip_id).first()
        user = db.query(User).filter(User.id == booking.user_id).first()
        
        if not trip or not user:
            print(f"DEBUG: Trip or User missing for booking {booking_id}")
            return

        # 2. Generate QR Code
        trip_info = f"{trip.source} to {trip.destination}"
        print(f"DEBUG: Generating QR for {trip_info}")
        
        qr_path = generate_ticket_qr(
            booking_id=booking.id,
            user_name=user.name,
            trip_info=trip_info,
            seat_numbers=booking.seat_numbers
        )
        
        # 3. Update database
        booking.qr_code_path = qr_path
        db.commit()
        print(f"DEBUG: QR code saved at {qr_path}")

        # 4. Send Email
        import json
        booking_details = {
            "route": trip_info,
            "seats": booking.seat_numbers,
            "amount": booking.total_amount,
            "user_name": user.name,
            "bus_name": trip.bus.name,
            "booking_time": booking.booking_time.strftime("%d %b %Y, %I:%M %p"),
            "passengers": json.loads(booking.passenger_details) if booking.passenger_details else []
        }
        
        print(f"DEBUG: Sending email to {user.email}")
        await send_ticket_email(
            email=user.email,
            booking_details=booking_details,
            qr_image_path=qr_path
        )
        print(f"DEBUG: Post-booking services completed for ID: {booking_id}")

    except Exception as e:
        print(f"DEBUG: Critical error in background processor: {str(e)}")
        traceback.print_exc()
    finally:
        db.close()
