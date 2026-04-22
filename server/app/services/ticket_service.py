import qrcode
import os
import json
from uuid import uuid4

QR_STORAGE_PATH = "static/tickets/qrcodes"

def ensure_storage():
    if not os.path.exists(QR_STORAGE_PATH):
        os.makedirs(QR_STORAGE_PATH)

def generate_ticket_qr(booking_id: int, user_name: str, trip_info: str, seat_numbers: str) -> str:
    ensure_storage()
    
    # Metadata for the QR code
    data = {
        "booking_id": booking_id,
        "passenger": user_name,
        "trip": trip_info,
        "seats": seat_numbers,
        "token": str(uuid4()) # Unique verification token
    }
    
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(json.dumps(data))
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    
    file_name = f"ticket_{booking_id}.png"
    file_path = os.path.join(QR_STORAGE_PATH, file_name)
    img.save(file_path)
    
    return file_path
