import json
from sqlalchemy.orm import Session
from db.models import Booking, Trip, Seat, TripSeat
from services.email_service import send_cancellation_email

def perform_cancellation(booking_id: int, user_id: str, db: Session):
    # 1. Fetch Booking
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        return {"error": "Booking not found"}
    
    # 2. Validate User Ownership
    if booking.user_id != user_id:
        return {"error": "Unauthorized. You can only cancel your own bookings."}
    
    if booking.status.lower() == "cancelled":
        return {"error": "Ticket is already cancelled"}
    
    # 3. Get details
    passengers = []
    passengers = booking.passenger_details or []


    trip = db.query(Trip).filter(Trip.id == booking.trip_id).first()
    
    # 4. Unblock Seats
    for p in passengers:
        s_num = p.get('seat_number')
        if s_num:
            trip_seat = db.query(TripSeat).join(Seat).filter(
                TripSeat.trip_id == booking.trip_id,
                Seat.seat_number == s_num
            ).first()
            
            if trip_seat:
                trip_seat.is_booked = False
    
    # 5. Increase Bus Capacity
    if trip and trip.bus:
        trip.bus.capacity += len(passengers)
    
    # 6. Update Booking Status
    booking.status = "cancelled"
    db.commit()
    
    # 7. Send Cancellation Email
    try:
        cancel_details = {
            "source": booking.source,
            "destination": booking.destination,
            "booked_on": booking.booking_time.strftime("%d %b %Y, %I:%M %p"),
            "total_amount": booking.total_amount,
            "passengers": passengers
        }
        send_cancellation_email(booking.email, cancel_details)
    except Exception as e:
        print(f"Error sending cancellation email: {e}")
    
    return {"message": f"Successfully cancelled your booking for {booking.bus_name} (ID: #{booking_id}). Your refund will be processed within 3-5 business days."}

def get_user_bookings_service(user_id: str, db: Session):
    try:
        bookings = db.query(Booking).filter(Booking.user_id == user_id).all()
        return bookings
    except Exception as e:
        print(f"Error in get_user_bookings_service: {e}")
        return []

