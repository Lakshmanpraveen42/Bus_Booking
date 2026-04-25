import React from 'react';
import { 
  Star, ShieldCheck, MapPin, 
  Map, Battery, Droplets, 
  Zap, Clock, Info
} from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

const BusCard = ({ bus, onSelect }) => {
  // Data Mapping matching the screenshot
  const rating = "4.8";
  const reviews = "353";
  const seatsInfo = "25 Seats (6 Single)";
  
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow mb-4 overflow-hidden">
      <div className="p-6 flex flex-col md:flex-row items-start justify-between gap-6">
        
        {/* 1. OPERATOR & TYPE */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-slate-900 truncate">
              {bus.busName}
            </h3>
            <ShieldCheck className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-xs text-slate-500 font-medium mb-4 italic">
            {bus.busType || 'AC Seater / Sleeper (2+1)'}
          </p>
          
          <div className="inline-block px-3 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-600 uppercase tracking-wider">
             New Bus
          </div>
        </div>

        {/* 2. RATING BADGE */}
        <div className="flex flex-col items-center gap-1 mt-1">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-600 text-white rounded text-xs font-black">
             <Star className="w-3 h-3 fill-current" />
             <span>{rating}</span>
          </div>
          <span className="text-[10px] font-bold text-slate-400">{reviews}</span>
        </div>

        {/* 3. TIMINGS & DURATION */}
        <div className="flex-[1.5] w-full flex items-start gap-4">
           <div className="flex-1 text-center">
              <p className="text-lg font-black text-slate-900 tracking-tight">{bus.departureTime}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{bus.duration}</p>
           </div>
           
           <div className="flex flex-col items-center pt-2">
              <div className="w-16 h-px bg-slate-200" />
           </div>

           <div className="flex-1 text-center">
              <p className="text-lg font-black text-slate-900 tracking-tight">{bus.arrivalTime}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{seatsInfo}</p>
           </div>
        </div>

        {/* 4. PRICING & CTA */}
        <div className="w-full md:w-40 flex flex-col items-center md:items-end gap-4">
           <div className="text-center md:text-right">
              <p className="text-xl font-black text-slate-900 tracking-tighter">
                {formatPrice(bus.price)}
              </p>
              <p className="text-[10px] font-bold text-slate-400">Onwards</p>
           </div>
           
           <button 
             onClick={onSelect}
             className="w-full h-10 bg-[#e32e33] hover:bg-[#c1272c] text-white rounded-lg font-bold text-xs transition-colors shadow-lg shadow-red-500/10"
           >
             View seats
           </button>
        </div>
      </div>

      {/* 5. BOTTOM AMENITIES BAR */}
      <div className="px-6 py-3 bg-slate-50/50 border-t border-slate-50 flex items-center gap-6">
         <AmenityItem icon={<Map className="w-3 h-3" />} label="Live Tracking" />
         <AmenityItem icon={<Zap className="w-3 h-3" />} label="Charging Point" />
         <AmenityItem icon={<Droplets className="w-3 h-3" />} label="Water Bottle" />
      </div>
    </div>
  );
};

const AmenityItem = ({ icon, label }) => (
  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
    {icon}
    <span>{label}</span>
  </div>
);

export default BusCard;
