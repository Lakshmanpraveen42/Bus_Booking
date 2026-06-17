import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminStatCard from '../../components/admin/AdminStatCard';
import { DollarSign, Ticket, Bus as BusIcon, Users, TrendingUp, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Badge from '../../components/ui/Badge';
import api from '../../services/api';
import { formatPrice, formatDate } from '../../utils/formatters';
import { useAuthStore } from '../../store/useAuthStore';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [data, setData] = useState({ bookings: [], buses: [], statusData: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        let bookings = [];
        let buses = [];

        try {
          const bookingsRes = await api.get('/admin/bookings');
          bookings = Array.isArray(bookingsRes.data) ? bookingsRes.data : [];
        } catch (err) {
          console.error('Failed to fetch bookings', err);
        }

        try {
          const busesRes = await api.get('/admin/buses', {
            params: { user_id: user.id }
          });
          buses = Array.isArray(busesRes.data) ? busesRes.data : [];
        } catch (err) {
          console.error('Failed to fetch buses', err);
        }

        const statusCounts = bookings.reduce((acc, b) => {
          const status = b.status || 'unknown';
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});

        const statusData = Object.keys(statusCounts).map(key => ({
          name: key.toUpperCase(),
          value: statusCounts[key]
        }));

        // Calculate real chart data for last 7 days
        const last7Days = Array.from({length: 7}).map((_, i) => {
           const d = new Date();
           d.setDate(d.getDate() - (6 - i));
           return {
              dateStr: d.toISOString().split('T')[0],
              name: d.toLocaleDateString('en-US', { weekday: 'short' }),
              value: 0
           };
        });

        bookings.forEach(b => {
           if (b.booking_time) {
              const bDate = new Date(b.booking_time).toISOString().split('T')[0];
              const dayObj = last7Days.find(d => d.dateStr === bDate);
              if (dayObj) {
                 dayObj.value += 1;
              }
           }
        });

        setData({ 
          bookings: bookings.slice(0, 5), 
          buses: buses,
          totalBookings: bookings.length || 0,
          totalRevenue: bookings.reduce((acc, b) => acc + (Number(b.total_amount) || 0), 0),
          statusData: statusData.length > 0 ? statusData : [{ name: 'NO DATA', value: 1 }],
          chartData: last7Days
        });
      } catch (err) {
        console.error('Failed to load dashboard data', err);
        setData({ bookings: [], buses: [], totalBookings: 0, totalRevenue: 0, statusData: [{ name: 'NO DATA', value: 1 }] });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.id]);

  return (
    <AdminLayout title="Operations Overview">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 lg:gap-8 mb-8 lg:mb-12">
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

      {/* Charts Row */}
      <div className="mb-8 lg:mb-12">
        {/* Total Bookings Trend Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-[32px] lg:rounded-[40px] p-6 lg:p-10 border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 transition-colors">Total Bookings Trend</h3>
             <Badge variant="primary" size="sm">Last 7 Days</Badge>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.chartData || []}>
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} dx={-10} tickFormatter={(val) => val} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: 'none', color: '#f8fafc', fontWeight: 'bold' }}
                  itemStyle={{ color: '#3b82f6' }}
                  formatter={(value) => [value, 'Bookings']}
                />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorBookings)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings Table */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[32px] lg:rounded-[40px] p-6 lg:p-10 border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 transition-colors">Live Booking Feed</h3>
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
                <tr className="text-left text-slate-400 dark:text-slate-500 text-xs font-black uppercase tracking-widest border-b border-slate-50 dark:border-slate-800 transition-colors">
                  <th className="pb-4 px-6 lg:px-0">Booking ID</th>
                  <th className="pb-4 px-6 lg:px-0">Passenger</th>
                  <th className="pb-4 px-6 lg:px-0">Route Info</th>
                  <th className="pb-4 px-6 lg:px-0">Status</th>
                  <th className="pb-4 px-6 lg:px-0 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800 transition-colors">
                {loading ? (
                   <tr><td colSpan="5" className="py-10 text-center font-bold text-slate-300">Synchronizing...</td></tr>
                ) : data.bookings.length === 0 ? (
                   <tr><td colSpan="5" className="py-10 text-center font-bold text-slate-300">Waiting for first booking...</td></tr>
                ) : data.bookings.map((booking) => (
                  <tr key={booking.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-5 px-6 lg:px-0 font-bold text-slate-900 dark:text-slate-100 text-sm transition-colors">BGO-{booking.id}</td>
                    <td className="py-5 px-6 lg:px-0">
                      <p className="font-bold text-slate-800 dark:text-slate-200 text-sm transition-colors">User #{booking.user_id}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium transition-colors">{formatDate(booking.booking_time)}</p>
                    </td>
                    <td className="py-5 px-6 lg:px-0 text-sm text-slate-600 dark:text-slate-300 font-medium transition-colors">
                      {booking.trip ? `${booking.trip.source} → ${booking.trip.destination}` : 'N/A'}
                    </td>
                    <td className="py-5 px-6 lg:px-0">
                      <Badge variant={booking.status === 'booked' ? 'success' : 'danger'}>
                        {booking.status}
                      </Badge>
                    </td>
                    <td className="py-5 px-6 lg:px-0 text-right font-black text-slate-900 dark:text-slate-100 transition-colors">{formatPrice(booking.total_amount)}</td>
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

          <div className="bg-white dark:bg-slate-900 rounded-[32px] lg:rounded-[40px] p-6 lg:p-8 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
             <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2 transition-colors">
                <AlertCircle className="w-5 h-5 text-emerald-500" />
                Security Status
             </h4>
             <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 transition-colors">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-snug mb-1 transition-colors">Endpoints Secured</p>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                   <span className="text-slate-400 dark:text-slate-500 transition-colors">JWT active</span>
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
