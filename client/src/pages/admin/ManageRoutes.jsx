import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { MapPin, Plus, List, Calendar, Clock, ArrowRight, Table, Settings2, Trash2, Bus, Pencil, LayoutGrid } from 'lucide-react';
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
    bus_id: '',
    stops: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState(null);
  const [viewMode, setViewMode] = useState('grid');


  const addStop = () => {
    setFormData({
      ...formData,
      stops: [...formData.stops, { location: '', arrival_time: '', order: formData.stops.length + 1 }]
    });
  };

  const removeStop = (index) => {
    const newStops = formData.stops.filter((_, i) => i !== index).map((s, i) => ({ ...s, order: i + 1 }));
    setFormData({ ...formData, stops: newStops });
  };

  const updateStop = (index, field, value) => {
    const newStops = [...formData.stops];
    newStops[index][field] = value;
    setFormData({ ...formData, stops: newStops });
  };


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
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        bus_id: parseInt(formData.bus_id)
      };

      if (isEditing) {
        await api.put(`/admin/trips/${selectedTripId}`, payload);
      } else {
        await api.post('/admin/trips', payload);
      }
      
      setIsModalOpen(false);
      resetForm();
      fetchData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Operation failed');
    }
  };

  const handleDeleteRoute = async (id) => {
    if (!window.confirm('Are you sure you want to delete this route? This will also remove all intermediate stops.')) return;
    try {
      await api.delete(`/admin/trips/${id}`);
      fetchData();
    } catch (err) {
      alert('Failed to delete route');
    }
  };

  const openEditModal = (trip) => {
    setFormData({
      source: trip.source,
      destination: trip.destination,
      departure_time: trip.departure_time.split('.')[0], // Format for datetime-local
      arrival_time: trip.arrival_time.split('.')[0],
      price: trip.price,
      bus_id: trip.bus_id,
      stops: trip.stops || []
    });
    setSelectedTripId(trip.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({ source: '', destination: '', departure_time: '', arrival_time: '', price: '', bus_id: '', stops: [] });
    setIsEditing(false);
    setSelectedTripId(null);
  };

  return (
    <AdminLayout title="Route Scheduler">
      {/* Main Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 lg:mb-10">
         <button 
           onClick={() => setIsModalOpen(true)}
           className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 lg:px-8 py-3 lg:py-3.5 bg-slate-900 rounded-2xl text-white font-black text-sm shadow-xl shadow-slate-900/10 hover:bg-primary-500 transition-all hover:scale-105 active:scale-95"
         >
            <Plus className="w-5 h-5" /> Add New Route
         </button>

         <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-end sm:self-auto">
            <button 
               onClick={() => setViewMode('grid')}
               className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white text-primary-500 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
            >
               <LayoutGrid className="w-5 h-5" />
            </button>
            <button 
               onClick={() => setViewMode('list')}
               className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white text-primary-500 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
            >
               <List className="w-5 h-5" />
            </button>
         </div>
      </div>

      {/* Content Rendering */}
      {loading ? (
        <p className="text-slate-400 font-bold uppercase tracking-widest text-center py-20">Syncing with schedule...</p>
      ) : trips.length === 0 ? (
        <p className="text-slate-400 font-bold uppercase tracking-widest text-center py-20">No active routes found</p>
      ) : viewMode === 'grid' ? (
        /* Routes Grid View */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {trips.map((trip) => (
             <div key={trip.id} className="group relative bg-white rounded-[32px] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-8">
                   <div className="bg-white px-4 py-2 rounded-xl border border-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 shadow-sm">
                      TRIP-{trip.id}
                   </div>
                   <Badge variant="success">
                      {trip.bus?.category}
                   </Badge>
                </div>
  
                <div className="flex items-center gap-4 lg:gap-6 mb-8 relative z-10">
                   <div className="flex-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">From</p>
                      <p className="text-lg lg:text-xl font-black text-slate-900">{trip.source}</p>
                   </div>
                   <div className="w-10 h-10 lg:w-12 lg:h-12 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 group-hover:bg-primary-50 group-hover:text-primary-500 transition-all">
                      <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform" />
                   </div>
                   <div className="flex-1 text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">To</p>
                      <p className="text-lg lg:text-xl font-black text-slate-900">{trip.destination}</p>
                   </div>
                </div>
  
                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-50 relative z-10">
                   <div>
                      <p className="text-[10px] font-black text-slate-300 uppercase mb-1">Departure</p>
                      <p className="font-bold text-slate-700 text-xs lg:text-sm">{formatTime12h(trip.departure_time)}</p>
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-slate-300 uppercase mb-1">Route Info</p>
                      <div className="flex items-center gap-1 text-primary-500 font-bold text-xs lg:text-sm">
                        <List className="w-3 link:h-3" />
                        {trip.stops?.length || 0} Stops
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-black text-slate-300 uppercase mb-1">Price</p>
                      <p className="font-black text-primary-500 text-xs lg:text-sm">{formatPrice(trip.price)}</p>
                   </div>
                </div>
                
                 {/* Action Buttons */}
                 <div className="absolute top-8 left-32 flex gap-2 lg:opacity-0 group-hover:opacity-100 transition-all duration-300 z-50">
                    <button 
                      onClick={() => openEditModal(trip)}
                      className="p-2 bg-white text-slate-600 rounded-lg border border-slate-100 hover:bg-primary-500 hover:text-white transition-all shadow-sm"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteRoute(trip.id)}
                      className="p-2 bg-white text-rose-500 rounded-lg border border-slate-100 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                 </div>
             </div>
           ))}
        </div>
      ) : (
        /* Routes List/Table View */
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl overflow-hidden">
           <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[700px] lg:min-w-0">
                 <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                       <th className="px-6 lg:px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest italic">ID</th>
                       <th className="px-6 lg:px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest italic">Route</th>
                       <th className="px-6 lg:px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest italic">Bus Type</th>
                       <th className="px-6 lg:px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest italic">Departure</th>
                       <th className="px-6 lg:px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest italic text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {trips.map(trip => (
                       <tr key={trip.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 lg:px-8 py-5 text-xs font-bold text-slate-400">#{trip.id}</td>
                          <td className="px-6 lg:px-8 py-5">
                             <div className="flex items-center gap-2 lg:gap-3">
                                <span className="font-black text-sm lg:text-base text-slate-900">{trip.source}</span>
                                <ArrowRight className="w-3 h-3 text-slate-300" />
                                <span className="font-black text-sm lg:text-base text-slate-900">{trip.destination}</span>
                             </div>
                             <p className="text-[10px] font-bold text-emerald-500 uppercase mt-1 tracking-wider">{trip.stops?.length || 0} Boarding Points</p>
                          </td>
                          <td className="px-6 lg:px-8 py-5">
                             <Badge variant="success" size="sm" className="whitespace-nowrap">{trip.bus?.category}</Badge>
                          </td>
                          <td className="px-6 lg:px-8 py-5 text-sm font-bold text-slate-700">
                             {formatTime12h(trip.departure_time)}
                          </td>
                          <td className="px-6 lg:px-8 py-5 text-right">
                             <div className="flex items-center justify-end gap-2 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => openEditModal(trip)} className="p-2 text-slate-400 hover:text-primary-500"><Pencil className="w-4 h-4" /></button>
                                <button onClick={() => handleDeleteRoute(trip.id)} className="p-2 text-slate-400 hover:text-rose-500"><Trash2 className="w-4 h-4" /></button>
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}
      {/* Add Route Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); resetForm(); }}
        title={isEditing ? "Update Route Schedule" : "Schedule New Route"}
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

          {/* Stops Section */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest">Route Line (Boarding Points)</h3>
              <button 
                type="button"
                onClick={addStop}
                className="text-xs font-black text-primary-500 hover:text-primary-600 flex items-center gap-1 bg-primary-50 px-3 py-1.5 rounded-lg transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Add Stop
              </button>
            </div>
            
            <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
              {formData.stops.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 uppercase font-bold tracking-widest">No intermediate stops added</p>
              ) : formData.stops.map((stop, index) => (
                <div key={index} className="flex gap-3 items-end bg-slate-50 p-4 rounded-2xl border border-slate-100 relative group animate-in slide-in-from-right-4 duration-300">
                  <div className="flex-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Stop {index + 1} Name</label>
                    <input 
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold"
                      value={stop.location}
                      onChange={(e) => updateStop(index, 'location', e.target.value)}
                      placeholder="City/Stop Name"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Arrival Time</label>
                    <input 
                      type="datetime-local"
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold"
                      value={stop.arrival_time}
                      onChange={(e) => updateStop(index, 'arrival_time', e.target.value)}
                      required
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={() => removeStop(index)}
                    className="p-2 text-rose-500 hover:bg-rose-100 rounded-lg transition-colors shadow-sm bg-white"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <Button fullWidth size="xl" shadow type="submit">
            {isEditing ? "Save Changes" : "Launch Route"}
          </Button>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default ManageRoutes;
