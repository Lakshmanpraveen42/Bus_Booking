from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session
from datetime import datetime
import json
from db.database import get_db
from db.models import Bus, Trip, User, TripSeat, OTP, Booking, Seat
from .schemas import UserRegister, OTPVerify, UserLogin, BookingRequest, CancelRequest, ChatRequest, ChatResponse, BookingViewRequest, BusCreate, TripCreate, BusUpdate, TripUpdate





from services.auth import hash_password, verify_password
from services.email_service import send_otp_email, send_welcome_email, send_booking_email, send_cancellation_email



import random
import uuid



router = APIRouter()

@router.get("/")
def read_root():
    return {"message": "Welcome to SmartBus API"}

@router.get("/buses")
def get_buses(db: Session = Depends(get_db)):
    buses = db.query(Bus).all()
    return buses

@router.get("/trips")
def get_trips(db: Session = Depends(get_db)):
    trips = db.query(Trip).all()
    return trips

@router.get("/trips/{trip_id}/seats")
def get_trip_seats(trip_id: int, db: Session = Depends(get_db)):
    from services.bus_service import get_trip_seats_service
    result = get_trip_seats_service(trip_id, db)
    if "error" in result:
        return result
    return result


@router.get("/trip-seats")
def get_all_trip_seats(db: Session = Depends(get_db)):
    """Get all trip seat records (Admin view)"""
    trip_seats = db.query(TripSeat).all()
    return trip_seats




@router.get("/users")
def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users

@router.post("/register")
def register_user(user_data: UserRegister, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        return {"error": "Email already registered"}
    
    # Create new user with custom ID (Name prefix + numeric value)
    custom_id = f"SB_USER_{random.randint(1000, 9999)}"
    
    new_user = User(
        id=custom_id,
        name=user_data.name,
        email=user_data.email,
        phone=user_data.phone,
        hashed_password=hash_password(user_data.password),
        is_verified=False,
        is_admin=False
    )
    
    db.add(new_user)
    
    # Generate OTP
    otp_code = f"{random.randint(100000, 999999)}"
    
    # Save OTP to database
    new_otp = OTP(
        phone=user_data.phone,
        otp=otp_code
    )
    db.add(new_otp)
    db.commit()
    
    # Send OTP via email
    send_otp_email(user_data.email, otp_code)
    
    return {"message": "OTP sent to your email. Please verify to complete registration."}

@router.post("/admin/register")
def register_admin(user_data: UserRegister, db: Session = Depends(get_db)):
    # Check if an admin already exists
    admin_exists = db.query(User).filter(User.is_admin == True).first()
    if admin_exists:
        return {"error": "An admin account already exists. Only one admin is allowed."}

    # Check if email already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        return {"error": "Email already registered"}
    
    # Create new admin user with custom ID
    custom_id = f"SB_ADMIN_{random.randint(100, 999)}"
    
    new_user = User(
        id=custom_id,
        name=user_data.name,
        email=user_data.email,
        phone=user_data.phone,
        hashed_password=hash_password(user_data.password),
        is_verified=False,
        is_admin=True
    )

    
    db.add(new_user)
    
    # Generate OTP
    otp_code = f"{random.randint(100000, 999999)}"
    
    # Save OTP to database
    new_otp = OTP(
        phone=user_data.phone,
        otp=otp_code
    )
    db.add(new_otp)
    db.commit()
    
    # Send OTP via email
    send_otp_email(user_data.email, otp_code)
    
    return {"message": "Admin OTP sent to your email. Please verify to complete registration."}


@router.post("/verify-otp")
def verify_otp(data: OTPVerify, db: Session = Depends(get_db)):
    # Find user by email
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        return {"error": "User not found"}
    
    # Find the latest OTP for this user's phone
    otp_record = db.query(OTP).filter(OTP.phone == user.phone).order_by(OTP.created_at.desc()).first()
    
    if not otp_record or otp_record.otp != data.otp:
        return {"error": "Invalid or expired OTP"}
    
    # Verify user
    user.is_verified = True
    db.commit()
    
    # Send welcome email
    send_welcome_email(user.email, user.name)
    
    return {"message": "Verification successful! Welcome to SmartBus."}

@router.post("/login")
def login_user(data: UserLogin, db: Session = Depends(get_db)):
    # Find user by email
    user = db.query(User).filter(User.email == data.email).first()
    
    if not user:
        return {"error": "Invalid email or password"}
    
    # Check if verified
    if not user.is_verified:
        return {"error": "Account not verified. Please verify your OTP first."}
    
    # Verify password
    if not verify_password(data.password, user.hashed_password):
        return {"error": "Invalid email or password"}
    
    return {
        "message": "Login successful",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "is_admin": user.is_admin
        }
    }

