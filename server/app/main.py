from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api import auth, trips, admin, bookings, chat, support
from app.db.session import engine, Base
from app.core.config import settings
from app.core.logging_middleware import LoggingMiddleware
import os

# Create DB tables
Base.metadata.create_all(bind=engine)

# Ensure static directories exist
os.makedirs("static/tickets/qrcodes", exist_ok=True)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Add Logging Middleware
app.add_middleware(LoggingMiddleware)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with actual frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for tickets
app.mount("/static", StaticFiles(directory="static"), name="static")

# Include Routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Authentication"])
app.include_router(trips.router, prefix=f"{settings.API_V1_STR}/trips", tags=["Trips"])
app.include_router(bookings.router, prefix=f"{settings.API_V1_STR}/bookings", tags=["Bookings"])
app.include_router(admin.router, prefix=f"{settings.API_V1_STR}/admin", tags=["Admin Dashboard"])
app.include_router(chat.router, prefix=f"{settings.API_V1_STR}/chat", tags=["AI Assistant"])
app.include_router(support.router, prefix=f"{settings.API_V1_STR}/support", tags=["Support & Help"])

@app.get("/")
def root():
    return {"message": "Welcome to SmartBus API Services"}
