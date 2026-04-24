import sqlite3
import os

db_path = 'e:\\bus_booking\\server\\busgo.db'

if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    print("Checking for missing columns in 'bookings' table...")
    
    # Check current columns
    cursor.execute("PRAGMA table_info(bookings)")
    columns = [col[1] for col in cursor.fetchall()]
    
    if 'boarding_point' not in columns:
        print("Adding 'boarding_point' column...")
        cursor.execute("ALTER TABLE bookings ADD COLUMN boarding_point TEXT")
    
    if 'dropping_point' not in columns:
        print("Adding 'dropping_point' column...")
        cursor.execute("ALTER TABLE bookings ADD COLUMN dropping_point TEXT")

    # Create new table trip_stops
    print("Creating 'trip_stops' table if it doesn't exist...")
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS trip_stops (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            trip_id INTEGER,
            location TEXT NOT NULL,
            arrival_time DATETIME,
            "order" INTEGER DEFAULT 0,
            FOREIGN KEY(trip_id) REFERENCES trips(id)
        )
    """)
        
    conn.commit()
    conn.close()
    print("Database migration completed successfully!")
else:
    print(f"Database not found at {db_path}")
