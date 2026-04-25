import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import { AlertTriangle, Clock, ShieldCheck, ArrowLeft, Loader2, CheckCircle2, IndianRupee, Info } from 'lucide-react';
import { bookingService } from '../services/bookingService';
import { formatPrice } from '../utils/formatters';
import { useAuthStore } from '../store/useAuthStore';

const CancellationPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [success, setSuccess] = useState(false);
  const [refundInfo, setRefundInfo] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!isAuthenticated || !user?.id) return;
      try {
        const data = await bookingService.getMyBookings(user.id);
        const found = data.find(b => b.booking_id.toString() === bookingId);
        if (!found) {
          navigate('/my-bookings');
          return;
        }
        setBooking(found);
      } catch (err) {
        console.error('Failed to fetch booking');
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId, navigate, isAuthenticated, user?.id]);

  const handleCancel = async () => {
    if (!user?.id) return toast.error("Authentication required");
    
    setCancelling(true);
    try {
      const result = await bookingService.cancelBooking(user.id, bookingId);
      setRefundInfo(result);
      setSuccess(true);
    } catch (err) {
      console.error('Cancellation failed', err);
      const msg = err.response?.data?.detail || 'Cancellation failed. Please try again.';
      alert(msg);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <PageWrapper className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
      </PageWrapper>
    );
  }

  // Fallback refund logic if backend result is not yet available
  const estimatedRefundAmount = booking?.total_amount * 0.90;

  if (success) {
    return (
      <PageWrapper className="bg-slate-50 min-h-screen py-32">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce-in">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-4">Request Received</h1>
          <p className="text-slate-500 mb-12">Your booking #{booking.booking_id} status is being updated.</p>
          
          <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100 mb-12 text-center">
             <Info className="w-12 h-12 text-primary-500 mx-auto mb-4" />
             <p className="text-lg font-black text-slate-900 mb-2">Refund Initiated</p>
             <p className="text-sm text-slate-500">The refund will be processed to your original payment source within 5-7 business days.</p>
          </div>
          
          <button 
            onClick={() => navigate('/my-bookings')}
            className="bg-primary-500 text-white px-10 py-4 rounded-2xl font-black shadow-lg shadow-primary-500/20"
          >
            Back to My Bookings
          </button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="bg-slate-50 min-h-screen">
      <div className="bg-slate-950 pt-32 pb-48 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <button onClick={() => navigate('/my-bookings')} className="flex items-center gap-2 text-white/50 hover:text-white mb-6 uppercase tracking-widest font-black text-[10px]">
            <ArrowLeft className="w-4 h-4" /> Back to History
          </button>
          <h1 className="text-4xl font-black text-white mb-4">Confirm Cancellation</h1>
          <p className="text-slate-400">Review your ticket details before revoking your booking.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-24 relative z-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[40px] p-10 shadow-2xl shadow-slate-200/50 border border-slate-100">
               <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-50">
                  <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center">
                     <Clock className="w-6 h-6" />
                  </div>
                  <div>
                     <h3 className="text-xl font-black text-slate-900">{booking.bus_name}</h3>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{booking.source} → {booking.destination}</p>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-8">
                  <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Seats</p>
                     <p className="text-sm font-bold text-slate-900">{booking.passengers?.map(p => p.seat_number).join(', ')}</p>
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Paid Amount</p>
                     <p className="text-sm font-bold text-slate-900">{formatPrice(booking.total_amount)}</p>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-[40px] p-10 shadow-2xl shadow-slate-200/50 border border-slate-100">
               <h4 className="text-sm font-black text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-widest">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" /> Cancellation Guidelines
               </h4>
               <p className="text-xs text-slate-500 leading-relaxed">
                  Cancellations made more than 2 hours before trip departure are eligible for a partial refund. The refund will be credited back to your original source of payment within 5-7 working days. Once cancelled, this seat cannot be restored.
               </p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-[40px] p-8 shadow-2xl border border-slate-100 sticky top-32">
               <div className="text-center mb-8">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Estimated Refund</p>
                  <div className="text-3xl font-black text-slate-900 flex items-center justify-center gap-1">
                    <IndianRupee className="w-5 h-5 text-primary-500" />
                    {estimatedRefundAmount.toFixed(2)}
                  </div>
               </div>

               <div className="p-4 bg-red-50 rounded-2xl border border-red-100 mb-6 flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                  <p className="text-[10px] text-red-600 font-bold leading-relaxed uppercase tracking-tighter">
                    Action is permanent.
                  </p>
               </div>

               <button 
                 onClick={handleCancel}
                 className={`w-full py-5 bg-red-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-500/10 hover:bg-red-600 transition-all flex items-center justify-center gap-2 ${cancelling ? 'opacity-50' : ''}`}
                 disabled={cancelling}
               >
                 {cancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Cancellation'}
               </button>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default CancellationPage;
