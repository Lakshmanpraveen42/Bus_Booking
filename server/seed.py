from app.db.session import SessionLocal, engine
from app.models.models import Base, Bus, Trip
from datetime import datetime, timedelta
import pytz

# Create tables
Base.metadata.create_all(bind=engine)

def seed():
    db = SessionLocal()
    
    # Check if data already exists
    if db.query(Bus).first():
        print("Database already seeded.")
        return

    print("Seeding database...")
    
    # Create Buses
    buses = [
        Bus(name="Zingbus Luxury", category="Delux", vehicle_number="KA 01 AH 5567", total_seats=40),
        Bus(name="IntrCity SmartBus", category="Rajadhani", vehicle_number="TS 09 XY 1234", total_seats=40),
        Bus(name="VRL Travels", category="Delux", vehicle_number="MH 12 QQ 9988", total_seats=36),
    ]
    db.add_all(buses)
    db.commit()

    # Create Trips
    india_tz = pytz.timezone("Asia/Kolkata")
    today = datetime.now(india_tz).replace(hour=0, minute=0, second=0, microsecond=0)
    
    trips = [
        Trip(
            bus_id=1,
            source="Bangalore",
            destination="Hyderabad",
            departure_time=today + timedelta(days=1, hours=22), # 10 PM tomorrow
            arrival_time=today + timedelta(days=2, hours=7),    # 7 AM day after
            price=1250.0
        ),
        Trip(
            bus_id=2,
            source="Mumbai",
            destination="Pune",
            departure_time=today + timedelta(days=1, hours=8),  # 8 AM tomorrow
            arrival_time=today + timedelta(days=1, hours=11),   # 11 AM tomorrow
            price=450.0
        ),
        Trip(
            bus_id=3,
            source="Chennai",
            destination="Bangalore",
            departure_time=today + timedelta(days=1, hours=23), # 11 PM tomorrow
            arrival_time=today + timedelta(days=2, hours=5),    # 5 AM day after
            price=850.0
        )
    ]
    db.add_all(trips)
    db.commit()
    print("Seeding complete!")
    db.close()

if __name__ == "__main__":
    seed()
