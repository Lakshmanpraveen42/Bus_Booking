import React from 'react';
import { Bus, MapPin, Clock, ArrowRight, Star } from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';
import { formatPrice } from '../../utils/formatters';

const BusList = ({ buses }) => {
  const { sendMessage } = useChatStore();

  if (!buses || buses.length === 0) {
    return (
      <div className="p-4 bg-slate-50 rounded-xl text-center border border-dashed border-slate-200 mt-2">
        <p className="text-slate-500 text-xs font-medium">No buses available for this route 😕</p>
      </div>
    );
  }

  const handleSelect = (bus) => {
    // 5. Click Interaction (CRITICAL)
    sendMessage(`Selected bus: ${bus.bus_name}`);
    // You could also call an internal store action to send a hidden intent if needed,
    // but the requirement says "append user message in chat"
  };

  return (
    <div className="space-y-3 mt-3">
      {buses.map((bus, idx) => (
        <div 
          key={`${bus.trip_id}-${idx}`}
          onClick={() => handleSelect(bus)}
          className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:border-primary-200 hover:shadow-md transition-all cursor-pointer group"
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-3">
            <div>
              <h4 className="text-sm font-black text-slate-900 group-hover:text-primary-600 transition-colors">
                {bus.bus_name}
              </h4>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{bus.bus_type}</span>
                <span className="w-1 h-1 rounded-full bg-slate-200" />
                <div className="flex items-center gap-0.5 text-emerald-600">
                  <Star className="w-2.5 h-2.5 fill-current" />
                  <span className="text-[10px] font-bold">4.2</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-black text-slate-900">
                {bus.price ? formatPrice(bus.price) : "--"}
              </span>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">incl. GST</p>
            </div>
          </div>

          {/* Route & Timing */}
          <div className="flex items-center justify-between py-3 border-y border-slate-50">
            <div className="space-y-1">
              <p className="text-xs font-black text-slate-900">{bus.departure_time}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase truncate max-w-[80px]">{bus.source}</p>
            </div>
            
            <div className="flex flex-col items-center gap-1 px-2">
              <span className="text-[9px] font-bold text-slate-400">{bus.duration || '6h 30m'}</span>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full border border-slate-300" />
                <div className="w-10 h-[1px] border-t border-dashed border-slate-300" />
                <ArrowRight className="w-3 h-3 text-slate-300" />
              </div>
            </div>

            <div className="space-y-1 text-right">
              <p className="text-xs font-black text-slate-900">{bus.arrival_time}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase truncate max-w-[80px]">{bus.destination}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-3">
             <div className="flex items-center gap-1">
               <div className="w-4 h-4 rounded bg-primary-50 flex items-center justify-center">
                 <Bus className="w-2.5 h-2.5 text-primary-500" />
               </div>
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">
                 {bus.available_seats || 22} Seats Left
               </span>
             </div>
             <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
               Select Bus
             </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BusList;