@router.post("/admin/login")
def admin_login(data: UserLogin, db: Session = Depends(get_db)):
    # Find user by email
    user = db.query(User).filter(User.email == data.email).first()
    
    if not user:
        return {"error": "Invalid email or password"}
    
    # Verify password
    if not verify_password(data.password, user.hashed_password):
        return {"error": "Invalid email or password"}
    
    # Check if admin
    if not user.is_admin:
        return {"error": "Access denied. Admin privileges required."}
    
    return {
        "message": "Admin login successful",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "is_admin": user.is_admin
        }
    }
@router.get("/users")
def get_all_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return [
        {
            "user_id": u.id,
            "name": u.name,
            "email": u.email,
            "phone": u.phone,
            "is_admin": u.is_admin,
            "is_verified": u.is_verified
        } for u in users
    ]

@router.get("/users/{user_id}")
def get_user_details(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return {"error": "User not found"}
    
    return {
        "user_id": user.id,
        "name": user.name,
        "email": user.email,
        "phone": user.phone,
        "is_admin": user.is_admin,
        "is_verified": user.is_verified
    }





@router.get("/search")
def search_trips(
    source: str, 
    destination: str, 
    travel_date: str, # Format: YYYY-MM-DD
    db: Session = Depends(get_db)
):
    from services.bus_service import search_trips_service
    return search_trips_service(source, destination, travel_date, db)




@router.get("/sources")
def get_sources(db: Session = Depends(get_db)):
    sources = db.query(Trip.source).distinct().all()
    return [s[0] for s in sources]

@router.get("/destinations")
def get_destinations(db: Session = Depends(get_db)):
    destinations = db.query(Trip.destination).distinct().all()
    return [d[0] for d in destinations]

import json

@router.get("/locations")
def get_locations(db: Session = Depends(get_db)):
    # Get all sources and destinations
    sources = db.query(Trip.source).distinct().all()
    destinations = db.query(Trip.destination).distinct().all()
    
    # Get all routing points from JSON strings in the DB
    all_trips = db.query(Trip.routing_points).all()
    routing_points = []
    for trip in all_trips:
        if trip.routing_points:
            routing_points.extend(trip.routing_points)



    # Combine all unique locations
    all_locs = set([s[0] for s in sources] + [d[0] for d in destinations] + routing_points)
    return sorted(list(all_locs))

@router.post("/bookings")
def create_booking(data: BookingRequest, db: Session = Depends(get_db)):
    # 1. Validate User
    user = db.query(User).filter(User.id == data.user_id).first()
    if not user:
        return {"error": "User not found. Please login first."}
    
    # 2. Find Trip
    trip = db.query(Trip).filter(Trip.id == data.trip_id).first()
    if not trip:
        return {"error": "Trip not found"}

    # 3. Process each passenger and update seats by seat_number

    from db.models import Seat
    seat_numbers = [p.seat_number for p in data.passengers]
    
    for s_num in seat_numbers:
        # Find the trip seat by joining with the Seat table
        trip_seat = db.query(TripSeat).join(Seat).filter(
            TripSeat.trip_id == data.trip_id,
            Seat.seat_number == s_num
        ).first()
        
        if not trip_seat:
            return {"error": f"Seat {s_num} not found for this trip"}
        
        if trip_seat.is_booked:
            return {"error": f"Seat {s_num} is already booked"}
        
        # Mark as booked
        trip_seat.is_booked = True

    
    # 4. Update Bus Capacity
    bus = trip.bus
    if bus.capacity < len(data.passengers):
        return {"error": "Not enough capacity on the bus"}
    
    bus.capacity -= len(data.passengers)
    
    # 5. Save Booking to DB
    passenger_list_for_db = [p.dict() for p in data.passengers]
    
    new_booking = Booking(
        user_id=data.user_id,
        trip_id=data.trip_id,
        total_amount=data.price,
        source=data.source,
        destination=data.destination,
        bus_name=data.bus_name,
        email=data.email,  # Save the payload email
        passenger_details=passenger_list_for_db,

        payment_status="paid",
        status="booked"
    )

    
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)

    import logging
    logger = logging.getLogger("SmartBus")
    logger.info(f"BOOKING | Success | User: {data.user_id} | Trip: {data.trip_id} | BookingID: {new_booking.id}")

    
    # 6. Send Confirmation Email
    booking_details = {
        "bus_name": data.bus_name,
        "source": data.source,
        "destination": data.destination,
        "passengers": passenger_list_for_db
    }
    send_booking_email(data.email, booking_details)
    
    # 7. Return Response
    response_data = data.dict()
    response_data["booking_id"] = new_booking.id
    response_data["message"] = "Ticket confirmed successfully"
    
    return response_data

