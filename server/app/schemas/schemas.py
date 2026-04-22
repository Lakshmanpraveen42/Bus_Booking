from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

# --- User Schemas ---
class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_admin: bool
    is_verified: bool
    created_at: datetime
    class Config:
        from_attributes = True

# --- Token Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# --- OTP Schemas ---
class OTPVerify(BaseModel):
    email: EmailStr
    code: str

# --- Bus Schemas ---
class BusBase(BaseModel):
    name: str
    category: str
    vehicle_number: str
    total_seats: int

class BusCreate(BusBase):
    pass

class BusResponse(BusBase):
    id: int
    class Config:
        from_attributes = True

# --- Trip & Route Schemas ---
class TripBase(BaseModel):
    source: str
    destination: str
    departure_time: datetime
    arrival_time: datetime
    price: float
    bus_id: int

class TripCreate(TripBase):
    pass

class TripResponse(BaseModel):
    id: int
    source: str
    destination: str
    departure_time: datetime
    arrival_time: datetime
    price: float
    bus_id: int
    bus: Optional[BusResponse] = None
    class Config:
        from_attributes = True

# --- Seat Schemas ---
class SeatSchema(BaseModel):
    id: str
    status: str # available, booked, selected
    price: float

class TripSeatLayout(BaseModel):
    trip_id: int
    total_seats: int
    booked_seats: List[str]
    price: float

# --- Booking Schemas ---
class BookingCreate(BaseModel):
    trip_id: int
    seat_numbers: str
    total_amount: float

class BookingResponse(BaseModel):
    id: int
    trip_id: int
    seat_numbers: str
    total_amount: float
    status: str
    payment_status: str
    booking_time: datetime
    trip: Optional[TripResponse] = None
    class Config:
        from_attributes = True
