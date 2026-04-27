import json
from datetime import datetime, timedelta

from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload
from db.models import Trip, TripSeat, Seat

def search_trips_service(source: str, destination: str, travel_date: str, db: Session):
    try:
        # 🗓️ SMART DATE PARSER
        if travel_date:
            # Aggressively clean the date string from LLM fluff
            travel_date = str(travel_date).lower().strip()
            # Remove anything after a quote or hash or newline
            for char in ['"', "'", "#", "\n"]:
                travel_date = travel_date.split(char)[0].strip()
            
            # Extract only the first word (should be the date or relative term)
            travel_date = travel_date.split()[0]
            
            # Handle relative dates
            now = datetime.now()
            if travel_date == "today":
                travel_date = now.strftime("%Y-%m-%d")
            elif travel_date == "tomorrow":
                travel_date = (now + timedelta(days=1)).strftime("%Y-%m-%d")

        # Final parse
        travel_dt = datetime.strptime(travel_date, "%Y-%m-%d").date()



        
        # Query trips for the given date
        all_trips = db.query(Trip).options(joinedload(Trip.bus)).filter(
            func.date(Trip.departure_time) == travel_dt
        ).all()
        
        results = []
        for trip in all_trips:
            # Construct the full sequence of points for this trip
            routing = trip.routing_points if trip.routing_points else []
            full_route = [trip.source.lower()] + [p.lower() for p in routing] + [trip.destination.lower()]
            
            # Check if both requested points exist in the route and in correct order
            s_low = source.lower()
            d_low = destination.lower()

            if s_low in full_route and d_low in full_route:
                source_idx = full_route.index(s_low)
                dest_idx = full_route.index(d_low)

                
                if source_idx < dest_idx:
                    # Calculate available seats
                    available_seats = db.query(TripSeat).filter(
                        TripSeat.trip_id == trip.id,
                        TripSeat.is_booked == False
                    ).count()
                    
                    # Calculate trip duration
                    duration = trip.arrival_time - trip.departure_time
                    duration_hours = duration.seconds // 3600 + (duration.days * 24)
                    duration_minutes = (duration.seconds // 60) % 60
                    duration_text = f"{duration_hours}h {duration_minutes}m"
                    
                    # Intermediate stops
                    queried_routing = full_route[source_idx + 1 : dest_idx]
                    via_text = f" -> {' -> '.join(queried_routing)}" if queried_routing else ""

                    results.append({
                        "trip_id": trip.id,
                        "bus_id": trip.bus.id,
                        "bus_name": trip.bus.bus_name,
                        "bus_number": trip.bus.bus_number,
                        "bus_type": trip.bus.type,
                        "trip_source": trip.source,
                        "trip_destination": trip.destination,
                        "departure_time": trip.departure_time.strftime("%Y-%m-%d %H:%M"),
                        "arrival_time": trip.arrival_time.strftime("%Y-%m-%d %H:%M"),
                        "trip_duration": duration_text,
                        "price": trip.price,
                        "available_seats": available_seats,
                        "routing_points": routing,
                        "match_details": f"{source}{via_text} -> {destination}"
                    })
        return results
    except Exception as e:
        print(f"Error in search_trips_service: {e}")
        return []

def get_trip_seats_service(trip_id: int, db: Session):
    try:
        # Get the trip details
        trip = db.query(Trip).options(joinedload(Trip.bus)).filter(Trip.id == trip_id).first()
        if not trip:
            return {"error": "Trip not found"}

        # Get all trip seats
        trip_seats = db.query(TripSeat).join(Seat).filter(TripSeat.trip_id == trip_id).all()
        
        # Prepare seat list
        seats_list = []
        for ts in trip_seats:
            seats_list.append({
                "trip_seat_id": ts.id,
                "seat_id": ts.seat_id,
                "seat_number": ts.seat.seat_number,
                "is_booked": ts.is_booked
            })
        
        return {
            "trip_id": trip.id,
            "bus_name": trip.bus.bus_name,
            "bus_number": trip.bus.bus_number,
            "bus_type": trip.bus.type,
            "total_seats": len(trip_seats),
            "available_seats": sum(1 for ts in trip_seats if not ts.is_booked),
            "seats": seats_list
        }
    except Exception as e:
        print(f"Error in get_trip_seats_service: {e}")
        return {"error": str(e)}
