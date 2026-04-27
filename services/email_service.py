import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from core.config import settings
from datetime import datetime


def send_email(to_email: str, subject: str, body: str, is_html: bool = False):
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        print(f"SMTP credentials missing. Would have sent to {to_email}: {subject}")
        return False
        
    try:
        sender_email = settings.MAIL_FROM or settings.SMTP_USER
        msg = MIMEMultipart()
        msg['From'] = f"{settings.MAIL_FROM_NAME} <{sender_email}>"
        msg['To'] = to_email
        msg['Subject'] = subject
        
        content_type = 'html' if is_html else 'plain'
        msg.attach(MIMEText(body, content_type))
        
        server = smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT)
        server.starttls()
        server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False

def send_otp_email(to_email: str, otp: str):
    subject = "SmartBus - Your OTP Verification Code"
    
    # HTML Template matching the screenshot
    html_body = f"""
    <html>
    <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #ff4757; font-size: 24px;">Verify your identity</h2>
            <p>Use the following code to complete your registration on SmartBus. This code will expire in 10 minutes.</p>
            
            <div style="background-color: #f1f2f6; padding: 30px; text-align: center; border-radius: 8px; margin: 25px 0;">
                <span style="font-size: 48px; font-weight: bold; letter-spacing: 15px; color: #2f3542;">
                    {otp}
                </span>
            </div>
            
            <p style="color: #a4b0be; font-size: 13px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
    </body>
    </html>
    """
    return send_email(to_email, subject, html_body, is_html=True)


def send_welcome_email(to_email: str, name: str):
    subject = "Welcome to SmartBus!"
    html_body = f"""
    <html>
    <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #ff4757; font-size: 24px;">Welcome to SmartBus!</h2>
            <p>Hi <strong>{name}</strong>,</p>
            <p>Your account has been successfully verified. You can now book your tickets and enjoy seamless travel across India.</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="#" style="background-color: #ff4757; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                    Start Booking Now
                </a>
            </div>
            
            <p>Happy Journey!<br>Team SmartBus</p>
        </div>
    </body>
    </html>
    """
    return send_email(to_email, subject, html_body, is_html=True)

def send_booking_email(to_email: str, booking_details: dict):
    subject = f"TICKET CONFIRMED: {booking_details['source']} to {booking_details['destination']}"
    
    # Format date for the email
    booked_on = datetime.now().strftime("%d %b %Y, %I:%M %p")
    
    passenger_rows = ""
    for p in booking_details['passengers']:
        passenger_rows += f"""
        <tr>
            <td style="padding: 10px; font-size: 14px;">{p['name']}</td>
            <td style="padding: 10px; font-size: 14px;">{p['age']}</td>
            <td style="padding: 10px; font-size: 14px;">{p['gender']}</td>
            <td style="padding: 10px; font-size: 14px; color: #ff4757; font-weight: bold;">{p['seat_number']}</td>
        </tr>
        """

    html_body = f"""
    <html>
    <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background-color: #fcfcfc;">
            <!-- Header Banner -->
            <div style="background: linear-gradient(135deg, #ff4757 0%, #a55eea 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; color: white;">
                <p style="text-transform: uppercase; font-size: 12px; margin-bottom: 10px; font-weight: bold; opacity: 0.8;">Booking Confirmed</p>
                <h1 style="margin: 0; font-size: 28px;">Happy Journey! 🚌</h1>
            </div>
            
            <div style="padding: 20px; background-color: white;">
                <!-- Operator Info -->
                <table style="width: 100%; margin-bottom: 25px;">
                    <tr>
                        <td style="width: 50%;">
                            <p style="color: #a4b0be; font-size: 10px; text-transform: uppercase; margin: 0;">Main Traveler</p>
                            <p style="font-weight: bold; margin: 5px 0;">{booking_details['passengers'][0]['name']}</p>
                        </td>
                        <td style="width: 50%;">
                            <p style="color: #a4b0be; font-size: 10px; text-transform: uppercase; margin: 0;">Operator</p>
                            <p style="font-weight: bold; margin: 5px 0;">{booking_details['bus_name']}</p>
                        </td>
                    </tr>
                </table>

                <p style="color: #a4b0be; font-size: 10px; text-transform: uppercase; margin-bottom: 10px;">Passenger Details</p>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; background-color: #f9f9f9; border-radius: 5px;">
                    <tr style="border-bottom: 1px solid #eee;">
                        <th style="text-align: left; padding: 10px; font-size: 12px; color: #a4b0be;">NAME</th>
                        <th style="text-align: left; padding: 10px; font-size: 12px; color: #a4b0be;">AGE</th>
                        <th style="text-align: left; padding: 10px; font-size: 12px; color: #a4b0be;">GEN</th>
                        <th style="text-align: left; padding: 10px; font-size: 12px; color: #a4b0be;">SEAT</th>
                    </tr>
                    {passenger_rows}
                </table>

                <div style="border-top: 1px solid #eee; padding-top: 20px;">
                    <p style="color: #a4b0be; font-size: 10px; text-transform: uppercase; margin: 0;">Route</p>
                    <p style="font-weight: bold; margin: 5px 0;">{booking_details['source']} to {booking_details['destination']}</p>
                    
                    <p style="color: #a4b0be; font-size: 10px; text-transform: uppercase; margin: 15px 0 0 0;">Booked On</p>
                    <p style="font-weight: bold; margin: 5px 0;">{booked_on}</p>
                </div>

                <div style="text-align: center; margin-top: 30px;">
                    <p style="font-size: 12px; color: #747d8c;">Please scan the attached QR code at boarding.</p>
                </div>
            </div>
            
            <div style="text-align: center; padding: 20px; border-top: 1px solid #eee; font-size: 10px; color: #a4b0be;">
                Powered by SmartBus India
            </div>
        </div>
    </body>
    </html>
    """
    return send_email(to_email, subject, html_body, is_html=True)


