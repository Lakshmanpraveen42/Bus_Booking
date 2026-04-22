import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Search, Download, Filter, Eye, MoreVertical, Ticket, Calendar, MapPin, User, Loader2 } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import api from '../../services/api';
import { formatPrice, formatDate } from '../../utils/formatters';

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/bookings');
      setBookings(res.data);
    } catch (err) {
      console.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <AdminLayout title="Global Bookings Ledger">
      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4 w-full lg:w-auto flex-1">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by ID, Customer..." 
              className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary-500 shadow-sm"
            />
          </div>
        </div>
        
        <button className="w-full lg:w-auto flex items-center justify-center gap-2 bg-emerald-600 text-white px-8 py-3.5 rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/10 active:scale-95">
          <Download className="w-5 h-5" /> Export as CSV
        </button>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-xs font-black uppercase tracking-widest border-b border-slate-50">
                <th className="px-8 py-6">Passenger Info</th>
                <th className="px-8 py-6">Journey Details</th>
                <th className="px-8 py-6">Booking Date</th>
                <th className="px-8 py-6">Payment</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="6" className="px-8 py-20 text-center text-slate-400 font-bold uppercase tracking-widest">
                  <div className="flex items-center justify-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin" /> Fetching ledger...
                  </div>
                </td></tr>
              ) : bookings.length === 0 ? (
                <tr><td colSpan="6" className="px-8 py-20 text-center text-slate-400 font-bold uppercase tracking-widest">No bookings found in history</td></tr>
              ) : bookings.map((booking) => (
                <tr key={booking.id} className="group hover:bg-slate-50/50 transition-all duration-300">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-black text-slate-900 leading-none mb-1">Customer #{booking.id}</p>
                        <p className="text-[10px] text-slate-400 font-medium whitespace-nowrap">Ref: BGO-{booking.id * 123}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-slate-300" />
                      Trip ID: {booking.trip_id}
                    </div>
                    <p className="mt-1 text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">Seats: {booking.seat_numbers}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                      <Calendar className="w-3.5 h-3.5 text-slate-300" />
                      {formatDate(booking.booking_time)}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-black text-slate-900 text-base">{formatPrice(booking.total_amount)}</p>
                    <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mt-1">Paid</p>
                  </td>
                  <td className="px-8 py-6">
                    <Badge variant={booking.status === 'booked' ? 'success' : 'danger'}>
                      {booking.status}
                    </Badge>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="p-2 bg-slate-100 text-slate-500 rounded-xl hover:bg-primary-500 hover:text-white transition-all shadow-sm">
                          <Eye className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AllBookings;
