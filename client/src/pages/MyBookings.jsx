import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import Badge from '../components/ui/Badge';
import { Ticket, Calendar, Clock, MapPin, ChevronRight, Download, XCircle, Bus, Loader2, LogIn } from 'lucide-react';
import { bookingService } from '../services/bookingService';
import { formatPrice, formatDate } from '../utils/formatters';
import { useAuthStore } from '../store/useAuthStore';

const MyBookings = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookings, setBookings] = useState({ upcoming: [], past: [] });
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    if (!isAuthenticated || !user?.id) return;
    
    try {
      setLoading(true);
      const userId = user.id || "SB_USER_6549";
      const data = await bookingService.getMyBookings(userId);
      
      // In this version, we'll treat all recent bookings as upcoming
      // until the backend provides a travel_date field
      setBookings({ 
        upcoming: data, 
        past: [] 
      });
    } catch (err) {
      console.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  return (
    <PageWrapper className="pb-24 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-slate-950 pt-32 pb-48 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[120px] -mr-64 -mt-64"></div>
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <h1 className="text-4xl font-black text-white mb-4">My Bookings</h1>
          <p className="text-slate-400">View and manage your travel history.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-24 relative z-20">
        
        {/* Simple Toggle */}
        <div className="bg-white rounded-3xl p-2 shadow-xl shadow-slate-200/50 mb-8 flex gap-2 w-fit border border-slate-100">
          <button onClick={() => setActiveTab('upcoming')} className={`px-8 py-3 rounded-2xl font-bold text-sm transition-all ${activeTab === 'upcoming' ? 'bg-primary-500 text-white' : 'text-slate-500'}`}>Upcoming</button>
          <button onClick={() => setActiveTab('past')} className={`px-8 py-3 rounded-2xl font-bold text-sm transition-all ${activeTab === 'past' ? 'bg-primary-500 text-white' : 'text-slate-500'}`}>Past Trips</button>
        </div>

        {/* Bookings List */}
        <div className="space-y-6">
          {loading ? (
             <LoadingSpinner />
          ) : bookings[activeTab].length > 0 ? (
            bookings[activeTab].map((booking) => (
              <BookingItem key={booking.booking_id} booking={booking} />
            ))
          ) : !isAuthenticated ? (
            <LoginPrompt onLogin={() => navigate('/login')} />
          ) : (
            <EmptyState tab={activeTab} />
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

// ─── HELPER COMPONENTS ───────────────────────────────

const BookingItem = ({ booking }) => {
  // Aggregate seat numbers from passengers
  const seatNumbers = booking.passengers?.map(p => p.seat_number).join(', ') || 'N/A';
  
  return (
    <div className="bg-white rounded-[40px] p-8 shadow-2xl shadow-slate-200/50 border border-slate-100 group transition-all duration-500 overflow-hidden relative">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0">
          <Bus className="w-8 h-8 text-primary-500" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-black text-slate-900 mb-1">{booking.bus_name}</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reference: #SB_BK_{booking.booking_id}</p>
            </div>
            <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border ${booking.status === 'booked' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
               {booking.status === 'booked' ? 'Confirmed' : 'Cancelled'}
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <InfoCol icon={<MapPin className="w-3 h-3" />} label="Route" value={`${booking.source} → ${booking.destination}`} />
            <InfoCol icon={<Calendar className="w-3 h-3" />} label="Booking Date" value={booking.booking_time.split(' ')[0]} />
            <InfoCol icon={<Clock className="w-3 h-3" />} label="Booking Time" value={booking.booking_time.split(' ')[1]} />
            <InfoCol icon={<Ticket className="w-3 h-3" />} label="Seats" value={seatNumbers} />
          </div>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
         <div className="text-2xl font-black text-slate-900">
            <span className="text-xs font-bold text-slate-400 mr-2 italic">Paid:</span>{formatPrice(booking.total_amount)}
         </div>
         <div className="flex gap-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-xs font-black text-slate-600 transition-all">
               <Download className="w-4 h-4" /> Ticket
            </button>
            {booking.status === 'booked' && (
              <a 
                href={`/cancel-booking/${booking.booking_id}`}
                className="flex items-center gap-2 px-6 py-3 bg-white text-red-500 border border-red-50 rounded-2xl text-xs font-black hover:bg-red-50 transition-all shadow-sm"
              >
                 <XCircle className="w-4 h-4" /> Cancel Trip
              </a>
            )}
         </div>
      </div>
    </div>
  );
};

const InfoCol = ({ icon, label, value }) => (
  <div className="space-y-1">
    <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">{icon} {label}</div>
    <p className="text-sm font-bold text-slate-900 truncate">{value}</p>
  </div>
);

const LoadingSpinner = () => (
  <div className="bg-white rounded-[40px] p-20 text-center shadow-xl border border-slate-100">
    <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
    <p className="text-slate-400 font-bold uppercase tracking-widest">Fetching records...</p>
  </div>
);

const LoginPrompt = ({ onLogin }) => (
  <div className="bg-white rounded-[40px] p-20 text-center shadow-xl border border-slate-100">
    <h3 className="text-2xl font-black text-slate-900 mb-8">Login to view history</h3>
    <button onClick={onLogin} className="bg-primary-500 text-white px-10 py-4 rounded-2xl font-black shadow-lg">Login Now</button>
  </div>
);

const EmptyState = ({ tab }) => (
  <div className="bg-white rounded-[40px] p-20 text-center shadow-xl border border-slate-100">
    <Ticket className="w-12 h-12 text-slate-200 mx-auto mb-6" />
    <h3 className="text-xl font-bold text-slate-900">No {tab} bookings</h3>
    <p className="text-slate-400 mt-2">Start your journey today!</p>
  </div>
);

export default MyBookings;