def send_cancellation_email(to_email: str, booking_details: dict):
    subject = f"CANCELLED: {booking_details['source']} to {booking_details['destination']}"
    
    # Format dates
    booked_on = booking_details['booked_on']
    cancelled_on = datetime.now().strftime("%d %b %Y, %I:%M %p")
    
    passenger_info_html = ""
    for p in booking_details['passengers']:
        passenger_info_html += f"<p style='margin: 5px 0;'><strong>{p['name']}</strong> ({p['age']}, {p['gender']}) <span style='float: right;'>{p['seat_number']}</span></p>"

    html_body = f"""
    <html>
    <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background-color: #fcfcfc;">
            <!-- Header Banner (Red) -->
            <div style="background-color: #ff4757; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; color: white;">
                <h1 style="margin: 0; font-size: 24px; text-transform: uppercase;">Cancellation Confirmed</h1>
            </div>
            
            <div style="padding: 20px; background-color: white;">
                <p style="color: #a4b0be; font-size: 10px; text-transform: uppercase; margin-bottom: 10px; font-weight: bold;">Passenger & Seats</p>
                <div style="margin-bottom: 25px; border-bottom: 1px solid #f1f2f6; padding-bottom: 10px;">
                    {passenger_info_html}
                </div>

                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 25px;">
                    <p style="color: #a4b0be; font-size: 9px; text-transform: uppercase; margin: 0;">Booked On</p>
                    <p style="font-weight: bold; margin: 5px 0; font-size: 13px;">{booked_on}</p>
                    
                    <p style="color: #ff4757; font-size: 9px; text-transform: uppercase; margin: 10px 0 0 0;">Cancelled On</p>
                    <p style="font-weight: bold; margin: 5px 0; font-size: 13px; color: #ff4757;">{cancelled_on}</p>
                </div>

                <!-- Refund Section -->
                <div style="background-color: #fff5f5; border: 1px solid #ffe3e3; padding: 20px; text-align: center; border-radius: 10px;">
                    <p style="color: #ff4757; font-size: 10px; text-transform: uppercase; margin: 0; font-weight: bold;">Refund Amount</p>
                    <h2 style="margin: 10px 0; font-size: 32px; color: #2f3542;">₹{booking_details['total_amount']}</h2>
                    <p style="font-size: 11px; color: #a4b0be;">Refund initiated to source payment method.</p>
                </div>
            </div>
            
            <div style="text-align: center; padding: 20px; font-size: 10px; color: #a4b0be;">
                Powered by SmartBus India
            </div>
        </div>
    </body>
    </html>
    """
    return send_email(to_email, subject, html_body, is_html=True)




