import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { MapPin, Plus, List, Calendar, Clock, ArrowRight, Table, Settings2, Trash2, Bus } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import api from '../../services/api';
import { formatPrice, formatTime12h } from '../../utils/formatters';

const ManageRoutes = () => {
  const [trips, setTrips] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    departure_time: '',
    arrival_time: '',
    price: '',
    bus_id: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tripsRes, busesRes] = await Promise.all([
        api.get('/admin/trips'),
        api.get('/admin/buses')
      ]);
      setTrips(tripsRes.data);
      setBuses(busesRes.data);
    } catch (err) {
      console.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddRoute = async (e) => {
    e.preventDefault();
    try {
      // Backend expects ISO strings
      await api.post('/admin/trips', {
        ...formData,
        price: parseFloat(formData.price),
        bus_id: parseInt(formData.bus_id)
      });
      setIsModalOpen(false);
      setFormData({ source: '', destination: '', departure_time: '', arrival_time: '', price: '', bus_id: '' });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to add route');
    }
  };

  return (
    <AdminLayout title="Route Scheduler">
      {/* Main Action Bar */}
      <div className="flex items-center justify-between mb-10">
         <div className="flex gap-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-8 py-3.5 bg-slate-900 rounded-2xl text-white font-black text-sm shadow-xl shadow-slate-900/10 hover:bg-primary-500 transition-all hover:scale-105 active:scale-95"
            >
               <Plus className="w-5 h-5" /> Add New Route
            </button>
         </div>
      </div>

      {/* Routes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {loading ? (
           <p className="text-slate-400 font-bold uppercase tracking-widest text-center py-20 col-span-2">Syncing with schedule...</p>
         ) : trips.length === 0 ? (
           <p className="text-slate-400 font-bold uppercase tracking-widest text-center py-20 col-span-2">No active routes found</p>
         ) : trips.map((trip) => (
           <div key={trip.id} className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm group hover:border-primary-500/20 transition-all duration-500 relative overflow-hidden">
              <div className="flex justify-between items-start mb-8 relative z-10">
                 <div className="bg-white px-4 py-2 rounded-xl border border-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 shadow-sm">
                    TRIP-{trip.id}
                 </div>
                 <Badge variant="success">
                    {trip.bus?.category}
                 </Badge>
              </div>

              <div className="flex items-center gap-6 mb-8 relative z-10">
                 <div className="flex-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">From</p>
                    <p className="text-xl font-black text-slate-900">{trip.source}</p>
                 </div>
                 <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 group-hover:bg-primary-50 group-hover:text-primary-500 transition-all">
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                 </div>
                 <div className="flex-1 text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">To</p>
                    <p className="text-xl font-black text-slate-900">{trip.destination}</p>
                 </div>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-50 relative z-10">
                 <div>
                    <p className="text-[10px] font-black text-slate-300 uppercase mb-1">Departure</p>
                    <p className="font-bold text-slate-700 text-sm">{formatTime12h(trip.departure_time)}</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-slate-300 uppercase mb-1">Vehicle</p>
                    <p className="font-bold text-slate-700 text-sm">{trip.bus?.name}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-black text-slate-300 uppercase mb-1">Price</p>
                    <p className="font-black text-primary-500 text-sm">{formatPrice(trip.price)}</p>
                 </div>
              </div>
              
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
           </div>
         ))}
      </div>

      {/* Add Route Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Schedule New Route"
      >
        <form onSubmit={handleAddRoute} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Source City"
              placeholder="e.g. Bangalore"
              value={formData.source}
              onChange={(e) => setFormData({...formData, source: e.target.value})}
              required
            />
            <Input 
              label="Destination City"
              placeholder="e.g. Hyderabad"
              value={formData.destination}
              onChange={(e) => setFormData({...formData, destination: e.target.value})}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Departure Time"
              type="datetime-local"
              value={formData.departure_time}
              onChange={(e) => setFormData({...formData, departure_time: e.target.value})}
              required
            />
            <Input 
              label="Arrival Time"
              type="datetime-local"
              value={formData.arrival_time}
              onChange={(e) => setFormData({...formData, arrival_time: e.target.value})}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Assign Bus</label>
                <select 
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-primary-500 rounded-2xl p-4 text-sm font-bold focus:outline-none transition-all"
                  value={formData.bus_id}
                  onChange={(e) => setFormData({...formData, bus_id: e.target.value})}
                  required
                >
                  <option value="">Select Vehicle...</option>
                  {buses.map(bus => (
                    <option key={bus.id} value={bus.id}>{bus.name} ({bus.vehicle_number})</option>
                  ))}
                </select>
             </div>
             <Input 
                label="Ticket Price"
                type="number"
                placeholder="₹"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
             />
          </div>
          
          <Button fullWidth size="xl" shadow type="submit">
            Launch Route
          </Button>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default ManageRoutes;
