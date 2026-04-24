import sys
import os
from datetime import datetime, timedelta
import pytz
from passlib.context import CryptContext

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.session import SessionLocal, engine, Base
from app.models.models import Bus, Trip, TripStop, User, Booking
from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def seed_db():
    print("Recreating database tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        print("Seeding production-ready data...")
        
        # 1. Create Users
        hashed_password = pwd_context.hash("password123")
        users = [
            User(id=123, name="Test User", email="user@example.com", hashed_password=hashed_password, is_active=True, is_verified=True),
            User(name="Admin User", email="admin@busgo.com", hashed_password=hashed_password, is_admin=True, is_active=True, is_verified=True),
        ]
        db.add_all(users)
        db.commit()

        # 2. Create Buses
        buses = [
            Bus(name="Airavat Express", category="AC Sleeper", vehicle_number="KA 01 AH 5567", total_seats=40),
            Bus(name="Garuda Plus", category="AC Semi-Deluxe", vehicle_number="TS 09 XY 1234", total_seats=40),
            Bus(name="Rajadhani", category="AC Seater", vehicle_number="AP 16 TZ 9988", total_seats=36),
            Bus(name="Amaravathi", category="Non-AC Seater", vehicle_number="AP 05 BK 1122", total_seats=40),
        ]
        db.add_all(buses)
        db.commit()

        # 3. Create Trips with Stops
        india_tz = pytz.timezone("Asia/Kolkata")
        today = datetime.now(india_tz).replace(hour=0, minute=0, second=0, microsecond=0)
        
        # Festival Dates
        diwali_date = datetime(2024, 11, 1, 20, 0, tzinfo=india_tz)
        sankranthi_date = datetime(2025, 1, 14, 21, 0, tzinfo=india_tz)
        
        trips_list = []
        trips_data = [
            {"bus": buses[0], "src": "Tuni", "dest": "Hyderabad", "dep": today + timedelta(days=1, hours=20), "arr": today + timedelta(days=2, hours=6), "price": 1200.0, "stops": ["Annavaram", "Visakhapatnam", "Vijayawada"]},
            {"bus": buses[1], "src": "Vijayawada", "dest": "Vizag", "dep": diwali_date, "arr": diwali_date + timedelta(hours=8), "price": 1500.0, "stops": ["Eluru", "Rajahmundry"]},
            {"bus": buses[2], "src": "Tanuku", "dest": "Hyderabad", "dep": sankranthi_date, "arr": sankranthi_date + timedelta(hours=9), "price": 1800.0, "stops": ["Tadepalligudem", "Eluru", "Vijayawada"]},
        ]

        for t in trips_data:
            trip = Trip(bus_id=t["bus"].id, source=t["src"], destination=t["dest"], departure_time=t["dep"], arrival_time=t["arr"], price=t["price"])
            db.add(trip)
            db.flush()
            trips_list.append(trip)
            
            for i, loc in enumerate(t["stops"]):
                stop = TripStop(trip_id=trip.id, location=loc, arrival_time=t["dep"] + timedelta(hours=i+1), order=i)
                db.add(stop)
        
        db.commit()

        # 4. Create Bookings for User 123
        bookings = [
            Booking(user_id=123, trip_id=trips_list[0].id, seat_numbers="A1,A2", total_amount=2400.0, status="booked"),
            Booking(user_id=123, trip_id=trips_list[1].id, seat_numbers="B5", total_amount=1500.0, status="booked"),
        ]
        db.add_all(bookings)
        db.commit()

        print("Database seeded successfully with Users and Bookings!")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
