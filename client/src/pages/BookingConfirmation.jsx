import React from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle, Download, RotateCcw, MapPin, Calendar, Users } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/ui/Button';
import { useBookingStore } from '../store/useBookingStore';
import { buildQRPayload } from '../utils/generators';
import { formatDate, formatTime12h, formatPrice } from '../utils/formatters';

const ConfirmationRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-0">
    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
      <Icon className="w-4 h-4 text-slate-500" />
    </div>
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-sm font-semibold text-slate-800">{value}</p>
    </div>
  </div>
);

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const bookingId = useBookingStore((s) => s.bookingId);
  const selectedBus = useBookingStore((s) => s.selectedBus);
  const selectedSeats = useBookingStore((s) => s.selectedSeats);
  const pricing = useBookingStore((s) => s.pricing);
  const passengers = useBookingStore((s) => s.passengers);
  const resetBooking = useBookingStore((s) => s.resetBooking);

  const qrPayload = buildQRPayload({
    bookingId,
    from: selectedBus?.from,
    to: selectedBus?.to,
    date: selectedBus?.date,
    seats: selectedSeats,
  });

  const handleBookAnother = () => {
    resetBooking();
    navigate('/');
  };

  return (
    <PageWrapper noFooter={false}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        {/* Success Banner */}
        <div className="text-center mb-10 animate-bounce-in">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800 mb-2">Booking Confirmed!</h1>
          <p className="text-slate-500">Your ticket has been booked successfully. Have a great journey! 🎉</p>
        </div>

        {/* Ticket Card */}
        <div className="bg-white rounded-3xl shadow-modal border border-slate-100 overflow-hidden mb-6 animate-fade-in">
          {/* Ticket Header */}
          <div className="bg-gradient-to-r from-primary-500 to-accent-500 px-6 py-5 text-white">
            <div className="flex justify-between items-start flex-wrap gap-2">
              <div>
                <p className="text-white/70 text-xs uppercase tracking-wider mb-1">Booking ID</p>
                <p className="text-2xl font-black tracking-wide">{bookingId}</p>
              </div>
              <div className="text-right">
                <p className="text-white/70 text-xs uppercase tracking-wider mb-1">Status</p>
                <span className="bg-emerald-400/20 border border-emerald-300/40 text-white text-sm font-semibold px-3 py-1 rounded-full">
                  ✓ Confirmed
                </span>
              </div>
            </div>
          </div>

          {/* Perforated edge */}
          <div className="flex items-center px-4">
            <div className="w-5 h-5 bg-background rounded-full -ml-3" />
            <div className="flex-1 border-t-2 border-dashed border-slate-200 mx-1" />
            <div className="w-5 h-5 bg-background rounded-full -mr-3" />
          </div>

          {/* Ticket Body */}
          <div className="px-6 py-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Journey + QR */}
              <div>
                {selectedBus && (
                  <>
                    <ConfirmationRow
                      icon={MapPin}
                      label="Route"
                      value={`${selectedBus.from} → ${selectedBus.to}`}
                    />
                    <ConfirmationRow
                      icon={Calendar}
                      label="Date & Departure"
                      value={`${formatDate(selectedBus.date)} at ${formatTime12h(selectedBus.departureTime)}`}
                    />
                    <ConfirmationRow
                      icon={Users}
                      label="Seats"
                      value={selectedSeats.join(', ')}
                    />
                  </>
                )}
                <div className="py-3">
                  <p className="text-xs text-slate-400 mb-1">Total Paid</p>
                  <p className="text-2xl font-extrabold text-primary-600">{formatPrice(pricing.total)}</p>
                </div>
              </div>

              {/* QR Code */}
              <div className="flex flex-col items-center justify-center gap-2 bg-slate-50 rounded-2xl p-4">
                <QRCodeSVG value={qrPayload} size={130} fgColor="#1E293B" />
                <p className="text-xs text-slate-400 text-center">Scan at boarding</p>
              </div>
            </div>

            {/* Passengers */}
            {passengers.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-3">Passengers</p>
                <div className="space-y-2">
                  {passengers.map((p, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 bg-primary-100 rounded-md flex items-center justify-center text-xs font-bold text-primary-700">
                          {i + 1}
                        </span>
                        <span className="font-medium text-slate-800">{p.name || `Passenger ${i+1}`}</span>
                      </div>
                      <div className="flex gap-3 text-slate-400">
                        <span>Age: {p.age}</span>
                        <span className="capitalize">{p.gender}</span>
                        <span className="text-primary-600 font-semibold">Seat {p.seatId}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            fullWidth
            variant="secondary"
            size="lg"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={() => alert('Download feature coming soon!')}
          >
            Download Ticket
          </Button>
          <Button
            fullWidth
            size="lg"
            leftIcon={<RotateCcw className="w-4 h-4" />}
            onClick={handleBookAnother}
          >
            Book Another Trip
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
};

export default BookingConfirmation;
