from pydantic import BaseModel, EmailStr
from datetime import datetime


class UserRegister(BaseModel):
    name: str
    email: EmailStr
    phone: str
    password: str

class OTPVerify(BaseModel):
    email: EmailStr
    otp: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Passenger(BaseModel):
    name: str
    age: int
    gender: str
    seat_number: str


class BookingRequest(BaseModel):
    user_id: str
    email: EmailStr
    source: str
    destination: str
    price: float
    trip_id: int
    bus_name: str
    passengers: list[Passenger]

class CancelRequest(BaseModel):
    user_id: str
    booking_id: int

from typing import Dict, Any

from pydantic import BaseModel, RootModel
from typing import Dict, Any

class ChatRequest(BaseModel):
    user_id: str
    session_id: str
    message: str


class ChatResponse(BaseModel):
    intent: str
    message: str
    entities: dict = None
    data: list = []










class BookingViewRequest(BaseModel):
    user_id: str
    booking_id: int

class BusCreate(BaseModel):
    user_id: str
    bus_number: str
    bus_name: str
    type: str
    capacity: int



class TripCreate(BaseModel):
    user_id: str
    bus_id: int
    source: str
    destination: str
    departure_time: datetime
    arrival_time: datetime
    price: float
    routing_points: list[str] = []

class BusUpdate(BaseModel):
    user_id: str
    bus_number: str | None = None
    bus_name: str | None = None
    type: str | None = None
    capacity: int | None = None

class TripUpdate(BaseModel):
    user_id: str
    bus_id: int | None = None
    source: str | None = None
    destination: str | None = None
    departure_time: datetime | None = None
    arrival_time: datetime | None = None
    price: float | None = None
    routing_points: list[str] | None = None
