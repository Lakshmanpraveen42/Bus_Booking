import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookingStore } from '../../store/useBookingStore';

/**
 * Reusable booking step indicator with navigation capabilities.
 * Allows users to jump back to previous steps in the booking flow.
 */
const BookingSteps = ({ currentStep }) => {
  const navigate = useNavigate();
  const selectedBus = useBookingStore((s) => s.selectedBus);
  const selectedSeats = useBookingStore((s) => s.selectedSeats);

  const steps = [
    { label: 'Search', path: '/' },
    { label: 'Select Bus', path: '/buses' },
    { label: 'Select Seats', path: selectedBus ? `/seats/${selectedBus.tripId}` : null },
    { label: 'Checkout', path: selectedSeats.length > 0 ? '/checkout' : null },
    { label: 'Confirmation', path: null },
  ];

  const handleNavigate = (path, index) => {
    // Only allow navigating backwards to completed steps
    if (path && index < currentStep) {
      navigate(path);
    }
  };

  return (
    <div className="flex items-center gap-2 mb-8">
      {steps.map((step, i) => (
        <React.Fragment key={step.label}>
          <button
            type="button"
            onClick={() => handleNavigate(step.path, i)}
            disabled={!step.path || i >= currentStep}
            className={[
              'px-3 py-1 rounded-full text-xs font-semibold transition-all',
              i === currentStep 
                ? 'bg-primary-500 text-white cursor-default shadow-lg shadow-primary-500/20' 
                : i < currentStep 
                  ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 cursor-pointer' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed',
            ].join(' ')}
          >
            {i < currentStep ? '✓ ' : ''}{step.label}
          </button>
          {i < steps.length - 1 && (
            <div className={[
              'h-px flex-1',
              i < currentStep ? 'bg-emerald-200' : 'bg-slate-200'
            ].join(' ')} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default BookingSteps;
