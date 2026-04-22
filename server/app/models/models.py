from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.session import Base
import pytz

def get_local_time():
    return datetime.now(pytz.timezone("Asia/Kolkata"))

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=get_local_time)

class Bus(Base):
    __tablename__ = "buses"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False) # e.g. Delux, Rajadhani
    vehicle_number = Column(String, unique=True, nullable=False)
    total_seats = Column(Integer, default=40)

class Trip(Base):
    __tablename__ = "trips"
    id = Column(Integer, primary_key=True, index=True)
    bus_id = Column(Integer, ForeignKey("buses.id"))
    source = Column(String, nullable=False)
    destination = Column(String, nullable=False)
    departure_time = Column(DateTime, nullable=False)
    arrival_time = Column(DateTime, nullable=False)
    price = Column(Float, nullable=False)
    
    bus = relationship("Bus", backref="trips")

class Booking(Base):
    __tablename__ = "bookings"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    trip_id = Column(Integer, ForeignKey("trips.id"))
    seat_numbers = Column(String, nullable=False) # List stored as string
    total_amount = Column(Float, nullable=False)
    qr_code_path = Column(String, nullable=True)
    payment_status = Column(String, default="paid") # paid, pending, failed
    status = Column(String, default="booked") # booked, canceled
    booking_time = Column(DateTime, default=get_local_time)

    user = relationship("User", backref="bookings")
    trip = relationship("Trip", backref="bookings")

class OTP(Base):
    __tablename__ = "otps"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, index=True)
    code = Column(String, nullable=False)
    expires_at = Column(DateTime, nullable=False)
