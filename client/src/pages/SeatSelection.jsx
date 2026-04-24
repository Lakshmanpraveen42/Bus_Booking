import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Layers } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import SeatMap from '../components/seat/SeatMap';
import SeatLegend from '../components/seat/SeatLegend';
import { SeatMapSkeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/bus/States';
import Button from '../components/ui/Button';
import { useSeats } from '../hooks/useSeats';
import { useBookingStore } from '../store/useBookingStore';
import { formatPrice, formatTime12h } from '../utils/formatters';
import { MAX_SEATS_PER_BOOKING } from '../utils/constants';
import RoutePointsSelector from '../components/seat/RoutePointsSelector';
import BookingSteps from '../components/booking/BookingSteps';

const SeatSelection = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { data: layout, loading, error, refetch } = useSeats(tripId);
  const selectedBus = useBookingStore((s) => s.selectedBus);
  const selectedSeats = useBookingStore((s) => s.selectedSeats);
  const boardingPoint = useBookingStore((s) => s.boardingPoint);
  const droppingPoint = useBookingStore((s) => s.droppingPoint);
  const pricing = useBookingStore((s) => s.pricing);

  const [activeDeck, setActiveDeck] = useState('lower');

  const hasTwoDecks = layout?.decks?.length > 1;
  const canContinue = selectedSeats.length > 0 && boardingPoint && droppingPoint;

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-500"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <span className="text-slate-300">/</span>
          <h1 className="text-sm font-semibold text-slate-700">
            Select Seats — {selectedBus?.operatorName}
          </h1>
        </div>

        {/* Step indicator */}
        <BookingSteps currentStep={2} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Seat Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-5">
              <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                <div>
                  <h2 className="font-bold text-slate-800">Choose Your Seats</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    You can select up to {MAX_SEATS_PER_BOOKING} seats per booking
                  </p>
                </div>
                {hasTwoDecks && (
                  <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
                    {layout.decks.map((deck) => (
                      <button
                        key={deck}
                        onClick={() => setActiveDeck(deck)}
                        className={[
                          'px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors flex items-center gap-1',
                          activeDeck === deck
                            ? 'bg-white text-primary-600 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700',
                        ].join(' ')}
                      >
                        <Layers className="w-3 h-3" />
                        {deck} Deck
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {loading && <SeatMapSkeleton />}
              {error && <ErrorState message={error} onRetry={refetch} />}
              {!loading && !error && layout && (
                <SeatMap
                  layout={layout.layout}
                  seats={layout.seats}
                  activeDeck={activeDeck}
                />
              )}

              <div className="mt-5 pt-4 border-t border-slate-100">
                <SeatLegend />
              </div>

              {!loading && !error && layout && (
                  <RoutePointsSelector stops={layout.stops} />
              )}
            </div>
          </div>

          {/* Right: Summary + CTA (sticky) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-5 sticky top-24">
              {/* Bus info */}
              {selectedBus && (
                <div className="mb-5 pb-4 border-b border-slate-100">
                  <p className="text-xs text-slate-400 mb-1">Selected Bus</p>
                  <p className="font-bold text-slate-800">{selectedBus.operatorName}</p>
                  <p className="text-xs text-slate-500">{selectedBus.busSubType}</p>
                  <div className="flex gap-3 mt-2 text-sm">
                    <span className="text-slate-700 font-medium">{formatTime12h(selectedBus.departureTime)}</span>
                    <span className="text-slate-400">→</span>
                    <span className="text-slate-700 font-medium">{formatTime12h(selectedBus.arrivalTime)}</span>
                  </div>
                </div>
              )}

              {/* Route Points Summary */}
              {(boardingPoint || droppingPoint) && (
                <div className="mb-5 pb-4 border-b border-slate-100 space-y-2">
                   {boardingPoint && (
                     <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                       <span className="text-xs text-slate-500 font-medium">{boardingPoint} (Boarding)</span>
                     </div>
                   )}
                   {droppingPoint && (
                     <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                       <span className="text-xs text-slate-500 font-medium">{droppingPoint} (Dropping)</span>
                     </div>
                   )}
                </div>
              )}

              {/* Selected seats list */}
              <div className="mb-5">
                <p className="text-xs text-slate-400 mb-2">
                  Selected Seats ({selectedSeats.length}/{MAX_SEATS_PER_BOOKING})
                </p>
                {selectedSeats.length === 0 ? (
                  <p className="text-sm text-slate-400 italic">No seats selected yet</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSeats.map((id) => (
                      <span key={id} className="px-2.5 py-1 bg-primary-50 text-primary-700 text-xs font-bold rounded-lg border border-primary-200">
                        {id}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Pricing */}
              {selectedSeats.length > 0 && (
                <div className="mb-5 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500">Base Fare</span>
                    <span className="font-medium">{formatPrice(pricing.baseFare)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-500">GST (5%)</span>
                    <span className="font-medium">{formatPrice(pricing.gst)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold border-t border-slate-200 pt-2">
                    <span className="text-slate-800">Total</span>
                    <span className="text-primary-600">{formatPrice(pricing.total)}</span>
                  </div>
                </div>
              )}

              <Button
                fullWidth
                size="lg"
                disabled={!canContinue}
                onClick={() => navigate('/checkout')}
                rightIcon={<ChevronRight className="w-5 h-5" />}
              >
                {canContinue
                  ? `Continue (${selectedSeats.length} seat${selectedSeats.length > 1 ? 's' : ''})`
                  : 'Select at least 1 seat'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default SeatSelection;
