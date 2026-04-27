import random
import json
from datetime import datetime, timedelta, time
from db.database import SessionLocal, engine
from db.models import Base, User, Bus, Seat, Trip, TripSeat, Booking, OTP

def init_db():
    """Create all tables based on models"""
    print("Initializing Database...")
    Base.metadata.create_all(bind=engine)

def seed_basic_data():
    """Seeds a small set of users, buses, and trips for testing"""
    db = SessionLocal()
    try:
        print("Seeding basic data...")
        # Users
        for i in range(1, 6):
            db.add(User(
                id=f"SB_USER_{i}",
                name=f"Test User {i}",
                email=f"test{i}@smartbus.in",
                phone=f"910000000{i}",
                hashed_password="secure_password",
                is_active=True,
                is_verified=True,
                is_admin=(i==1) # First user is admin
            ))
        
        # Buses
        bus_names = ["Orange Travels", "Kaveri Travels", "Morning Star Travels", "APSRTC Garuda", "TGSRTC Lahari"]
        for i, name in enumerate(bus_names):
            bus = Bus(
                bus_number=f"AP-{random.randint(10, 39)}-XY-{random.randint(1000, 9999)}",
                bus_name=name,
                capacity=36,
                type="AC Sleeper"
            )
            db.add(bus)
            db.flush()
            # Seats
            for s in range(1, 37):
                row = (s + 1) // 2
                suffix = 'A' if s % 2 != 0 else 'B'
                db.add(Seat(bus_id=bus.id, seat_number=f"{row}{suffix}"))

        db.commit()
        print("Basic seeding complete.")
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

def seed_bulk_inventory():
    """Seeds 50+ buses and hundreds of trips across AP/TS"""
    db = SessionLocal()
    try:
        print("Adding bulk inventory (60 buses + hundreds of trips)...")
        bus_operators = ["Orange", "Kaveri", "Morning Star", "Dharani", "Sri Krishna", "APSRTC", "TGSRTC"]
        cities = ["Hyderabad", "Vijayawada", "Visakhapatnam", "Tirupati", "Kurnool", "Warangal", "Nellore", "Guntur", "Anantapur", "Kadapa", "Palakollu", "Bhimavaram"]
        
        for i in range(1, 61):
            bus = Bus(
                bus_number=f"AP{random.randint(10,39)} {chr(random.randint(65,90))}{chr(random.randint(65,90))} {random.randint(1000,9999)}",
                bus_name=f"{random.choice(bus_operators)} Express {i}",
                capacity=36,
                type=random.choice(["Sleeper", "Semi-Sleeper", "AC Sleeper"])
            )
            db.add(bus)
            db.flush()
            
            # Seats
            for s in range(1, 37):
                db.add(Seat(bus_id=bus.id, seat_number=f"{(s+1)//2}{'A' if s%2!=0 else 'B'}"))

            # Create 5-10 trips for this bus
            for _ in range(random.randint(5, 10)):
                src, dest = random.sample(cities, 2)
                departure = datetime.now() + timedelta(days=random.randint(1, 15), hours=random.randint(0, 23))
                arrival = departure + timedelta(hours=random.randint(4, 10))
                
                trip = Trip(
                    bus_id=bus.id, source=src, destination=dest,
                    departure_time=departure, arrival_time=arrival,
                    price=random.randint(500, 2000),
                    routing_points=random.sample([c for c in cities if c not in [src, dest]], random.randint(1, 3))
                )
                db.add(trip)
                db.flush()
                
                # Trip Seats
                bus_seats = db.query(Seat).filter(Seat.bus_id == bus.id).all()
                for seat in bus_seats:
                    db.add(TripSeat(trip_id=trip.id, seat_id=seat.id, is_booked=random.choice([False]*10 + [True])))

        db.commit()
        print("Bulk inventory added.")
    finally:
        db.close()

def fix_routing_points():
    """Corrects any trips missing routing points and ensures they are lists (not JSON strings)"""
    db = SessionLocal()
    try:
        print("Fixing routing points...")
        trips = db.query(Trip).all()
        cities = ["Suryapet", "Vijayawada", "Khammam", "Guntur", "Kodad"]
        for t in trips:
            if not t.routing_points:
                t.routing_points = random.sample(cities, 3)
            elif isinstance(t.routing_points, str):
                try:
                    t.routing_points = json.loads(t.routing_points)
                except:
                    t.routing_points = []
        db.commit()
        print("Routing points fixed.")
    finally:
        db.close()

def run_all():
    init_db()
    seed_basic_data()
    seed_bulk_inventory()
    fix_routing_points()

if __name__ == "__main__":
    print("SmartBus Master Seeder")
    print("1. Initialize DB Only")
    print("2. Seed Basic Data")
    print("3. Seed Bulk Inventory")
    print("4. Fix Routing Points")
    print("5. Run Everything")
    choice = input("Enter choice: ")
    
    if choice == '1': init_db()
    elif choice == '2': seed_basic_data()
    elif choice == '3': seed_bulk_inventory()
    elif choice == '4': fix_routing_points()
    elif choice == '5': run_all()