@router.get("/users/{user_id}/bookings")
def get_user_bookings(user_id: str, db: Session = Depends(get_db)):
    """Fetch all bookings for a specific user"""
    from services.booking_service import get_user_bookings_service
    bookings = get_user_bookings_service(user_id, db)
    
    result = []
    for b in bookings:
        result.append({
            "booking_id": b.id,
            "trip_id": b.trip_id,
            "source": b.source,
            "destination": b.destination,
            "bus_name": b.bus_name,
            "email": b.email,
            "total_amount": b.total_amount,
            "status": b.status,
            "booking_time": b.booking_time.strftime("%Y-%m-%d %H:%M"),
            "passengers": b.passenger_details or []

        })
    return result


        
    return result

from services.booking_service import perform_cancellation

@router.post("/bookings/cancel")
def cancel_booking(data: CancelRequest, db: Session = Depends(get_db)):
    result = perform_cancellation(data.booking_id, data.user_id, db)
    import logging
    logger = logging.getLogger("SmartBus")
    if "error" in result:
        logger.error(f"CANCEL | Fail | User: {data.user_id} | Booking: {data.booking_id} | Error: {result['error']}")
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail=result["error"])
    
    logger.info(f"CANCEL | Success | User: {data.user_id} | Booking: {data.booking_id}")
    return result



    


from chatbot.hanlder import chatbot_handler

@router.post("/chat", response_model=ChatResponse)
def handle_chat(data: ChatRequest, db: Session = Depends(get_db)):
    # Call the new AI Handler with session_id
    result = chatbot_handler(data.user_id, data.session_id, data.message, db)
    return {
        "intent": result["intent"],
        "message": result["response"],
        "entities": result["entities"],
        "data": result["data"]
    }

















@router.get("/bookings/{booking_id}/download")
def download_ticket(booking_id: int, db: Session = Depends(get_db)):
    from services.ticket_service import generate_ticket_pdf
    from fastapi.responses import Response

    pdf_content, error = generate_ticket_pdf(booking_id, db)
    if error:
        raise HTTPException(status_code=404, detail=error)

    headers = {
        'Content-Disposition': f'attachment; filename="SmartBus_Ticket_{booking_id}.pdf"'
    }
    return Response(content=pdf_content, media_type="application/pdf", headers=headers)

