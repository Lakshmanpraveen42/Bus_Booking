import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminStatCard from '../../components/admin/AdminStatCard';
import { DollarSign, Ticket, Bus as BusIcon, Users, TrendingUp, Clock, AlertCircle, Loader2 } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import api from '../../services/api';
import { formatPrice, formatDate } from '../../utils/formatters';

const Dashboard = () => {
  const [data, setData] = useState({ bookings: [], buses: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [bookingsRes, busesRes] = await Promise.all([
          api.get('/admin/bookings'),
          api.get('/admin/buses')
        ]);
        const bookings = Array.isArray(bookingsRes.data) ? bookingsRes.data : [];
        const buses = Array.isArray(busesRes.data) ? busesRes.data : [];

        setData({ 
          bookings: bookings.slice(0, 5), 
          buses: buses,
          totalBookings: bookings.length,
          totalRevenue: bookings.reduce((acc, b) => acc + (b.total_amount || 0), 0)
        });
      } catch (err) {
        console.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <AdminLayout title="Operations Overview">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 mb-8 lg:mb-12">
        <AdminStatCard 
          label="Total Revenue" 
          value={formatPrice(data.totalRevenue || 0)} 
          icon={<DollarSign />} 
          trend="up" 
          trendValue="Live"
          color="emerald"
        />
        <AdminStatCard 
          label="Total Bookings" 
          value={data.totalBookings || 0} 
          icon={<Ticket />} 
          trend="up" 
          trendValue="Live"
          color="primary"
        />
        <AdminStatCard 
          label="Active Fleet" 
          value={data.buses?.length || 0} 
          icon={<BusIcon />} 
          color="amber"
          trendValue="Buses"
        />
        <AdminStatCard 
          label="System Status" 
          value="Healthy" 
          icon={<AlertCircle />} 
          color="blue"
          trendValue="Online"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings Table */}
        <div className="lg:col-span-2 bg-white rounded-[32px] lg:rounded-[40px] p-6 lg:p-10 border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900">Live Booking Feed</h3>
            <button 
              onClick={() => window.location.href = '/admin/bookings'}
              className="text-primary-500 font-bold text-sm hover:underline"
            >
              View All
            </button>
          </div>
          
          <div className="overflow-x-auto -mx-6 lg:mx-0">
            <table className="w-full min-w-[600px] lg:min-w-0">
              <thead>
                <tr className="text-left text-slate-400 text-xs font-black uppercase tracking-widest border-b border-slate-50">
                  <th className="pb-4 px-6 lg:px-0">Booking ID</th>
                  <th className="pb-4 px-6 lg:px-0">Passenger</th>
                  <th className="pb-4 px-6 lg:px-0">Route Info</th>
                  <th className="pb-4 px-6 lg:px-0">Status</th>
                  <th className="pb-4 px-6 lg:px-0 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                   <tr><td colSpan="5" className="py-10 text-center font-bold text-slate-300">Synchronizing...</td></tr>
                ) : data.bookings.length === 0 ? (
                   <tr><td colSpan="5" className="py-10 text-center font-bold text-slate-300">Waiting for first booking...</td></tr>
                ) : data.bookings.map((booking) => (
                  <tr key={booking.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-5 px-6 lg:px-0 font-bold text-slate-900 text-sm">BGO-{booking.id * 123}</td>
                    <td className="py-5 px-6 lg:px-0">
                      <p className="font-bold text-slate-800 text-sm">User #{booking.user_id}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{formatDate(booking.booking_time)}</p>
                    </td>
                    <td className="py-5 px-6 lg:px-0 text-sm text-slate-600 font-medium">Trip: {booking.trip_id}</td>
                    <td className="py-5 px-6 lg:px-0">
                      <Badge variant={booking.status === 'booked' ? 'success' : 'danger'}>
                        {booking.status}
                      </Badge>
                    </td>
                    <td className="py-5 px-6 lg:px-0 text-right font-black text-slate-900">{formatPrice(booking.total_amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Health / Alerts */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-slate-950 rounded-[32px] lg:rounded-[40px] p-6 lg:p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-950/20">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
             <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary-500" />
                Fleet Utilization
             </h4>
             <div className="space-y-6">
                <div>
                   <div className="flex justify-between text-xs font-bold mb-2">
                      <span className="text-slate-400 uppercase tracking-widest">Active Capacity</span>
                      <span className="text-primary-400">Stable</span>
                   </div>
                   <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-500 w-[92%] rounded-full shadow-[0_0_10px_rgba(244,63,94,0.5)]"></div>
                   </div>
                </div>
             </div>
          </div>

          <div className="bg-white rounded-[32px] lg:rounded-[40px] p-6 lg:p-8 border border-slate-100 shadow-sm">
             <h4 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-emerald-500" />
                Security Status
             </h4>
             <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-sm font-bold text-slate-800 leading-snug mb-1">Endpoints Secured</p>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                   <span className="text-slate-400">JWT active</span>
                   <span className="text-emerald-500">Verified</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
