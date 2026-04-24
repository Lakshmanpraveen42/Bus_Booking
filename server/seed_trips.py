from app.db.session import SessionLocal
from app.models.models import Trip, TripStop, Bus
from datetime import datetime, timedelta
from sqlalchemy.exc import IntegrityError

def seed_real_trips():
    db = SessionLocal()
    
    dates = [24, 25, 26, 27, 28, 29, 30]
    month = 4
    year = 2026

    # Data structure
    routes = [
        {
            "bus_id": 1,
            "source": "Hyderabad",
            "destination": "Palakollu",
            "dept_time": "21:00",
            "arr_offset": 1,
            "arr_time": "06:30",
            "price": 850,
            "stops": [
                ("Hyderabad (MGBS)", "21:00"),
                ("LB Nagar", "21:30"),
                ("Hayathnagar", "22:00"),
                ("Choutuppal", "22:45"),
                ("Suryapet", "00:15", 1),
                ("Kodad", "01:00", 1),
                ("Vijayawada", "03:00", 1),
                ("Eluru", "04:30", 1),
                ("Bhimavaram", "05:45", 1),
                ("Palakollu", "06:30", 1)
            ]
        },
        {
            "bus_id": 2,
            "source": "Palakollu",
            "destination": "Hyderabad",
            "dept_time": "20:30",
            "arr_offset": 1,
            "arr_time": "06:30",
            "price": 900,
            "stops": [
                ("Palakollu", "20:30"),
                ("Bhimavaram", "21:15"),
                ("Eluru", "23:00"),
                ("Vijayawada", "00:45", 1),
                ("Nandigama", "01:30", 1),
                ("Kodad", "02:45", 1),
                ("Suryapet", "03:30", 1),
                ("Choutuppal", "04:45", 1),
                ("LB Nagar", "05:45", 1),
                ("Hyderabad", "06:30", 1)
            ]
        },
        {
            "bus_id": 3,
            "source": "Visakhapatnam",
            "destination": "Hyderabad",
            "dept_time": "18:30",
            "arr_offset": 1,
            "arr_time": "07:30",
            "price": 1100,
            "stops": [
                ("Visakhapatnam", "18:30"),
                ("Anakapalle", "19:00"),
                ("Tuni", "20:00"),
                ("Rajahmundry", "22:00"),
                ("Eluru", "00:30", 1),
                ("Vijayawada", "01:30", 1),
                ("Nandigama", "02:30", 1),
                ("Kodad", "03:45", 1),
                ("Suryapet", "04:30", 1),
                ("Hyderabad", "07:30", 1)
            ]
        },
        {
            "bus_id": 4,
            "source": "Palakollu",
            "destination": "Chennai",
            "dept_time": "17:30",
            "arr_offset": 1,
            "arr_time": "08:30",
            "price": 1200,
            "stops": [
                ("Palakollu", "17:30"),
                ("Bhimavaram", "18:15"),
                ("Eluru", "20:00"),
                ("Vijayawada", "22:00"),
                ("Guntur", "22:45"),
                ("Ongole", "01:30", 1),
                ("Nellore", "04:00", 1),
                ("Gudur", "05:00", 1),
                ("Tirupati", "06:30", 1),
                ("Chennai", "08:30", 1)
            ]
        },
        {
            "bus_id": 5,
            "source": "Palakollu",
            "destination": "Hyderabad",
            "dept_time": "19:30",
            "arr_offset": 1,
            "arr_time": "07:15",
            "price": 950,
            "stops": [
                ("Palakollu", "19:30"),
                ("Narasapur", "20:00"),
                ("Mogalthur", "20:25"),
                ("Perupalem Junction", "21:00"),
                ("Kalidindi", "22:00"),
                ("Machilipatnam", "23:30"),
                ("Gudivada", "00:45", 1),
                ("Vijayawada", "01:30", 1),
                ("Nandigama", "02:30", 1),
                ("Kodad", "03:45", 1),
                ("Suryapet", "04:30", 1),
                ("Choutuppal", "05:45", 1),
                ("LB Nagar", "06:40", 1),
                ("Hyderabad (MGBS)", "07:15", 1)
            ]
        }
    ]

    for day in dates:
        base_date = datetime(year, month, day)
        for r_data in routes:
            dept_h, dept_m = map(int, r_data["dept_time"].split(":"))
            arr_h, arr_m = map(int, r_data["arr_time"].split(":"))
            
            departure = base_date.replace(hour=dept_h, minute=dept_m)
            arrival = (base_date + timedelta(days=r_data["arr_offset"])).replace(hour=arr_h, minute=arr_m)
            
            trip = Trip(
                bus_id=r_data["bus_id"],
                source=r_data["source"],
                destination=r_data["destination"],
                departure_time=departure,
                arrival_time=arrival,
                price=r_data["price"],
                is_cancelled=False
            )
            try:
                db.add(trip)
                db.flush() # Get trip ID
                
                # Add stops
                for idx, stop_info in enumerate(r_data["stops"]):
                    loc = stop_info[0]
                    time_str = stop_info[1]
                    day_offset = stop_info[2] if len(stop_info) > 2 else 0
                    
                    sh, sm = map(int, time_str.split(":"))
                    stop_time = (base_date + timedelta(days=day_offset)).replace(hour=sh, minute=sm)
                    
                    stop = TripStop(
                        trip_id=trip.id,
                        location=loc,
                        arrival_time=stop_time,
                        order=idx + 1
                    )
                    db.add(stop)
                db.commit()
            except IntegrityError:
                db.rollback()
                print(f"Skipping duplicate trip: {r_data['source']} to {r_data['destination']} on {base_date.date()}")
    db.close()
    print(f"✅ Seeded {len(dates) * len(routes)} trips successfully!")

if __name__ == "__main__":
    seed_real_trips()
