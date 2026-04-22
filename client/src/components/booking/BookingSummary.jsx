import React from 'react';
import { Clock, MapPin, Calendar } from 'lucide-react';
import { formatTime12h, formatDate, formatDuration, formatPrice } from '../../utils/formatters';

const Row = ({ label, value, highlight = false }) => (
  <div className="flex justify-between items-center py-1.5">
    <span className="text-sm text-slate-500">{label}</span>
    <span className={['text-sm font-medium', highlight ? 'text-primary-600' : 'text-slate-800'].join(' ')}>{value}</span>
  </div>
);

/**
 * Summary card showing selected bus + seat details.
 * Receives normalized bus data through props.
 */
const BookingSummary = ({ bus, selectedSeats }) => {
  if (!bus) return null;

  return (
    <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-accent-500 px-5 py-4">
        <h3 className="text-white font-bold text-base">{bus.operatorName}</h3>
        <p className="text-white/80 text-xs mt-0.5">{bus.busSubType}</p>
      </div>

      <div className="p-5 space-y-4">
        {/* Journey */}
        <div className="flex items-center justify-between">
          <div className="text-center">
            <p className="text-xl font-bold text-slate-800">{formatTime12h(bus.departureTime)}</p>
            <p className="text-xs text-slate-500 flex items-center gap-0.5 justify-center">
              <MapPin className="w-3 h-3" />{bus.from}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDuration(bus.durationMinutes)}
            </p>
            <div className="flex items-center gap-1 my-1">
              <div className="flex-1 h-px bg-slate-200" />
              <div className="w-1.5 h-1.5 rounded-full bg-primary-400" />
              <div className="flex-1 h-px bg-slate-200" />
            </div>
            <p className="text-xs text-slate-400">Direct</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-slate-800">{formatTime12h(bus.arrivalTime)}</p>
            <p className="text-xs text-slate-500 flex items-center gap-0.5 justify-center">
              <MapPin className="w-3 h-3" />{bus.to}
            </p>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4 space-y-1">
          <Row label="Date" value={
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />{formatDate(bus.date)}
            </span>
          } />
          <Row label="Seats" value={selectedSeats.join(', ')} highlight />
          <Row label="No. of Passengers" value={selectedSeats.length} />
          <Row label="Price per seat" value={formatPrice(bus.pricePerSeat)} />
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
