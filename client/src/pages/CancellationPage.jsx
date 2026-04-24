import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import { AlertTriangle, Clock, ShieldCheck, ArrowLeft, Loader2, CheckCircle2, IndianRupee, Info } from 'lucide-react';
import { bookingService } from '../services/bookingService';
import { formatPrice, formatDate, formatTime12h } from '../utils/formatters';
import { differenceInHours } from 'date-fns';

const CancellationPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [success, setSuccess] = useState(false);
  const [refundInfo, setRefundInfo] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await bookingService.getMyBookings();
        const found = data.find(b => b.id.toString() === bookingId);
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
  }, [bookingId, navigate]);

  const calculateRefund = () => {
    if (!booking) return { percentage: 0, amount: 0 };
    const dep = new Date(booking.trip.departure_time);
    const now = new Date();
    const hours = differenceInHours(dep, now);

    if (hours >= 24) return { percentage: 90, amount: booking.total_amount * 0.90 };
    if (hours >= 6) return { percentage: 75, amount: booking.total_amount * 0.75 };
    if (hours >= 2) return { percentage: 50, amount: booking.total_amount * 0.50 };
    return { percentage: 0, amount: 0 };
  };

  const handleCancel = async () => {
    setCancelling(true);
    try {
      const result = await bookingService.cancelBooking(bookingId);
      setRefundInfo(result);
      setSuccess(true);
    } catch (err) {
      alert(err.message || 'Cancellation failed');
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

  const refund = calculateRefund();

  if (success) {
    return (
      <PageWrapper className="bg-slate-50 min-h-screen py-32">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce-in">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-4">Cancellation Confirmed</h1>
          <p className="text-slate-500 mb-12">Your booking has been cancelled and your refund is being processed.</p>
          
          <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100 mb-12">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Refund Approved</p>
            <div className="flex items-center justify-center gap-2 text-5xl font-black text-slate-900 mb-4">
              <IndianRupee className="w-8 h-8 text-primary-500" />
              {refundInfo?.refund_amount}
            </div>
            <p className="text-sm text-slate-400">({refundInfo?.refund_percentage}% of original amount)</p>
            
            <div className="mt-10 p-6 bg-slate-50 rounded-2xl text-left border border-slate-100">
              <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
                <Info className="w-4 h-4 text-primary-500" /> What's next?
              </h4>
              <ul className="text-sm text-slate-600 space-y-3">
                <li className="flex items-start gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                   Verification email with refund details has been sent to your registered email.
                </li>
                <li className="flex items-start gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                   The amount will be credited back to your original source of payment.
                </li>
                <li className="flex items-start gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                   Processing time usually takes 5-7 business days depending on your bank.
                </li>
              </ul>
            </div>
          </div>
          
          <button 
            onClick={() => navigate('/my-bookings')}
            className="bg-primary-500 text-white px-10 py-4 rounded-2xl font-black shadow-lg shadow-primary-500/20 hover:scale-105 transition-all"
          >
            Back to My Bookings
          </button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-slate-950 pt-32 pb-48 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[120px] -mr-64 -mt-64"></div>
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <button 
            onClick={() => navigate('/my-bookings')}
            className="flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors font-bold text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Bookings
          </button>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Request Cancellation</h1>
          <p className="text-slate-400 text-lg">Review your ticket details and cancellation rules before proceeding.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-24 relative z-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Ticket Details */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100">
               <div className="flex items-center gap-4 mb-10 pb-8 border-b border-slate-50">
                 <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center">
                    <Clock className="w-8 h-8 text-red-500" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-black text-slate-900">{booking.trip.bus.name}</h3>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{booking.trip.source} → {booking.trip.destination}</p>
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Departure Date</p>
                    <p className="text-lg font-black text-slate-800">{formatDate(booking.trip.departure_time)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Departure Time</p>
                    <p className="text-lg font-black text-slate-800">{formatTime12h(booking.trip.departure_time.split('T')[1].substring(0,5))}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Seat Number(s)</p>
                    <p className="text-lg font-black text-slate-800">{booking.seat_numbers}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Amount Paid</p>
                    <p className="text-lg font-black text-slate-800">{formatPrice(booking.total_amount)}</p>
                  </div>
               </div>
            </div>

            {/* Rules */}
            <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100">
               <h4 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-primary-500" /> Cancellation & Refund Rules
               </h4>
               <div className="space-y-4">
                  {[
                    { time: '> 24 hrs before departure', refund: '90% Refund', color: 'bg-emerald-50 text-emerald-700' },
                    { time: '6 - 24 hrs before departure', refund: '75% Refund', color: 'bg-blue-50 text-blue-700' },
                    { time: '2 - 6 hrs before departure', refund: '50% Refund', color: 'bg-orange-50 text-orange-700' },
                    { time: '< 2 hrs before departure', refund: 'No Refund', color: 'bg-red-50 text-red-700' },
                  ].map((rule, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                       <span className="font-bold text-slate-600 text-sm">{rule.time}</span>
                       <span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest ${rule.color}`}>
                          {rule.refund}
                       </span>
                    </div>
                  ))}
               </div>
               <p className="mt-8 text-xs text-slate-400 leading-relaxed">
                  * Cancellation rules are set by the transport operator. Refund amount is calculated based on the time of request completion. Refunds are processed to the original payment source.
               </p>
            </div>
          </div>

          {/* Action Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[40px] p-8 shadow-2xl shadow-slate-200/50 border border-slate-100 sticky top-32">
               <div className="text-center mb-8">
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Estimated Refund</p>
                  <div className="flex items-center justify-center gap-1 text-4xl font-black text-slate-900">
                    <IndianRupee className="w-6 h-6 text-primary-500" />
                    {refund.amount.toFixed(2)}
                  </div>
                  <p className="text-xs font-bold text-emerald-500 mt-2">({refund.percentage}% of total)</p>
               </div>

               <div className="p-4 bg-red-50 rounded-2xl border border-red-100 mb-8">
                  <div className="flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                    <p className="text-xs text-red-600 font-medium leading-relaxed">
                      By clicking confirm, your ticket will be immediately cancelled and cannot be restored.
                    </p>
                  </div>
               </div>

               <button 
                 onClick={handleCancel}
                 disabled={cancelling || refund.percentage === 0}
                 className={`w-full py-5 rounded-2xl font-black text-white shadow-xl transition-all flex items-center justify-center gap-3 ${
                   cancelling || refund.percentage === 0
                   ? 'bg-slate-200 cursor-not-allowed'
                   : 'bg-red-500 hover:bg-red-600 shadow-red-500/20 hover:scale-[1.02] active:scale-[0.98]'
                 }`}
               >
                 {cancelling ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Cancellation'}
               </button>

               <button 
                 onClick={() => navigate('/my-bookings')}
                 className="w-full mt-4 py-4 text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors"
               >
                 No, Keep my booking
               </button>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default CancellationPage;
