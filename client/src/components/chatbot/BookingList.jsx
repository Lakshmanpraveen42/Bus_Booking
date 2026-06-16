import React from 'react';
import { Bus, MapPin, Calendar, Ticket, ChevronRight, Download } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import { bookingService } from '../../services/bookingService';

const BookingList = ({ bookings }) => {
  if (!bookings || bookings.length === 0) {
    return (
      <div className="p-4 bg-slate-50 rounded-2xl text-center border border-dashed border-slate-200">
        <p className="text-slate-500 text-sm font-medium">No bookings found 😕</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 mt-3">
      {bookings.map((booking) => (
        <div 
          key={booking.booking_id}
          className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:border-primary-200 transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
                <Bus className="w-4 h-4 text-primary-500" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{booking.bus_name}</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">#SB_BK_{booking.booking_id}</p>
              </div>
            </div>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest ${
              (booking.status || '').toLowerCase() === 'booked' 
                ? 'bg-emerald-50 text-emerald-600' 
                : (booking.status || '').toLowerCase() === 'cancelled'
                ? 'bg-rose-50 text-rose-600'
                : 'bg-amber-50 text-amber-600'
            }`}>
              {booking.status === 'booked' ? 'CONFIRMED' : (booking.status || 'PENDING').toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-0.5">
              <p className="text-[9px] font-black text-slate-400 uppercase">Route</p>
              <p className="text-[11px] font-bold text-slate-800 truncate">{booking.source} → {booking.destination}</p>
            </div>
            <div className="space-y-0.5 text-right">
              <p className="text-[9px] font-black text-slate-400 uppercase">Date</p>
              <p className="text-[11px] font-bold text-slate-800">{(booking.booking_time || '').split(' ')[0] || (booking.booking_time || '').split('T')[0] || 'N/A'}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-50">
            <span className="text-sm font-black text-slate-900">{formatPrice(booking.total_amount)}</span>
            {((booking.status || '').toUpperCase() === 'CANCELLED' || (booking.status || '').toUpperCase() === 'CANCELED') ? (
              <span className="text-[10px] font-black text-rose-500 uppercase">Cancelled</span>
            ) : (
              <button 
                onClick={() => bookingService.downloadTicket(booking.booking_id)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 rounded-lg text-[10px] font-black text-primary-600 hover:bg-primary-100 transition-colors"
              >
                <Download className="w-3 h-3" /> Ticket
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingList;
