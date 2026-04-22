from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from app.core.config import settings
from app.schemas.schemas import UserResponse
import os

conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_FROM_NAME=settings.MAIL_FROM_NAME,
    MAIL_STARTTLS=settings.MAIL_STARTTLS,
    MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
    USE_CREDENTIALS=settings.USE_CREDENTIALS,
    VALIDATE_CERTS=True
)

fm = FastMail(conf)

async def send_otp_email(email: str, otp: str):
    message = MessageSchema(
        subject="BusGo - Your OTP Verification Code",
        recipients=[email],
        body=f"""
        <html>
            <body style="font-family: sans-serif; background-color: #f8fafc; padding: 40px;">
                <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 24px; padding: 40px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
                    <h1 style="color: #f43f5e; margin-bottom: 24px;">Verify your identity</h1>
                    <p style="color: #64748b; font-size: 16px; line-height: 1.6;">Use the following code to complete your registration on BusGo. This code will expire in 10 minutes.</p>
                    <div style="background: #f1f5f9; padding: 24px; border-radius: 16px; text-align: center; margin: 32px 0;">
                        <span style="font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #0f172a;">{otp}</span>
                    </div>
                    <p style="color: #94a3b8; font-size: 12px;">If you didn't request this, you can safely ignore this email.</p>
                </div>
            </body>
        </html>
        """,
        subtype=MessageType.html
    )
    await fm.send_message(message)

async def send_welcome_email(user: UserResponse):
    message = MessageSchema(
        subject="Welcome to BusGo!",
        recipients=[user.email],
        body=f"""
        <html>
            <body style="font-family: sans-serif; background-color: #f8fafc; padding: 40px;">
                <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 24px; padding: 40px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
                    <h1 style="color: #0f172a; margin-bottom: 24px;">Welcome aboard, {user.name}! 🚌</h1>
                    <p style="color: #64748b; font-size: 16px; line-height: 1.6;">Your account has been successfully verified. You now have access to a world of premium bus travel across India.</p>
                    <p style="color: #64748b; font-size: 16px; line-height: 1.6;">Start your journey today by searching for your next destination.</p>
                    <a href="http://localhost:5173" style="display: inline-block; background: #f43f5e; color: white; padding: 12px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; margin-top: 24px;">Find a Bus</a>
                </div>
            </body>
        </html>
        """,
        subtype=MessageType.html
    )
    await fm.send_message(message)

async def send_ticket_email(email: str, booking_details: dict, qr_image_path: str):
    message = MessageSchema(
        subject="BusGo Ticket Confirmation",
        recipients=[email],
        body=f"""
        <html>
            <body style="font-family: sans-serif; background-color: #f8fafc; padding: 40px;">
                <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 24px; padding: 40px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
                    <h1 style="color: #10b981; margin-bottom: 24px;">Booking Confirmed!</h1>
                    <p style="color: #64748b; font-size: 16px; line-height: 1.6;">Thank you for booking with BusGo. Your ticket details are below.</p>
                    
                    <div style="border: 2px dashed #e2e8f0; border-radius: 16px; padding: 24px; margin: 24px 0;">
                        <p><strong>Route:</strong> {booking_details['route']}</p>
                        <p><strong>Seats:</strong> {booking_details['seats']}</p>
                        <p><strong>Amount Paid:</strong> ₹{booking_details['amount']}</p>
                    </div>
                    
                    <p style="color: #64748b; text-align: center;">Scan your QR code for boarding:</p>
                </div>
            </body>
        </html>
        """,
        subtype=MessageType.html,
        attachments=[qr_image_path]
    )
    await fm.send_message(message)
