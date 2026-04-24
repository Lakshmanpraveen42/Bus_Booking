import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Search, Download, Filter, Eye, MoreVertical, Ticket, Calendar, MapPin, User, Loader2, ArrowRight, UserCircle, Phone, CreditCard, X } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import api from '../../services/api';
import { formatPrice, formatDate, formatTime12h } from '../../utils/formatters';

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleExportCSV = () => {
    if (bookings.length === 0) return;
    
    const headers = ['Order ID', 'Date', 'Customer ID', 'Trip From', 'Trip To', 'Seats', 'Amount', 'Status'];
    const rows = bookings.map(b => [
      `BGO-${b.id}`,
      formatDate(b.booking_time),
      b.user_id,
      b.trip?.source,
      b.trip?.destination,
      b.seat_numbers,
      b.total_amount,
      b.status
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `bookings_export_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredBookings = bookings.filter(b => 
    b.id.toString().includes(searchTerm) ||
    b.trip?.source?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.trip?.destination?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.seat_numbers.includes(searchTerm)
  );

  return (
    <AdminLayout title="Global Bookings Ledger">
      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4 w-full lg:w-auto flex-1">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by ID, Source, Destination..." 
              className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary-500 shadow-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <button 
          onClick={handleExportCSV}
          className="w-full lg:w-auto flex items-center justify-center gap-2 bg-emerald-600 text-white px-8 py-3.5 rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/10 active:scale-95"
        >
          <Download className="w-5 h-5" /> Export as CSV
        </button>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-50 italic">
                <th className="px-8 py-6">Order Info</th>
                <th className="px-8 py-6">Journey</th>
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
              ) : filteredBookings.length === 0 ? (
                <tr><td colSpan="6" className="px-8 py-20 text-center text-slate-400 font-bold uppercase tracking-widest">No matching records found</td></tr>
              ) : filteredBookings.map((booking) => (
                <tr key={booking.id} className="group hover:bg-slate-50/50 transition-all duration-300">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors">
                        <Ticket className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-black text-slate-900 leading-none mb-1">Ref: BGO-{booking.id}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">User ID: {booking.user_id || 'Guest'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-sm font-black text-slate-700">
                       {booking.trip?.source} <ArrowRight className="w-3 h-3 text-slate-300" /> {booking.trip?.destination}
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
                    <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${booking.payment_status === 'paid' ? 'text-emerald-500' : 'text-rose-500'}`}>
                       {booking.payment_status}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <Badge variant={booking.status === 'booked' ? 'success' : 'danger'}>
                      {booking.status}
                    </Badge>
                  </td>
                  <td className="px-8 py-6 text-right">
                     <button 
                       onClick={() => { setSelectedBooking(booking); setIsModalOpen(true); }}
                       className="p-2.5 bg-slate-100 text-slate-500 rounded-xl lg:opacity-0 group-hover:opacity-100 hover:bg-primary-500 hover:text-white transition-all shadow-sm"
                     >
                        <Eye className="w-4 h-4" />
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Details Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setSelectedBooking(null); }}
        title="Administrative Ticket Review"
      >
        {selectedBooking && (
          <div className="space-y-8 py-4">
             {/* Header Info */}
             <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[24px] border border-slate-100 italic">
                <div>
                   <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Booking Ref</p>
                   <p className="text-xl font-black text-slate-900">BGO-{selectedBooking.id}</p>
                </div>
                <Badge variant={selectedBooking.status === 'booked' ? 'success' : 'danger'} size="lg">
                   {selectedBooking.status.toUpperCase()}
                </Badge>
             </div>

             {/* Journey Details */}
             <div className="grid grid-cols-2 gap-8">
                <div>
                   <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block">Journey Line</label>
                   <div className="flex items-center gap-3 font-black text-slate-900">
                      <span>{selectedBooking.trip?.source}</span>
                      <ArrowRight className="w-3 h-3 text-slate-300" />
                      <span>{selectedBooking.trip?.destination}</span>
                   </div>
                   <p className="text-xs text-slate-500 font-bold mt-1">{formatTime12h(selectedBooking.trip?.departure_time)} • {selectedBooking.trip?.bus?.category}</p>
                </div>
                <div>
                   <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block">Seating</label>
                   <div className="flex items-center gap-2">
                      {selectedBooking.seat_numbers.split(',').map(s => (
                         <div key={s} className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-black">{s}</div>
                      ))}
                   </div>
                </div>
             </div>

             {/* Boards/Drops */}
             <div className="p-6 border border-slate-100 rounded-[24px] bg-slate-50/50 space-y-4">
                <div className="flex items-center gap-4">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20" />
                   <div>
                      <p className="text-[10px] font-black uppercase text-slate-400">Boarding Point</p>
                      <p className="text-sm font-black text-slate-900">{selectedBooking.boarding_point || 'Primary Terminal'}</p>
                   </div>
                </div>
                <div className="w-[1px] h-4 bg-slate-200 ml-[3.5px]" />
                <div className="flex items-center gap-4">
                   <div className="w-2 h-2 rounded-full bg-rose-500 shadow-lg shadow-rose-500/20" />
                   <div>
                      <p className="text-[10px] font-black uppercase text-slate-400">Dropping Point</p>
                      <p className="text-sm font-black text-slate-900">{selectedBooking.dropping_point || 'Destination City'}</p>
                   </div>
                </div>
             </div>

             {/* Passenger Details */}
             <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3 block">Passenger Information</label>
                <div className="space-y-2">
                   {JSON.parse(selectedBooking.passenger_details || '[]').map((p, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:border-primary-200 transition-all">
                         <div className="flex items-center gap-3">
                            <UserCircle className="w-5 h-5 text-slate-400" />
                            <span className="text-sm font-bold text-slate-900">{p.name}</span>
                         </div>
                         <div className="flex gap-4">
                            <span className="text-xs font-black text-slate-400 uppercase">{p.gender}</span>
                            <span className="text-xs font-black text-slate-400">{p.age} Yrs</span>
                            <span className="text-xs font-black text-primary-500">{p.seatId}</span>
                         </div>
                      </div>
                   ))}
                </div>
             </div>

             {/* Financial Info */}
             <div className="flex items-center justify-between p-6 border-t border-slate-100 pt-8">
                <div className="flex items-center gap-3">
                   <CreditCard className="w-5 h-5 text-slate-400" />
                   <div>
                      <p className="text-[10px] font-black uppercase text-slate-400">Total Charged</p>
                      <p className="text-xl font-black text-slate-900">{formatPrice(selectedBooking.total_amount)}</p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Payment Status</p>
                   <Badge variant={selectedBooking.payment_status === 'paid' ? 'success' : 'danger'}>
                      {selectedBooking.payment_status.toUpperCase()}
                   </Badge>
                </div>
             </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
};

export default AllBookings;
