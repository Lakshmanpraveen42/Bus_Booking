import React from 'react';
import { SEAT_STATUS } from '../../utils/constants';
import { useBookingStore } from '../../store/useBookingStore';

/**
 * Steering Wheel SVG for the Driver Cabin.
 */
const SteeringWheel = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2v10" />
    <path d="M12 12l5 8" />
    <path d="M12 12l-5 8" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
);

/**
 * Individual Seat Component with Seater/Sleeper differentiation.
 */
const Seat = ({ seat, isSelected, isSleeper }) => {
  const toggleSeat = useBookingStore((s) => s.toggleSeat);
  const isBooked = seat.status === SEAT_STATUS.BOOKED;

  const seatClass = isBooked
    ? 'seat-booked'
    : isSelected
    ? 'seat-selected'
    : 'seat-available';

  const handleClick = () => {
    if (isBooked) return;
    toggleSeat(seat.id);
  };

  // Sleeper seats are typically longer
  const dimensions = isSleeper 
    ? 'w-16 h-9' // Elongated sleeper
    : 'w-10 h-10';   // Pro Seater

  return (
    <button
      onClick={handleClick}
      disabled={isBooked}
      aria-label={`Seat ${seat.id} - ${isBooked ? 'Booked' : isSelected ? 'Selected' : 'Available'}`}
      className={[
        dimensions,
        'bus-seat rounded-[4px] md:rounded-lg overflow-visible shadow-sm',
        isSleeper ? 'bus-sleeper' : '',
        seatClass,
        isSelected ? 'scale-110 z-10' : 'hover:scale-105',
      ].join(' ')}
    >
      <span className="relative z-10 opacity-70 leading-none">{seat.id.replace(/^[LU]/, '')}</span>
    </button>
  );
};

/**
 * Professional Seat Map with Bus Frame and orientation labels.
 */
const SeatMap = ({ layout, seats, activeDeck }) => {
  const selectedSeats = useBookingStore((s) => s.selectedSeats);
  const selectedSet = new Set(selectedSeats);

  const deckSeats = seats.filter((s) => s.deck === activeDeck);
  const maxRow = Math.max(...deckSeats.map((s) => s.row));
  const isSleeperLayout = layout === '2+1' || layout === '1+1';

  return (
    <div className="flex flex-col items-center py-6 select-none bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
      <div className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 mb-8">
        Front of Bus
      </div>

      {/* Bus Shell Container */}
      <div className="relative border-[8px] border-slate-300 rounded-t-[4rem] rounded-b-[1.5rem] bg-white p-6 shadow-2xl min-w-[300px] max-w-sm mx-auto overflow-hidden">
        {/* Windows (Side Decorations) */}
        <div className="absolute inset-y-20 left-0 w-1 bg-slate-100/50 flex flex-col gap-8 py-10">
          {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-12 w-full bg-slate-200/50 rounded-full" />)}
        </div>
        <div className="absolute inset-y-20 right-0 w-1 bg-slate-100/50 flex flex-col gap-8 py-10">
          {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-12 w-full bg-slate-200/50 rounded-full" />)}
        </div>

        {/* Front Grill / Windshield Indicator */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-slate-200 rounded-full" />
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-100 rounded-full opacity-50" />

        {/* Driver's Cabin Section (Indian Style: Driver on Right) */}
        <div className="flex items-center justify-end mb-4 pb-4 border-b-2 border-slate-100/50 px-6">
          <div className="flex flex-col items-center gap-2">
             <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Driver</div>
             <div className="w-14 h-14 rounded-3xl bg-slate-900 flex items-center justify-center border-[6px] border-slate-800 text-white shadow-2xl relative">
               <div className="absolute inset-1 rounded-2xl border border-white/10" />
               <SteeringWheel />
             </div>
             <div className="text-[7px] font-bold text-slate-300 uppercase tracking-tighter">India RHD</div>
          </div>
        </div>

        {/* Seat Grid */}
        <div className="space-y-4">
          {Array.from({ length: maxRow }, (_, i) => i + 1).map((rowNum) => {
            const rowSeats = deckSeats.filter((s) => s.row === rowNum);
            const leftSeats = rowSeats.filter((s) => s.side === 'left');
            const rightSeats = rowSeats.filter((s) => s.side === 'right');

            return (
              <div key={rowNum} className="flex items-center gap-6 px-2">
                {/* Left side (A, B) */}
                <div className="flex gap-2">
                  {leftSeats.map((seat) => (
                    <Seat 
                      key={seat.id} 
                      seat={seat} 
                      isSelected={selectedSet.has(seat.id)} 
                      isSleeper={isSleeperLayout}
                    />
                  ))}
                </div>

                {/* Main Aisle Path */}
                <div className="flex-1 flex flex-col items-center justify-center">
                   <div className="text-[8px] font-black text-slate-200 uppercase tracking-tighter">
                     {rowNum}
                   </div>
                </div>

                {/* Right side (C, D) */}
                <div className="flex gap-2">
                  {rightSeats.map((seat) => (
                    <Seat 
                      key={seat.id} 
                      seat={seat} 
                      isSelected={selectedSet.has(seat.id)} 
                      isSleeper={isSleeperLayout}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Rear section decoration */}
        <div className="mt-12 pt-6 border-t-4 border-slate-100 flex flex-col items-center gap-2">
           <div className="w-24 h-1 bg-slate-200 rounded-full" />
           <div className="text-[7px] font-black text-slate-300 uppercase tracking-[0.4em]">Engine Bay</div>
        </div>
      </div>

      <div className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 mt-8">
        Back of Bus
      </div>
    </div>
  );
};

export default SeatMap;
