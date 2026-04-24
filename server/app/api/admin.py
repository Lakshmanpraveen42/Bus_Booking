from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.models import Bus, Trip, Booking, User, TripStop, Setting
from app.schemas.schemas import BusCreate, BusResponse, TripCreate, TripResponse, BookingResponse
from app.api.dependencies import get_current_admin

router = APIRouter()

def validate_trip_data(db: Session, trip_in: TripCreate, trip_id: int = None):
    # 1. Basic Time Check: Arrival must be after Departure
    if trip_in.arrival_time <= trip_in.departure_time:
        raise HTTPException(status_code=400, detail="Trip arrival time must be after departure time")

    # 2. Sequential Stop Check
    last_time = trip_in.departure_time
    for i, stop in enumerate(trip_in.stops):
        if stop.arrival_time and stop.arrival_time <= last_time:
            raise HTTPException(
                status_code=400, 
                detail=f"Stop {i+1} ({stop.location}) arrival time must be after previous stop/departure"
            )
        if stop.arrival_time:
            last_time = stop.arrival_time
            
    if trip_in.arrival_time <= last_time:
        raise HTTPException(status_code=400, detail="Final destination arrival must be after last intermediate stop")

    # 3. Duplicate Trip Check (Same bus, same source/dest, same time)
    query = db.query(Trip).filter(
        Trip.bus_id == trip_in.bus_id,
        Trip.source == trip_in.source,
        Trip.destination == trip_in.destination,
        Trip.departure_time == trip_in.departure_time
    )
    if trip_id:
        query = query.filter(Trip.id != trip_id)
    if query.first():
        raise HTTPException(status_code=400, detail="A duplicate trip for this vehicle at this time already exists")

    # 4. Bus Conflict Check (Overlap)
    # A bus cannot start a new trip if it hasn't finished its previous one (+ 30 min buffer)
    buffer = 30 # minutes
    conflict = db.query(Trip).filter(
        Trip.bus_id == trip_in.bus_id,
        Trip.is_cancelled == False
    )
    if trip_id:
        conflict = conflict.filter(Trip.id != trip_id)
        
    for trip in conflict.all():
        # Check if [trip_in.departure, trip_in.arrival] overlaps with [trip.departure, trip.arrival]
        start_a = trip_in.departure_time
        end_a = trip_in.arrival_time
        start_b = trip.departure_time
        end_b = trip.arrival_time
        
        if (start_a <= end_b) and (end_a >= start_b):
            raise HTTPException(
                status_code=400, 
                detail=f"Bus conflict: This vehicle is already assigned to a trip from {trip.source} to {trip.destination} during this period."
            )

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

@router.put("/buses/{bus_id}", response_model=BusResponse)
async def update_bus(
    bus_id: int,
    bus_in: BusCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    db_bus = db.query(Bus).filter(Bus.id == bus_id).first()
    if not db_bus:
        raise HTTPException(status_code=404, detail="Bus not found")
        
    for key, value in bus_in.dict().items():
        setattr(db_bus, key, value)
        
    db.commit()
    db.refresh(db_bus)
    return db_bus

@router.delete("/buses/{bus_id}")
async def delete_bus(
    bus_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    db_bus = db.query(Bus).filter(Bus.id == bus_id).first()
    if not db_bus:
        raise HTTPException(status_code=404, detail="Bus not found")
        
    db.delete(db_bus)
    db.commit()
    return {"message": "Bus deleted successfully"}

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
        
    # Run Validations
    validate_trip_data(db, trip_in)
    
    try:
        # Create Trip
        trip_data = trip_in.dict()
        stops_data = trip_data.pop("stops", [])
        
        db_trip = Trip(**trip_data)
        db.add(db_trip)
        db.flush() # Get ID without committing
        
        # Create stops
        for stop in stops_data:
            db_stop = TripStop(
                trip_id=db_trip.id,
                location=stop["location"],
                arrival_time=stop["arrival_time"],
                order=stop["order"]
            )
            db.add(db_stop)
        
        db.commit()
        db.refresh(db_trip)
        return db_trip
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/trips/{trip_id}")
async def delete_trip(
    trip_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    db_trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not db_trip:
        raise HTTPException(status_code=404, detail="Trip not found")
        
    try:
        # Delete stops first
        db.query(TripStop).filter(TripStop.trip_id == trip_id).delete()
        db.delete(db_trip)
        db.commit()
        return {"message": "Route deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to delete route")

@router.put("/trips/{trip_id}", response_model=TripResponse)
async def update_trip(
    trip_id: int,
    trip_in: TripCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    db_trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not db_trip:
        raise HTTPException(status_code=404, detail="Trip not found")
        
    # Run Validations
    validate_trip_data(db, trip_in, trip_id=trip_id)
    
    try:
        # Update trip details
        trip_data = trip_in.dict()
        stops_data = trip_data.pop("stops", [])
        
        for key, value in trip_data.items():
            setattr(db_trip, key, value)
            
        # Full rewrite of stops for simplicity
        db.query(TripStop).filter(TripStop.trip_id == trip_id).delete()
        for stop in stops_data:
            db_stop = TripStop(
                trip_id=db_trip.id,
                location=stop["location"],
                arrival_time=stop["arrival_time"],
                order=stop["order"]
            )
            db.add(db_stop)
            
        db.commit()
        db.refresh(db_trip)
        return db_trip
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

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

@router.get("/users")
async def list_all_users(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """List all registered users (Admin only)"""
    users = db.query(User).all()
    return users

# --- Settings Management ---

@router.get("/settings")
async def get_settings(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Retrieve all global settings"""
    settings = db.query(Setting).all()
    return {s.key: s.value for s in settings}

@router.post("/settings")
async def update_settings(
    settings_in: dict,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Update global settings"""
    for key, value in settings_in.items():
        db_setting = db.query(Setting).filter(Setting.key == key).first()
        if db_setting:
            db_setting.value = str(value)
        else:
            db_setting = Setting(key=key, value=str(value))
            db.add(db_setting)
    
    db.commit()
    return {"message": "Settings updated successfully"}
