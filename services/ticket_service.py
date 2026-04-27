import os
import json
from xhtml2pdf import pisa
from io import BytesIO
from sqlalchemy.orm import Session
from db.models import Booking, Trip
from datetime import datetime, timedelta

def generate_ticket_pdf(booking_id: int, db: Session):
    # 1. Fetch Booking & Trip Details
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        return None, "Booking not found"
    
    trip = db.query(Trip).filter(Trip.id == booking.trip_id).first()
    
    # 2. Extract Data
    passengers = booking.passenger_details or []
    if isinstance(passengers, str):
        import json
        try:
            passengers = json.loads(passengers)
        except:
            passengers = []
            
    passenger_name = passengers[0].get("name", "Valued Customer") if passengers else "Valued Customer"
    seat_info = ", ".join([p.get("seat_number", "") for p in passengers]) if passengers else "N/A"

    
    travel_date = trip.departure_time.strftime("%a, %d %b %Y") if trip else booking.booking_time.strftime("%a, %d %b %Y")
    dep_time = trip.departure_time.strftime("%I:%M %p") if trip else "N/A"
    rep_time = (trip.departure_time - timedelta(minutes=30)).strftime("%I:%M %p") if trip else "N/A"
    
    # 3. HTML Template (Real-World Structured Layout)
    html_template = f"""
    <html>
    <head>
        <style>
            @page {{
                size: A4;
                margin: 0.5in;
            }}
            body {{
                font-family: 'DejaVu Sans', sans-serif;
                font-size: 11px;
                color: #333;
                line-height: 1.4;
            }}
            .table-full {{ width: 100%; border-collapse: collapse; }}
            .border-bottom {{ border-bottom: 1px solid #ddd; }}
            .header-text {{ font-size: 24px; font-weight: bold; color: #d84f57; }}
            .section-title {{ background: #f4f4f4; padding: 5px 10px; font-weight: bold; text-transform: uppercase; margin-top: 20px; border: 1px solid #ddd; }}
            .content-box {{ border: 1px solid #ddd; padding: 15px; border-top: none; }}
            .label {{ color: #777; font-size: 10px; text-transform: uppercase; }}
            .value {{ font-size: 12px; font-weight: bold; margin-bottom: 10px; }}
            .fare-box {{ text-align: right; margin-top: 20px; font-size: 16px; font-weight: bold; }}
            .footer-text {{ font-size: 9px; color: #888; text-align: center; margin-top: 30px; }}
            .tc-list {{ font-size: 9px; color: #666; padding-left: 15px; }}
        </style>
    </head>
    <body>
        <!-- HEADER -->
        <table class="table-full">
            <tr>
                <td width="50%">
                    <span class="header-text">SmartBus</span><br/>
                    <span style="font-size: 14px; color: #666;">eTICKET</span>
                </td>
                <td width="50%" align="right" style="color: #666;">
                    Support: +91 90000 00000<br/>
                    Email: support@smartbus.com
                </td>
            </tr>
        </table>

        <div style="margin-top: 20px; border-top: 2px solid #d84f57;"></div>

        <!-- ROUTE -->
        <table class="table-full" style="margin-top: 15px;">
            <tr>
                <td>
                    <span style="font-size: 18px; font-weight: bold;">
                        {booking.source} &rarr; {booking.destination}
                    </span>
                    <span style="margin-left: 15px; color: #666;">| {travel_date}</span>
                </td>
                <td align="right">
                    <span class="label">Ticket ID:</span> <b>SB{booking.id}</b>
                </td>
            </tr>
        </table>

        <!-- BUS INFO GRID -->
        <div class="section-title">Bus & Journey Details</div>
        <table class="table-full content-box">
            <tr>
                <td width="25%">
                    <div class="label">Bus Operator</div>
                    <div class="value">{booking.bus_name}</div>
                </td>
                <td width="25%">
                    <div class="label">Reporting Time</div>
                    <div class="value">{rep_time}</div>
                </td>
                <td width="25%">
                    <div class="label">Departure Time</div>
                    <div class="value">{dep_time}</div>
                </td>
                <td width="25%">
                    <div class="label">Seat Number(s)</div>
                    <div class="value">{seat_info}</div>
                </td>
            </tr>
        </table>

        <!-- BOARDING & DROPPING -->
        <table class="table-full" style="margin-top: 20px;">
            <tr>
                <td width="50%" style="padding-right: 10px;">
                    <div class="section-title">Boarding Point</div>
                    <div class="content-box">
                        <div class="value">{booking.source}</div>
                        <div class="label" style="text-transform: none;">Main Bus Stand, Near Clock Tower, {booking.source}.</div>
                    </div>
                </td>
                <td width="50%" style="padding-left: 10px;">
                    <div class="section-title">Dropping Point</div>
                    <div class="content-box">
                        <div class="value">{booking.destination}</div>
                        <div class="label" style="text-transform: none;">City Center Drop-off, Opposite Railway Station, {booking.destination}.</div>
                    </div>
                </td>
            </tr>
        </table>

        <!-- PASSENGER -->
        <div class="section-title">Passenger Information</div>
        <table class="table-full content-box">
            <tr class="border-bottom">
                <td width="10%" class="label" style="padding: 5px;">#</td>
                <td width="60%" class="label" style="padding: 5px;">Passenger Name</td>
                <td width="30%" class="label" style="padding: 5px;">Seat Number</td>
            </tr>
            {f"".join([f"<tr><td style='padding: 8px;'>{i+1}</td><td style='padding: 8px;'><b>{p.get('name')}</b></td><td style='padding: 8px;'><b>{p.get('seat_number')}</b></td></tr>" for i, p in enumerate(passengers)])}
        </table>

        <!-- FARE -->
        <div class="fare-box">
            Total Fare: <span style="color: #d84f57;">&#8377; {int(booking.total_amount)}</span>
        </div>

        <!-- TERMS -->
        <div style="margin-top: 30px;">
            <div style="font-weight: bold; margin-bottom: 5px; border-bottom: 1px solid #ddd;">Terms & Conditions</div>
            <ul class="tc-list">
                <li>SmartBus is an online ticketing platform. For any bus delay or service issues, please contact the operator directly.</li>
                <li>Please carry a printed copy or e-ticket on your mobile along with a valid ID proof during boarding.</li>
                <li>Reporting time is 30 minutes prior to departure. The bus will not wait for late passengers.</li>
                <li>Cancellation charges apply as per operator policies. No-show passengers are not eligible for refunds.</li>
            </ul>
        </div>

        <!-- FOOTER -->
        <div class="footer-text">
            For cancellations or queries, visit smartbus.com/help or call +91 90000 00000.<br/>
            Wishing you a safe and pleasant journey!
        </div>
    </body>
    </html>
    """

    # 4. Generate PDF
    result = BytesIO()
    pdf = pisa.pisaDocument(BytesIO(html_template.encode("utf-8")), result)
    
    if not pdf.err:
        return result.getvalue(), None
    return None, "Error generating PDF"