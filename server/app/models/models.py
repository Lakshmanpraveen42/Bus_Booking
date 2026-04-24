from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Float, func, UniqueConstraint, CheckConstraint
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.session import Base
import pytz

def get_local_time():
    return datetime.now(pytz.timezone("Asia/Kolkata"))

class User(Base):
    """Stores user accounts and administrative status."""
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, index=True, nullable=True)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=get_local_time)
    updated_at = Column(DateTime, default=get_local_time, onupdate=get_local_time)

class Bus(Base):
    """Represents a physical vehicle in the fleet."""
    __tablename__ = "buses"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False) # e.g. Deluxe, Rajadhani
    vehicle_number = Column(String, unique=True, index=True, nullable=False)
    total_seats = Column(Integer, default=40)
    created_at = Column(DateTime, default=get_local_time)
    updated_at = Column(DateTime, default=get_local_time, onupdate=get_local_time)

class Trip(Base):
    """Scheduled journeys between two locations."""
    __tablename__ = "trips"
    id = Column(Integer, primary_key=True, index=True)
    bus_id = Column(Integer, ForeignKey("buses.id"), index=True)
    source = Column(String, index=True, nullable=False)
    destination = Column(String, index=True, nullable=False)
    departure_time = Column(DateTime, index=True, nullable=False)
    arrival_time = Column(DateTime, index=True, nullable=False)
    price = Column(Float, nullable=False)
    is_cancelled = Column(Boolean, default=False)
    created_at = Column(DateTime, default=get_local_time)
    updated_at = Column(DateTime, default=get_local_time, onupdate=get_local_time)
    
    bus = relationship("Bus", backref="trips")

    __table_args__ = (
        UniqueConstraint('bus_id', 'departure_time', 'source', 'destination', name='uix_trip_sched'),
        CheckConstraint('arrival_time > departure_time', name='check_arrival_after_departure'),
    )

class Booking(Base):
    """Ticket reservations made by users."""
    __tablename__ = "bookings"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    trip_id = Column(Integer, ForeignKey("trips.id"), index=True)
    seat_numbers = Column(String, nullable=False) # List stored as comma-separated string
    total_amount = Column(Float, nullable=False)
    qr_code_path = Column(String, nullable=True)
    payment_status = Column(String, default="paid", index=True) # paid, pending, failed
    status = Column(String, default="booked", index=True) # booked, canceled
    booking_time = Column(DateTime, default=get_local_time, index=True)
    cancellation_time = Column(DateTime, nullable=True)
    passenger_details = Column(String, nullable=True) # JSON string of passengers
    boarding_point = Column(String, nullable=True)
    dropping_point = Column(String, nullable=True)
    created_at = Column(DateTime, default=get_local_time)
    updated_at = Column(DateTime, default=get_local_time, onupdate=get_local_time)

    user = relationship("User", backref="bookings")
    trip = relationship("Trip", backref="bookings")

class TripStop(Base):
    """Intermediate stops and boarding points for a trip."""
    __tablename__ = "trip_stops"
    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, ForeignKey("trips.id"), index=True)
    location = Column(String, index=True, nullable=False)
    arrival_time = Column(DateTime, nullable=True)
    order = Column(Integer, default=0) # To sequence: 0=Source, high=Destination
    
    trip = relationship("Trip", backref="stops")

class OTP(Base):
    """One-Time Passwords for verification."""
    __tablename__ = "otps"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, index=True, nullable=False)
    code = Column(String, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=get_local_time)

class Setting(Base):
    """Global system configuration settings."""
    __tablename__ = "settings"
    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, index=True, nullable=False)
    value = Column(String, nullable=True)
    updated_at = Column(DateTime, default=get_local_time, onupdate=get_local_time)
