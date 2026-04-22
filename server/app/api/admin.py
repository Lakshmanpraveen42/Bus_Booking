from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.models import Bus, Trip, Booking, User
from app.schemas.schemas import BusCreate, BusResponse, TripCreate, TripResponse, BookingResponse
from app.api.dependencies import get_current_admin

router = APIRouter()

# --- Bus Management ---

@router.get("/buses", response_model=List[BusResponse])
async def list_all_buses(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    return db.query(Bus).all()

@router.post("/buses", response_model=BusResponse)
async def create_bus(
    bus_in: BusCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    # Check if vehicle exists
    existing = db.query(Bus).filter(Bus.vehicle_number == bus_in.vehicle_number).first()
    if existing:
        raise HTTPException(status_code=400, detail="Vehicle number already exists")
        
    db_bus = Bus(**bus_in.dict())
    db.add(db_bus)
    db.commit()
    db.refresh(db_bus)
    return db_bus

# --- Trip/Route Management ---

@router.post("/trips", response_model=TripResponse)
async def create_trip(
    trip_in: TripCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    # Verify bus exists
    bus = db.query(Bus).filter(Bus.id == trip_in.bus_id).first()
    if not bus:
        raise HTTPException(status_code=404, detail="Bus not found")
        
    db_trip = Trip(**trip_in.dict())
    db.add(db_trip)
    db.commit()
    db.refresh(db_trip)
    return db_trip

# --- Booking Ledger ---

@router.get("/bookings", response_model=List[BookingResponse])
async def list_all_bookings(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    return db.query(Booking).all()

@router.get("/trips", response_model=List[TripResponse])
async def list_all_trips(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    return db.query(Trip).all()
