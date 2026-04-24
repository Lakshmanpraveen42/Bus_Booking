import os
import sys

# Add the current directory to sys.path to allow imports from app
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.session import engine, Base
from app.models.models import User, Bus, Trip, Booking, TripStop, OTP
from app.core.config import settings

def reset_database():
    print("Starting Database Reset...")
    
    # 1. Drop all tables
    print("Dropping all existing tables...")
    try:
        Base.metadata.drop_all(bind=engine)
    except Exception as e:
        print(f"Error while dropping tables: {e}")
        print("Tip: If the database is locked, try stopping your running server first.")
        return
    
    # 2. Create tables using SQLAlchemy
    print("Creating fresh tables based on production models...")
    Base.metadata.create_all(bind=engine)
    
    # 3. Verify
    print("Database created successfully!")
    print(f"Location: {settings.SQLITE_URL}")
    print("\nAvailable Tables:")
    for table_name in Base.metadata.tables.keys():
        print(f"  - {table_name}")

if __name__ == "__main__":
    reset_database()
