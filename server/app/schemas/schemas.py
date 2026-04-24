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

class PasswordChange(BaseModel):
    old_password: str
    new_password: str

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

class TripStopCreate(BaseModel):
    location: str
    arrival_time: Optional[datetime] = None
    order: int

class TripCreate(TripBase):
    stops: Optional[List[TripStopCreate]] = []

class TripStopResponse(BaseModel):
    location: str
    arrival_time: Optional[datetime] = None
    order: int
    class Config:
        from_attributes = True

class TripResponse(BaseModel):
    id: int
    source: str
    destination: str
    departure_time: datetime
    arrival_time: datetime
    price: float
    bus_id: int
    bus: Optional[BusResponse] = None
    stops: List[TripStopResponse] = []
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

class PassengerSchema(BaseModel):
    name: str
    age: int
    gender: str
    seatId: str


# --- Booking Schemas ---
class BookingCreate(BaseModel):
    trip_id: int
    seat_numbers: str
    total_amount: float
    passengers: List[PassengerSchema]
    boarding_point: Optional[str] = None
    dropping_point: Optional[str] = None

class BookingResponse(BaseModel):
    id: int
    trip_id: int
    seat_numbers: str
    total_amount: float
    status: str
    payment_status: str
    qr_code_path: Optional[str] = None
    booking_time: datetime
    cancellation_time: Optional[datetime] = None
    passenger_details: Optional[str] = None
    boarding_point: Optional[str] = None
    dropping_point: Optional[str] = None
    trip: Optional[TripResponse] = None

    class Config:
        from_attributes = True
