import React, { useState, useEffect } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import Badge from '../components/ui/Badge';
import { Ticket, Calendar, Clock, MapPin, ChevronRight, Download, XCircle, Bus, Loader2 } from 'lucide-react';
import { bookingService } from '../services/bookingService';
import { formatPrice, formatDate, formatTime12h } from '../utils/formatters';

const MyBookings = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookings, setBookings] = useState({ upcoming: [], past: [] });
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getMyBookings();
      
      const now = new Date();
      const upcoming = [];
      const past = [];
      
      data.forEach(b => {
        const depDate = new Date(b.trip.departure_time);
        if (depDate >= now) {
          upcoming.push(b);
        } else {
          past.push(b);
        }
      });
      
      setBookings({ upcoming, past });
    } catch (err) {
      console.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <PageWrapper className="pb-24 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-slate-950 pt-32 pb-48 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[120px] -mr-64 -mt-64"></div>
        
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">My Bookings</h1>
          <p className="text-slate-400 text-lg">Manage your journeys, download tickets, or cancel trips.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-24 relative z-20">
        {/* Tabs */}
        <div className="bg-white rounded-3xl p-2 shadow-xl shadow-slate-200/50 mb-8 flex gap-2 w-fit border border-slate-100">
          {['upcoming', 'past'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 rounded-2xl font-bold text-sm transition-all ${
                activeTab === tab 
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' 
                : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Trips
            </button>
          ))}
        </div>

        {/* Bookings List */}
        <div className="space-y-6">
          {loading ? (
             <div className="bg-white rounded-[40px] p-20 text-center shadow-xl shadow-slate-200/50 border border-slate-100">
               <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
               <p className="text-slate-400 font-bold uppercase tracking-widest">Loading your journeys...</p>
             </div>
          ) : bookings[activeTab].length > 0 ? (
            bookings[activeTab].map((booking) => (
              <div key={booking.id} className="bg-white rounded-[40px] p-6 md:p-8 shadow-2xl shadow-slate-200/50 border border-slate-100 group hover:border-primary-500/20 transition-all duration-500">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Bus Icon */}
                  <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                    <Bus className="w-10 h-10 text-primary-500" />
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                      <div>
                        <h3 className="text-2xl font-black text-slate-900 mb-1">{booking.trip.bus.name}</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Booking ID: BGO-{booking.id * 888}</p>
                      </div>
                      <Badge variant={booking.status === 'booked' ? 'success' : 'danger'}>
                        {booking.status === 'booked' ? 'Confirmed' : 'Cancelled'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                          <MapPin className="w-3 h-3" /> Route
                        </div>
                        <p className="font-bold text-slate-800">{booking.trip.source} → {booking.trip.destination}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                          <Calendar className="w-3 h-3" /> Date
                        </div>
                        <p className="font-bold text-slate-800">{formatDate(booking.trip.departure_time)}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                          <Clock className="w-3 h-3" /> Time
                        </div>
                        <p className="font-bold text-slate-800">{formatTime12h(booking.trip.departure_time.split('T')[1].substring(0,5))}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                          <Ticket className="w-3 h-3" /> Seat(s)
                        </div>
                        <p className="font-bold text-slate-800">{booking.seat_numbers}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-8 pt-8 border-t border-slate-50 flex flex-wrap items-center justify-between gap-4">
                  <div className="text-2xl font-black text-slate-900">
                    <span className="text-sm font-bold text-slate-400 mr-1 italic">Paid:</span> {formatPrice(booking.total_amount)}
                  </div>
                  <div className="flex gap-4">
                    {booking.status === 'booked' && (
                      <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-slate-900/10">
                        <Download className="w-4 h-4" /> Download Ticket
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-[40px] p-20 text-center shadow-xl shadow-slate-200/50 border border-slate-100">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                 <Ticket className="w-12 h-12 text-slate-300" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">No {activeTab} bookings found</h3>
              <p className="text-slate-500 mb-10">You haven't made any bookings yet. Start your journey today!</p>
              <button 
                onClick={() => window.location.href = '/'}
                className="bg-primary-500 text-white px-10 py-4 rounded-2xl font-black shadow-lg shadow-primary-500/20 hover:scale-105 transition-all active:scale-95"
              >
                Book a Bus Now
              </button>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default MyBookings;
