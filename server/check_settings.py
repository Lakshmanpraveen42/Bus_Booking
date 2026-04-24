from app.db.session import SessionLocal
from app.models.models import Setting

db = SessionLocal()
try:
    settings = db.query(Setting).all()
    print("--- LIVE SETTINGS IN DB ---")
    for s in settings:
        print(f"Key: {s.key} | Value: {s.value}")
    print("---------------------------")
finally:
    db.close()
