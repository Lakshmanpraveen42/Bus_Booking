from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.db.session import get_db
from app.models.models import Trip, Bus, Booking
from app.schemas.schemas import TripResponse

router = APIRouter()

@router.get("/search", response_model=List[TripResponse])
async def search_trips(
    source: str = Query(...),
    destination: str = Query(...),
    date: str = Query(...), # Format YYYY-MM-DD
    db: Session = Depends(get_db)
):
    # Basic date filtering logic
    start_date = datetime.strptime(date, "%Y-%m-%d")
    end_date = start_date.replace(hour=23, minute=59, second=59)
    
    trips = db.query(Trip).join(Bus).filter(
        Trip.source.ilike(f"%{source}%"),
        Trip.destination.ilike(f"%{destination}%"),
        Trip.departure_time >= start_date,
        Trip.departure_time <= end_date
    ).all()
    
    return trips

@router.get("/{trip_id}", response_model=TripResponse)
async def get_trip(trip_id: int, db: Session = Depends(get_db)):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return trip

@router.get("/{trip_id}/seats", response_model=dict)
async def get_trip_seats(trip_id: int, db: Session = Depends(get_db)):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    # Get all bookings for this trip
    bookings = db.query(Booking).filter(Booking.trip_id == trip_id, Booking.status == "booked").all()
    
    booked_seats = []
    for b in bookings:
        # seat_numbers is stored as comma separated string e.g. "A1,A2"
        seats = [s.strip() for s in b.seat_numbers.split(",")]
        booked_seats.extend(seats)
    
    return {
        "trip_id": trip_id,
        "total_seats": trip.bus.total_seats,
        "booked_seats": booked_seats,
        "price": trip.price,
        "category": trip.bus.category
    }
