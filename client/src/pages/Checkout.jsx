import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { ArrowLeft, AlertCircle, RefreshCw, ShieldCheck } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import BookingSummary from '../components/booking/BookingSummary';
import PricingBreakdown from '../components/booking/PricingBreakdown';
import PassengerFormRow from '../components/booking/PassengerFormRow';
import Button from '../components/ui/Button';
import { useBookingStore } from '../store/useBookingStore';
import { useBooking } from '../hooks/useBooking';
import { BOOKING_STATUS } from '../utils/constants';

const Checkout = () => {
  const navigate = useNavigate();
  const selectedBus = useBookingStore((s) => s.selectedBus);
  const selectedSeats = useBookingStore((s) => s.selectedSeats);
  const pricing = useBookingStore((s) => s.pricing);
  const setPassengers = useBookingStore((s) => s.setPassengers);
  const { submit, retry, isProcessing, isSuccess, isFailed, error } = useBooking();

  const methods = useForm({
    defaultValues: {
      passengers: selectedSeats.map((id) => ({ seatId: id, name: '', age: '', gender: '' })),
    },
  });

  // Redirect to confirmation once success
  useEffect(() => {
    if (isSuccess) navigate('/confirmation');
  }, [isSuccess, navigate]);

  const onSubmit = async (data) => {
    setPassengers(data.passengers);
    await submit();
  };

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
        {/* Back */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            disabled={isProcessing}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-500 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Seat Selection
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {['Search', 'Select Bus', 'Select Seats', 'Checkout', 'Confirmation'].map((step, i) => (
            <React.Fragment key={step}>
              <div className={[
                'px-3 py-1 rounded-full text-xs font-semibold',
                i === 3 ? 'bg-primary-500 text-white' : i < 3 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400',
              ].join(' ')}>
                {i < 3 ? '✓ ' : ''}{step}
              </div>
              {i < 4 && <div className="h-px flex-1 bg-slate-200" />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Passenger Details Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-5 mb-5">
              <h2 className="font-bold text-slate-800 text-lg mb-1">Passenger Details</h2>
              <p className="text-sm text-slate-400 mb-5">
                Fill in details for each seat — {selectedSeats.length} passenger{selectedSeats.length > 1 ? 's' : ''}
              </p>

              <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)} id="checkout-form">
                  <div className="space-y-4">
                    {selectedSeats.map((seatId, index) => (
                      <PassengerFormRow key={seatId} index={index} seatId={seatId} />
                    ))}
                  </div>
                </form>
              </FormProvider>
            </div>

            {/* Error Banner */}
            {isFailed && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3 animate-fade-in">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-700">Payment Failed</p>
                  <p className="text-sm text-red-600 mt-0.5">{error}</p>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={retry}
                  leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                >
                  Retry
                </Button>
              </div>
            )}
          </div>

          {/* Right: Summary (sticky) */}
          <div className="lg:col-span-1 space-y-4">
            <BookingSummary bus={selectedBus} selectedSeats={selectedSeats} />
            <PricingBreakdown pricing={pricing} seatCount={selectedSeats.length} />

            {/* Pay Button */}
            <Button
              type="submit"
              form="checkout-form"
              fullWidth
              size="xl"
              loading={isProcessing}
              disabled={isProcessing}
              leftIcon={!isProcessing && <ShieldCheck className="w-5 h-5" />}
            >
              {isProcessing ? 'Processing Payment…' : `Pay ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(pricing.total)}`}
            </Button>

            <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              256-bit SSL encrypted · Your data is safe
            </p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Checkout;
