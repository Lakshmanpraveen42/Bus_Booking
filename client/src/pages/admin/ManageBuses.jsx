import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Bus, Plus, Search, Filter, Pencil, Trash2, ShieldCheck, Zap } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import api from '../../services/api';

const ManageBuses = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBus, setNewBus] = useState({
    name: '',
    category: 'Delux',
    vehicle_number: '',
    total_seats: 40
  });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBusId, setSelectedBusId] = useState(null);

  const fetchBuses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/buses');
      setBuses(res.data);
    } catch (err) {
      console.error('Failed to fetch buses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  const handleAddBus = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/admin/buses/${selectedBusId}`, newBus);
      } else {
        await api.post('/admin/buses', newBus);
      }
      setIsModalOpen(false);
      resetForm();
      fetchBuses();
    } catch (err) {
      alert(err.response?.data?.detail || 'Operation failed');
    }
  };

  const handleDeleteBus = async (id) => {
    if (!window.confirm('Are you sure you want to remove this vehicle from fleet?')) return;
    try {
      await api.delete(`/admin/buses/${id}`);
      fetchBuses();
    } catch (err) {
      alert('Failed to delete bus');
    }
  };

  const openEditModal = (bus) => {
    setNewBus({
      name: bus.name,
      category: bus.category,
      vehicle_number: bus.vehicle_number,
      total_seats: bus.total_seats
    });
    setSelectedBusId(bus.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setNewBus({ name: '', category: 'Delux', vehicle_number: '', total_seats: 40 });
    setIsEditing(false);
    setSelectedBusId(null);
  };

  return (
    <AdminLayout title="Fleet Management">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by bus name or number..." 
              className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary-500 transition-all shadow-sm"
            />
          </div>
        </div>
        
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black hover:bg-primary-500 transition-all shadow-xl shadow-slate-900/10 hover:scale-105 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Add New Bus
        </button>
      </div>

      {/* Fleet Table */}
      <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-xs font-black uppercase tracking-widest border-b border-slate-50">
                <th className="px-8 py-6">Bus Detail</th>
                <th className="px-8 py-6">Vehicle Number</th>
                <th className="px-8 py-6">Type</th>
                <th className="px-8 py-6">Seats</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="5" className="px-8 py-10 text-center text-slate-400 font-bold uppercase tracking-widest">Loading fleet...</td></tr>
              ) : buses.length === 0 ? (
                <tr><td colSpan="5" className="px-8 py-10 text-center text-slate-400 font-bold uppercase tracking-widest">No vehicles registered</td></tr>
              ) : buses.map((bus) => (
                <tr key={bus.id} className="group hover:bg-slate-50/50 transition-all duration-300">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors">
                        <Bus className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-black text-slate-900 leading-none mb-1">{bus.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID: {bus.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg text-sm">{bus.vehicle_number}</span>
                  </td>
                  <td className="px-8 py-6 text-sm text-slate-600 font-medium lowercase first-letter:uppercase">
                    {bus.category}
                  </td>
                  <td className="px-8 py-6 font-bold text-slate-900">
                    {bus.total_seats}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openEditModal(bus)}
                        className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-primary-500 hover:text-white transition-all"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteBus(bus.id)}
                        className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Bus Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); resetForm(); }}
        title={isEditing ? "Update Vehicle Details" : "Register New Vehicle"}
      >
        <form onSubmit={handleAddBus} className="space-y-6">
          <Input 
            label="Bus / Operator Name"
            placeholder="e.g. Greenline Volvo"
            value={newBus.name}
            onChange={(e) => setNewBus({...newBus, name: e.target.value})}
            required
          />
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Category</label>
                <select 
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-primary-500 rounded-2xl p-4 text-sm font-bold focus:outline-none transition-all"
                  value={newBus.category}
                  onChange={(e) => setNewBus({...newBus, category: e.target.value})}
                >
                  <option value="Delux">Delux (2+2)</option>
                  <option value="Rajadhani">Rajadhani (2+1)</option>
                  <option value="Luxury">Luxury Sleeper</option>
                </select>
             </div>
             <Input 
                label="Total Seats"
                type="number"
                value={newBus.total_seats}
                onChange={(e) => setNewBus({...newBus, total_seats: parseInt(e.target.value)})}
                required
             />
          </div>
          <Input 
            label="Vehicle Number"
            placeholder="KA 01 XY 1234"
            value={newBus.vehicle_number}
            onChange={(e) => setNewBus({...newBus, vehicle_number: e.target.value})}
            required
          />
          
          <Button fullWidth size="xl" shadow type="submit">
            {isEditing ? "Save Changes" : "Confirm Registration"}
          </Button>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default ManageBuses;
