import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Star, Zap, ChevronRight, Wifi, Battery, Droplets, Shield } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { formatPrice, formatDuration, formatTime12h, formatSeatsLeft } from '../../utils/formatters';
import { useBookingStore } from '../../store/useBookingStore';

const AMENITY_ICONS = {
  'WiFi': <Wifi className="w-3 h-3" />,
  'Charging Point': <Battery className="w-3 h-3" />,
  'Water Bottle': <Droplets className="w-3 h-3" />,
  'Blanket': <Shield className="w-3 h-3" />,
};

const RatingStars = ({ rating }) => (
  <span className="flex items-center gap-1 text-amber-500">
    <Star className="w-3.5 h-3.5 fill-amber-500" />
    <span className="text-xs font-semibold text-slate-700">{rating.toFixed(1)}</span>
  </span>
);

const BusCard = ({ bus }) => {
  const navigate = useNavigate();
  const selectBus = useBookingStore((s) => s.selectBus);

  const handleSelectSeats = () => {
    selectBus(bus);
    navigate(`/seats/${bus.tripId}`);
  };

  const seatsLabel = formatSeatsLeft(bus.seatsAvailable);
  const isAlmostFull = bus.seatsAvailable > 0 && bus.seatsAvailable <= 5;
  const isFull = bus.seatsAvailable === 0;

  const busTypeVariant = {
    'AC': 'info',
    'Non-AC': 'default',
    'Sleeper': 'primary',
    'Semi-Sleeper': 'warning',
  }[bus.busType] ?? 'default';

  return (
    <Card padding={false} className="overflow-hidden animate-fade-in">
      <div className="p-5">
        {/* Top row: Operator info */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-slate-800 text-base">{bus.operatorName}</h3>
              <Badge variant={busTypeVariant}>{bus.busType}</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{bus.busSubType}</p>
          </div>
          <RatingStars rating={bus.rating} />
        </div>

        {/* Journey details */}
        <div className="flex items-center gap-4 mb-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-800">{formatTime12h(bus.departureTime)}</p>
            <p className="text-xs text-slate-500">{bus.from}</p>
          </div>

          <div className="flex-1 flex flex-col items-center gap-1">
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDuration(bus.durationMinutes)}
            </p>
            <div className="w-full flex items-center gap-1">
              <div className="flex-1 h-px bg-slate-200" />
              <div className="w-2 h-2 rounded-full border-2 border-primary-400" />
              <div className="flex-1 h-px bg-slate-200" />
            </div>
            <p className="text-xs text-slate-400">Direct</p>
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold text-slate-800">{formatTime12h(bus.arrivalTime)}</p>
            <p className="text-xs text-slate-500">{bus.to}</p>
          </div>
        </div>

        {/* Amenities */}
        {bus.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {bus.amenities.slice(0, 4).map((amenity) => (
              <span key={amenity} className="flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full">
                {AMENITY_ICONS[amenity] ?? <Zap className="w-3 h-3" />}
                {amenity}
              </span>
            ))}
            {bus.amenities.length > 4 && (
              <span className="text-xs text-slate-400">+{bus.amenities.length - 4} more</span>
            )}
          </div>
        )}
      </div>

      {/* Bottom action bar */}
      <div className="border-t border-slate-100 px-5 py-3 flex items-center justify-between gap-4 bg-slate-50/50">
        <div>
          <p className="text-2xl font-bold text-slate-800">
            {formatPrice(bus.pricePerSeat)}
            <span className="text-sm font-normal text-slate-400"> / seat</span>
          </p>
          <p className={['text-xs font-medium', isAlmostFull ? 'text-amber-600' : isFull ? 'text-red-500' : 'text-emerald-600'].join(' ')}>
            {seatsLabel}
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          disabled={isFull}
          onClick={handleSelectSeats}
          rightIcon={<ChevronRight className="w-4 h-4" />}
        >
          {isFull ? 'Sold Out' : 'Select Seats'}
        </Button>
      </div>
    </Card>
  );
};

export default BusCard;
