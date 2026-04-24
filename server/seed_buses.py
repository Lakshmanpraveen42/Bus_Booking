from app.db.session import SessionLocal
from app.models.models import Bus
import sys

def seed_buses():
    db = SessionLocal()
    
    buses_to_add = [
        {
            "name": "Orange Travels",
            "category": "AC Sleeper (2+1)",
            "total_seats": 30,
            "vehicle_number": "TS 09 AB 4587"
        },
        {
            "name": "VRL Travels",
            "category": "Non-AC Seater (2+2)",
            "total_seats": 49,
            "vehicle_number": "KA 25 F 1123"
        },
        {
            "name": "SRS Travels",
            "category": "AC Seater (2+2)",
            "total_seats": 45,
            "vehicle_number": "KA 01 AD 9090"
        },
        {
            "name": "Kaveri Travels",
            "category": "AC Sleeper (2+1)",
            "total_seats": 32,
            "vehicle_number": "AP 28 TC 6677"
        },
        {
            "name": "GreenLine Travels",
            "category": "Volvo Multi-Axle AC (2+2)",
            "total_seats": 50,
            "vehicle_number": "KA 03 MN 4545"
        }
    ]
    
    print("Seeding buses into the database...")
    
    for bus_data in buses_to_add:
        # Check if bus already exists by vehicle number
        existing_bus = db.query(Bus).filter(Bus.vehicle_number == bus_data["vehicle_number"]).first()
        if existing_bus:
            print(f"Bus {bus_data['vehicle_number']} ({bus_data['name']}) already exists. Skipping.")
            continue
            
        try:
            new_bus = Bus(
                name=bus_data["name"],
                category=bus_data["category"],
                total_seats=bus_data["total_seats"],
                vehicle_number=bus_data["vehicle_number"]
            )
            db.add(new_bus)
            db.commit()
            print(f"Successfully added: {bus_data['name']} [{bus_data['vehicle_number']}]")
        except Exception as e:
            print(f"Error adding bus {bus_data['name']}: {e}")
            db.rollback()
            
    db.close()
    print("Bus seeding complete!")

if __name__ == "__main__":
    seed_buses()
