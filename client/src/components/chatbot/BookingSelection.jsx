import React from 'react';
import { Bus, MapPin, Calendar, Trash2 } from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';

const BookingSelection = ({ bookings }) => {
  const { sendMessage } = useChatStore();

  if (!bookings || bookings.length === 0) {
    return (
      <div className="p-4 bg-slate-50 rounded-xl text-center border border-dashed border-slate-200">
        <p className="text-slate-500 text-xs font-medium">No active bookings available to cancel 😕</p>
      </div>
    );
  }

  const handleSelect = (booking) => {
    // Send message to backend as per requirement
    sendMessage(`Cancel booking #${booking.booking_id}`);
  };

  return (
    <div className="space-y-2 mt-3">
      {bookings.map((booking) => (
        <div 
          key={booking.booking_id}
          onClick={() => handleSelect(booking)}
          className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 hover:border-rose-300 hover:shadow-md transition-all cursor-pointer group relative"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center group-hover:bg-rose-50 transition-colors">
              <Bus className="w-5 h-5 text-slate-400 group-hover:text-rose-500" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-slate-900 truncate">{booking.bus_name}</h4>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <span>{booking.source}</span>
                <span>→</span>
                <span>{booking.destination}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-2 pt-2 border-t border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
              <Calendar className="w-3 h-3" />
              {(booking.booking_time || '').split(' ')[0] || 'Recently'}
            </div>
            <span className="text-[9px] font-black text-primary-500 uppercase opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
              Tap to cancel <Trash2 className="w-2.5 h-2.5" />
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingSelection;
