from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True)  # custom user_id
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True)
    phone = Column(String)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    is_verified = Column(Boolean, default=False)

    bookings = relationship("Booking", back_populates="user")

class Bus(Base):
    __tablename__ = "buses"

    id = Column(Integer, primary_key=True, index=True)
    bus_number = Column(String, unique=True)
    bus_name = Column(String)
    capacity = Column(Integer)

    type = Column(String)

    trips = relationship("Trip", back_populates="bus")
    seats = relationship("Seat", back_populates="bus")

class Seat(Base):
    __tablename__ = "seats"

    id = Column(Integer, primary_key=True)
    seat_number = Column(String)
    bus_id = Column(Integer, ForeignKey("buses.id"))

    bus = relationship("Bus", back_populates="seats")

class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True)
    bus_id = Column(Integer, ForeignKey("buses.id"))
    source = Column(String)
    destination = Column(String)
    departure_time = Column(DateTime)
    arrival_time = Column(DateTime)
    price = Column(Float)
    routing_points = Column(JSON) # Stores JSON list of intermediate stops


    bus = relationship("Bus", back_populates="trips")
    trip_seats = relationship("TripSeat", back_populates="trip")

class TripSeat(Base):
    __tablename__ = "trip_seats"

    id = Column(Integer, primary_key=True)
    trip_id = Column(Integer, ForeignKey("trips.id"))
    seat_id = Column(Integer, ForeignKey("seats.id"))
    is_booked = Column(Boolean, default=False)

    trip = relationship("Trip", back_populates="trip_seats")
    seat = relationship("Seat")

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"))
    trip_id = Column(Integer, ForeignKey("trips.id"))
    total_amount = Column(Float)
    
    # New fields for detailed booking info
    source = Column(String)
    destination = Column(String)
    bus_name = Column(String)
    email = Column(String) # For cancellation emails
    passenger_details = Column(JSON) # JSON string for name, age, gen, seats

    
    payment_status = Column(String, default="paid")  # pending, paid, failed
    status = Column(String, default="booked")        # booked, cancelled
    booking_time = Column(DateTime, default=datetime.utcnow)


    user = relationship("User", back_populates="bookings")

class OTP(Base):

    __tablename__ = "otps"

    id = Column(Integer, primary_key=True)
    phone = Column(String)
    otp = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
