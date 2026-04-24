from app.db.session import SessionLocal, engine
from app.models.models import User
from app.core.security import get_password_hash
import sys

def seed_admin():
    db = SessionLocal()
    
    admin_email = "Admin.123@gmail.com"
    admin_password = "P@ssw0rd@123"
    
    print(f"Checking for admin account: {admin_email}")
    
    # Check if admin already exists
    admin = db.query(User).filter(User.email == admin_email).first()
    
    if admin:
        print("Admin account already exists.")
        db.close()
        return

    print("Creating production admin account...")
    try:
        new_admin = User(
            name="System Administrator",
            email=admin_email,
            phone="0000000000",
            hashed_password=get_password_hash(admin_password),
            is_active=True,
            is_verified=True,
            is_admin=True
        )
        db.add(new_admin)
        db.commit()
        print("Admin account created successfully!")
        print(f"Email: {admin_email}")
        print(f"Password: {admin_password}")
    except Exception as e:
        print(f"Error creating admin: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_admin()
