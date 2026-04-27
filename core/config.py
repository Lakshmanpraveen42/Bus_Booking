import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env from project root
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

class Settings:
    PROJECT_NAME: str = "SmartBus API"
    
    def __init__(self):
        # Database
        self.DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./db/smart_bus.db")
        
        # SMTP Settings
        self.SMTP_SERVER = os.getenv("MAIL_SERVER", "smtp.gmail.com")
        self.SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
        self.SMTP_USER = os.getenv("MAIL_USERNAME", "")
        self.SMTP_PASSWORD = os.getenv("MAIL_PASSWORD", "")
        self.MAIL_FROM = os.getenv("MAIL_FROM", "")
        self.MAIL_FROM_NAME = os.getenv("MAIL_FROM_NAME", "SmartBus")
        
        # App Settings
        self.SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
        self.ALGORITHM = "HS256"
        self.ACCESS_TOKEN_EXPIRE_MINUTES = 30

settings = Settings()
