from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, aliased
from sqlalchemy import and_, or_
from typing import List
from datetime import datetime
from app.db.session import get_db
from app.models.models import Trip, Bus, Booking, TripStop
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
    try:
        start_date = datetime.strptime(date, "%Y-%m-%d")
        end_date = start_date.replace(hour=23, minute=59, second=59)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")
    
    S1 = aliased(TripStop)
    S2 = aliased(TripStop)

    # Find trips where a stop matching 'source' comes before a stop matching 'destination'
    # Or where the Trip source/destination matches
    trips = db.query(Trip).join(Bus).outerjoin(S1, Trip.id == S1.trip_id)\
        .outerjoin(S2, Trip.id == S2.trip_id).filter(
            Trip.departure_time >= start_date,
            Trip.departure_time <= end_date
        ).filter(
            or_(
                # Method 1: Main endpoints match
                and_(Trip.source.ilike(f"%{source}%"), Trip.destination.ilike(f"%{destination}%")),
                # Method 2: Intermediate stops match in correct order
                and_(S1.location.ilike(f"%{source}%"), S2.location.ilike(f"%{destination}%"), S1.order < S2.order)
            )
        ).distinct().all()
    
    return trips

@router.get("/locations", response_model=List[str])
async def get_locations(db: Session = Depends(get_db)):
    sources = db.query(Trip.source).distinct().all()
    destinations = db.query(Trip.destination).distinct().all()
    stops = db.query(TripStop.location).distinct().all()
    
    # Flatten and combine unique locations
    locations = set()
    for s in sources: locations.add(s[0])
    for d in destinations: locations.add(d[0])
    for st in stops: locations.add(st[0])
        
    return sorted(list(locations))

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
        "category": trip.bus.category,
        "stops": [
            {
                "location": s.location,
                "arrival_time": s.arrival_time,
                "order": s.order
            } for s in sorted(trip.stops, key=lambda x: x.order)
        ]
    }