@router.post("/bookings/details")
def get_booking_details(data: BookingViewRequest, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(
        Booking.id == data.booking_id,
        Booking.user_id == data.user_id
    ).first()
    
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found or access denied")
        
    return {
        "booking_id": booking.id,
        "bus_name": booking.bus_name,
        "source": booking.source,
        "destination": booking.destination,
        "total_amount": booking.total_amount,
        "status": booking.status,
        "booking_time": booking.booking_time,
        "passenger_details": booking.passenger_details or []
    }


def check_admin(user_id: str, db: Session):
    user = db.query(User).filter(User.id == user_id).first()
    if not user or not getattr(user, 'is_admin', False):
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

@router.post("/admin/buses")
def admin_add_bus(data: BusCreate, db: Session = Depends(get_db)):
    check_admin(data.user_id, db)
    
    # 1. Create Bus
    new_bus = Bus(
        bus_number=data.bus_number,
        bus_name=data.bus_name,
        type=data.type,
        capacity=data.capacity
    )
    db.add(new_bus)
    db.flush() # Get the bus ID
    
    # 2. Automatically Create Seats
    for i in range(1, data.capacity + 1):
        # Format: 1A, 1B, 2A, 2B...
        row = (i + 1) // 2
        suffix = 'A' if i % 2 != 0 else 'B'
        seat_num = f"{row}{suffix}"
        
        db.add(Seat(bus_id=new_bus.id, seat_number=seat_num))
    
    db.commit()
    return {"message": f"Bus '{data.bus_name}' ({data.bus_number}) and {data.capacity} seats created successfully", "bus_id": new_bus.id}


@router.post("/admin/trips")
def admin_add_trip(data: TripCreate, db: Session = Depends(get_db)):
    check_admin(data.user_id, db)
    
    # 1. Verify Bus exists
    bus = db.query(Bus).filter(Bus.id == data.bus_id).first()
    if not bus:
        raise HTTPException(status_code=404, detail="Bus not found")
        
    # 2. Create Trip
    new_trip = Trip(
        bus_id=data.bus_id,
        source=data.source,
        destination=data.destination,
        departure_time=data.departure_time,
        arrival_time=data.arrival_time,
        price=data.price,
        routing_points=data.routing_points
    )
    db.add(new_trip)
    db.flush() # Get trip ID
    
    # 3. Automatically Initialize All Seats for this trip
    bus_seats = db.query(Seat).filter(Seat.bus_id == bus.id).all()
    for seat in bus_seats:
        db.add(TripSeat(trip_id=new_trip.id, seat_id=seat.id, is_booked=False))
        
    db.commit()
    return {"message": "Trip created and seats initialized successfully", "trip_id": new_trip.id}

@router.get("/bookings/my")
def get_bookings_by_email(email: str, db: Session = Depends(get_db)):
    """Fetch bookings based on email address"""
    bookings = db.query(Booking).filter(Booking.email == email).all()
    
    result = []
    for b in bookings:
        result.append({
            "booking_id": b.id,
            "trip_id": b.trip_id,
            "source": b.source,
            "destination": b.destination,
            "bus_name": b.bus_name,
            "email": b.email,
            "total_amount": b.total_amount,
            "status": b.status,
            "booking_time": b.booking_time.strftime("%Y-%m-%d %H:%M"),
            "passengers": b.passenger_details or []
        })
    return result

# --- ADMIN BUS CRUD ---

@router.get("/admin/buses")
def admin_list_buses(user_id: str, db: Session = Depends(get_db)):
    check_admin(user_id, db)
    return db.query(Bus).all()

@router.put("/admin/buses/{bus_id}")
def admin_update_bus(bus_id: int, data: BusUpdate, db: Session = Depends(get_db)):
    check_admin(data.user_id, db)
    bus = db.query(Bus).filter(Bus.id == bus_id).first()
    if not bus: raise HTTPException(status_code=404, detail="Bus not found")
    
    update_data = data.dict(exclude_unset=True, exclude={"user_id"})
    for key, value in update_data.items():
        setattr(bus, key, value)
    
    db.commit()
    return {"message": "Bus updated successfully", "bus": bus}

@router.delete("/admin/buses/{bus_id}")
def admin_delete_bus(bus_id: int, user_id: str, db: Session = Depends(get_db)):
    check_admin(user_id, db)
    bus = db.query(Bus).filter(Bus.id == bus_id).first()
    if not bus: raise HTTPException(status_code=404, detail="Bus not found")
    
    # Manual cascade delete for seats and trips if not using DB cascade
    db.query(Seat).filter(Seat.bus_id == bus_id).delete()
    db.query(Trip).filter(Trip.bus_id == bus_id).delete()
    
    db.delete(bus)
    db.commit()
    return {"message": "Bus and all associated seats/trips deleted successfully"}


# --- ADMIN TRIP CRUD ---

@router.get("/admin/trips")
def admin_list_trips(user_id: str, db: Session = Depends(get_db)):
    check_admin(user_id, db)
    return db.query(Trip).all()

@router.put("/admin/trips/{trip_id}")
def admin_update_trip(trip_id: int, data: TripUpdate, db: Session = Depends(get_db)):
    check_admin(data.user_id, db)
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip: raise HTTPException(status_code=404, detail="Trip not found")
    
    update_data = data.dict(exclude_unset=True, exclude={"user_id"})
    for key, value in update_data.items():
        setattr(trip, key, value)
    
    db.commit()
    return {"message": "Trip updated successfully", "trip": trip}

@router.delete("/admin/trips/{trip_id}")
def admin_delete_trip(trip_id: int, user_id: str, db: Session = Depends(get_db)):
    check_admin(user_id, db)
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip: raise HTTPException(status_code=404, detail="Trip not found")
    
    # Manual cascade delete for trip seats
    db.query(TripSeat).filter(TripSeat.trip_id == trip_id).delete()
    
    db.delete(trip)
    db.commit()
    return {"message": "Trip and all associated seats deleted successfully"}

@router.get("/admin/buses/{bus_id}")
def admin_get_bus(bus_id: int, user_id: str, db: Session = Depends(get_db)):
    check_admin(user_id, db)
    bus = db.query(Bus).filter(Bus.id == bus_id).first()
    if not bus: raise HTTPException(status_code=404, detail="Bus not found")
    return bus

@router.get("/admin/trips/{trip_id}")
def admin_get_trip(trip_id: int, user_id: str, db: Session = Depends(get_db)):
    check_admin(user_id, db)
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip: raise HTTPException(status_code=404, detail="Trip not found")
    return trip
