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
        subject="SmartBus - Your OTP Verification Code",
        recipients=[email],
        body=f"""
        <html>
            <body style="font-family: sans-serif; background-color: #f8fafc; padding: 40px;">
                <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 24px; padding: 40px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
                    <h1 style="color: #f43f5e; margin-bottom: 24px;">Verify your identity</h1>
                    <p style="color: #64748b; font-size: 16px; line-height: 1.6;">Use the following code to complete your registration on SmartBus. This code will expire in 10 minutes.</p>
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
        subject="Welcome to SmartBus!",
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
    print(f"DEBUG: Starting send_ticket_email to {email}")
    try:
        abs_qr_path = os.path.abspath(qr_image_path)
        
        passenger_rows = ""
        for p in booking_details.get('passengers', []):
            passenger_rows += f"""
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #1e293b;">{p['name']}</td>
                <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #1e293b; text-align: center;">{p['age']}</td>
                <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #1e293b; text-align: center;">{p['gender']}</td>
                <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; font-weight: 700; color: #f43f5e; text-align: right;">{p['seatId']}</td>
            </tr>
            """

        html_content = f"""
        <html>
            <body style="font-family: 'Segoe UI', sans-serif; background-color: #f1f5f9; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 32px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);">
                    <div style="background: linear-gradient(135deg, #f43f5e 0%, #8b5cf6 100%); padding: 40px; color: white;">
                        <p style="margin: 0; font-size: 12px; text-transform: uppercase; font-weight: 700; opacity: 0.8;">Booking Confirmed</p>
                        <h1 style="margin: 8px 0 0 0; font-size: 32px; font-weight: 900;">Happy Journey! 🚌</h1>
                    </div>
                    
                    <div style="padding: 40px;">
                        <div style="display: flex; margin-bottom: 32px; border-bottom: 1px solid #f1f5f9; padding-bottom: 24px;">
                            <div style="flex: 1;">
                                <p style="margin: 0; font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 700;">Traveler</p>
                                <p style="margin: 4px 0 0 0; font-size: 16px; font-weight: 700; color: #0f172a;">{booking_details.get('user_name')}</p>
                            </div>
                            <div style="flex: 1; text-align: right;">
                                <p style="margin: 0; font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 700;">Operator</p>
                                <p style="margin: 4px 0 0 0; font-size: 16px; font-weight: 700; color: #0f172a;">{booking_details.get('bus_name')}</p>
                            </div>
                        </div>

                        <div style="margin-bottom: 32px;">
                            <p style="margin: 0 0 12px 0; font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 700;">Passenger Details</p>
                            <table style="width: 100%; border-collapse: collapse; background: #f8fafc; border-radius: 16px; overflow: hidden;">
                                <thead style="background: #f1f5f9;">
                                    <tr>
                                        <th style="padding: 12px; text-align: left; font-size: 11px; color: #64748b; text-transform: uppercase;">Name</th>
                                        <th style="padding: 12px; font-size: 11px; color: #64748b; text-transform: uppercase;">Age</th>
                                        <th style="padding: 12px; font-size: 11px; color: #64748b; text-transform: uppercase;">Gen</th>
                                        <th style="padding: 12px; text-align: right; font-size: 11px; color: #64748b; text-transform: uppercase;">Seat</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {passenger_rows}
                                </tbody>
                            </table>
                        </div>

                        <div style="margin-bottom: 32px; p-4; background: #f1f5f9; border-radius: 16px; padding: 20px;">
                             <div style="margin-bottom: 12px;">
                                <p style="margin: 0; font-size: 11px; color: #64748b; font-weight: 700;">ROUTE</p>
                                <p style="margin: 2px 0 0 0; font-size: 15px; font-weight: 700; color: #0f172a;">{booking_details['route']}</p>
                             </div>
                             <div>
                                <p style="margin: 0; font-size: 11px; color: #64748b; font-weight: 700;">BOOKED ON</p>
                                <p style="margin: 2px 0 0 0; font-size: 15px; font-weight: 700; color: #0f172a;">{booking_details.get('booking_time')}</p>
                             </div>
                        </div>

                        <div style="text-align: center;">
                            <p style="font-size: 13px; color: #64748b; margin-bottom: 24px;">Please scan the attached QR code at boarding.</p>
                            <div style="border-top: 1px solid #f1f5f9; padding-top: 24px; font-size: 11px; color: #94a3b8; font-weight: 600;">
                                Powered by SmartBus India
                            </div>
                        </div>
                    </div>
                </div>
            </body>
        </html>
        """
        message = MessageSchema(
            subject=f"TICKET CONFIRMED: {booking_details['route']}",
            recipients=[email],
            body=html_content,
            subtype=MessageType.html,
            attachments=[abs_qr_path]
        )
        await fm.send_message(message)
    except Exception as e:
        print(f"DEBUG: Error: {str(e)}")

async def send_cancellation_email(email: str, booking_details: dict):
    passenger_rows = ""
    for p in booking_details.get('passengers', []):
        passenger_rows += f"<tr><td style='padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px;'>{p['name']} ({p['age']}, {p['gender']})</td><td style='padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; text-align: right; font-weight: 700;'>{p['seatId']}</td></tr>"

    html_content = f"""
    <html>
        <body style="font-family: 'Segoe UI', sans-serif; background-color: #f1f5f9; padding: 20px;">
            <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 32px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);">
                <div style="background: #ef4444; padding: 32px; text-align: center; color: white;">
                    <h1 style="margin: 0; font-size: 24px; font-weight: 900;">Cancellation Confirmed</h1>
                </div>
                <div style="padding: 32px;">
                    <div style="margin-bottom: 32px;">
                        <p style="margin: 0; font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 700;">Passenger & Seats</p>
                        <table style="width: 100%; border-collapse: collapse;">
                            {passenger_rows}
                        </table>
                    </div>

                    <div style="background: #f8fafc; border-radius: 20px; padding: 20px; margin-bottom: 32px;">
                        <div style="margin-bottom: 12px;">
                           <p style="margin: 0; font-size: 11px; color: #94a3b8; font-weight: 700;">BOOKED ON</p>
                           <p style="margin: 2px 0 0 0; font-size: 13px; font-weight: 700; color: #1e293b;">{booking_details.get('booking_time')}</p>
                        </div>
                        <div>
                           <p style="margin: 0; font-size: 11px; color: #94a3b8; font-weight: 700;">CANCELLED ON</p>
                           <p style="margin: 2px 0 0 0; font-size: 13px; font-weight: 700; color: #ef4444;">{booking_details.get('cancellation_time')}</p>
                        </div>
                    </div>

                    <div style="background: #fef2f2; border: 1px solid #fee2e2; border-radius: 24px; padding: 32px; text-align: center;">
                        <p style="margin: 0; font-size: 12px; font-weight: 700; color: #ef4444; text-transform: uppercase;">Refund Amount</p>
                        <p style="margin: 8px 0 0 0; font-size: 36px; font-weight: 900; color: #0f172a;">₹{booking_details['refund_amount']}</p>
                        <p style="margin: 12px 0 0 0; font-size: 12px; color: #94a3b8;">Refund initiated to source payment method.</p>
                    </div>
                </div>
            </div>
        </body>
    </html>
    """
    message = MessageSchema(
        subject=f"CANCELLED: {booking_details['route']}",
        recipients=[email],
        body=html_content,
        subtype=MessageType.html
    )
    await fm.send_message(message)

async def send_support_email(admin_email: str, user_data: dict):
    print(f"DEBUG: Starting send_support_email to: {admin_email}")
    try:
        message = MessageSchema(
            subject=f"SUPPORT INQUIRY: {user_data.get('subject', 'General')}",
            recipients=[admin_email],
            body=f"""
            <html>
                <body style="font-family: sans-serif; background-color: #f8fafc; padding: 40px;">
                    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 24px; padding: 40px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
                            <h1 style="color: #0f172a; margin: 0; font-size: 24px;">New Customer Message</h1>
                        </div>
                        
                        <div style="background: #f1f5f9; padding: 24px; border-radius: 16px; margin-bottom: 32px;">
                            <p style="margin: 0; font-size: 11px; color: #64748b; font-weight: 700; text-transform: uppercase;">From</p>
                            <p style="margin: 8px 0 0 0; font-size: 15px; color: #0f172a;"><b>Name:</b> {user_data.get('name')}</p>
                            <p style="margin: 4px 0 0 0; font-size: 15px; color: #0f172a;"><b>Email:</b> {user_data.get('email')}</p>
                            <p style="margin: 4px 0 0 0; font-size: 15px; color: #0f172a;"><b>Subject:</b> {user_data.get('subject')}</p>
                        </div>

                        <div style="border-left: 4px solid #f43f5e; padding-left: 20px; margin-bottom: 32px;">
                             <p style="margin: 0; font-size: 11px; color: #64748b; font-weight: 700; text-transform: uppercase; margin-bottom: 8px;">Message Content</p>
                             <p style="font-size: 16px; line-height: 1.6; color: #1e293b; white-space: pre-wrap;">{user_data.get('message')}</p>
                        </div>

                        <div style="border-top: 1px solid #f1f5f9; padding-top: 24px; text-align: center;">
                            <p style="color: #94a3b8; font-size: 11px; font-weight: 600;">Automated Support Notification • SmartBus Hub</p>
                        </div>
                    </div>
                </body>
            </html>
            """,
            subtype=MessageType.html
        )
        await fm.send_message(message)
        print("DEBUG: Support email sent successfully!")
    except Exception as e:
        print(f"DEBUG: Failed to send support email. Error: {str(e)}")
