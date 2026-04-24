from sqlalchemy.orm import Session
from app.db.session import SessionLocal, engine, Base
from app.models.models import Bus, Trip, TripStop
from datetime import datetime, timedelta
import pytz

def seed_routes():
    db = SessionLocal()
    ist = pytz.timezone("Asia/Kolkata")
    
    # Get all buses to assign
    buses = db.query(Bus).all()
    if not buses:
        print("Error: No buses found in DB. Run seed_buses.py first.")
        return

    # Helper to parse time and handle day wrap
    def get_dt(base_date, time_str, day_offset=0):
        hour, minute = map(int, time_str.split(':'))
        dt = datetime(base_date.year, base_date.month, base_date.day, hour, minute)
        dt = dt + timedelta(days=day_offset)
        return ist.localize(dt)

    # May 2026 Dates
    dates = [24, 25, 26, 27, 28, 29, 30]
    
    routes_data = [
        {
            "source": "Hyderabad",
            "destination": "Palakollu",
            "departure": "21:00",
            "arrival": "06:30",
            "arrival_offset": 1,
            "price": 850,
            "stops": [
                ("Hyderabad (MGBS)", "21:00", 0),
                ("LB Nagar", "21:30", 0),
                ("Hayathnagar", "22:00", 0),
                ("Choutuppal", "22:45", 0),
                ("Suryapet", "00:15", 1),
                ("Kodad", "01:00", 1),
                ("Vijayawada (Benz Circle)", "03:00", 1),
                ("Eluru", "04:30", 1),
                ("Bhimavaram", "05:45", 1),
                ("Palakollu", "06:30", 1)
            ]
        },
        {
            "source": "Hyderabad",
            "destination": "Vijayawada",
            "departure": "22:00",
            "arrival": "04:30",
            "arrival_offset": 1,
            "price": 600,
            "stops": [
                ("Hyderabad (Ameerpet)", "22:00", 0),
                ("LB Nagar", "22:30", 0),
                ("Hayathnagar", "23:00", 0),
                ("Choutuppal", "23:45", 0),
                ("Suryapet", "01:15", 1),
                ("Kodad", "02:00", 1),
                ("Nandigama", "03:15", 1),
                ("Vijayawada", "04:30", 1)
            ]
        },
        {
            "source": "Hyderabad",
            "destination": "Chennai",
            "departure": "18:00",
            "arrival": "07:00",
            "arrival_offset": 1,
            "price": 1200,
            "stops": [
                ("Hyderabad (Miyapur)", "18:00", 0),
                ("Ameerpet", "18:30", 0),
                ("LB Nagar", "19:15", 0),
                ("Jadcherla", "21:00", 0),
                ("Kurnool", "23:30", 0),
                ("Anantapur", "02:00", 1),
                ("Dharmavaram", "03:00", 1),
                ("Kadapa", "04:30", 1),
                ("Tirupati", "05:30", 1),
                ("Chennai (Koyambedu)", "07:00", 1)
            ]
        },
        {
            "source": "Chennai",
            "destination": "Hyderabad",
            "departure": "19:00",
            "arrival": "08:30",
            "arrival_offset": 1,
            "price": 1200,
            "stops": [
                ("Chennai (Koyambedu)", "19:00", 0),
                ("Tirupati", "21:00", 0),
                ("Kadapa", "22:30", 0),
                ("Anantapur", "01:30", 1),
                ("Kurnool", "03:30", 1),
                ("Jadcherla", "06:00", 1),
                ("LB Nagar", "07:30", 1),
                ("Hyderabad (MGBS)", "08:30", 1)
            ]
        },
        {
            "source": "Narasapur",
            "destination": "Hyderabad",
            "departure": "20:30",
            "arrival": "06:30",
            "arrival_offset": 1,
            "price": 900,
            "stops": [
                ("Narasapur", "20:30", 0),
                ("Palakollu", "21:00", 0),
                ("Bhimavaram", "21:45", 0),
                ("Eluru", "23:30", 0),
                ("Vijayawada", "01:00", 1),
                ("Nandigama", "02:00", 1),
                ("Kodad", "03:15", 1),
                ("Suryapet", "04:00", 1),
                ("Choutuppal", "05:15", 1),
                ("Hyderabad", "06:30", 1)
            ]
        },
        {
            "source": "Palakollu",
            "destination": "Visakhapatnam",
            "departure": "21:00",
            "arrival": "06:00",
            "arrival_offset": 1,
            "price": 950,
            "stops": [
                ("Palakollu", "21:00", 0),
                ("Bhimavaram", "21:45", 0),
                ("Eluru", "23:30", 0),
                ("Vijayawada", "01:30", 1),
                ("Guntur", "02:15", 1),
                ("Chilakaluripet", "03:15", 1),
                ("Ongole", "04:30", 1),
                ("Rajahmundry", "05:30", 1),
                ("Anakapalle", "05:45", 1),
                ("Visakhapatnam", "06:00", 1)
            ]
        }
    ]

    print(f"Seeding {len(dates) * len(routes_data)} trips...")

    for day in dates:
        base_date = datetime(2026, 5, day)
        for i, rd in enumerate(routes_data):
            # Assign bus cyclically
            bus = buses[i % len(buses)]
            
            trip = Trip(
                bus_id=bus.id,
                source=rd["source"],
                destination=rd["destination"],
                departure_time=get_dt(base_date, rd["departure"]),
                arrival_time=get_dt(base_date, rd["arrival"], rd["arrival_offset"]),
                price=rd["price"]
            )
            db.add(trip)
            db.flush() # Get trip.id
            
            for idx, (loc, time, offset) in enumerate(rd["stops"]):
                stop = TripStop(
                    trip_id=trip.id,
                    location=loc,
                    arrival_time=get_dt(base_date, time, offset),
                    order=idx
                )
                db.add(stop)
                
    db.commit()
    print("Seeding completed successfully!")
    db.close()

if __name__ == "__main__":
    seed_routes()
