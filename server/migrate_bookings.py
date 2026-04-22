import sqlite3
import os

def migrate():
    db_path = 'busgo.db'
    if not os.path.exists(db_path):
        print(f"Database {db_path} not found.")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Check if column exists
        cursor.execute("PRAGMA table_info(bookings)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'payment_status' not in columns:
            print("Adding payment_status column...")
            cursor.execute("ALTER TABLE bookings ADD COLUMN payment_status VARCHAR DEFAULT 'paid'")
            conn.commit()
            print("Successfully added payment_status column.")
        else:
            print("Column payment_status already exists.")
            
    except Exception as e:
        print(f"Error during migration: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    migrate()
