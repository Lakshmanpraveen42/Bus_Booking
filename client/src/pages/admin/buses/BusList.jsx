import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import AdminTable from '../../../components/admin/shared/AdminTable';
import Modal from '../../../components/ui/Modal';
import { Plus, Pencil, Trash2, Bus as BusIcon, Search, ShieldCheck, Activity } from 'lucide-react';
import Badge from '../../../components/ui/Badge';
import BusForm from '../../../components/admin/modules/buses/BusForm';
import { useAdminStore } from '../../../store/useAdminStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { adminService } from '../../../services/adminService';
import { toast } from 'react-hot-toast';

/**
 * BusList Page - Fleet Manager (Local State Version).
 */
const BusList = () => {
  const { buses, setBuses, addBus, updateBus, deleteBus } = useAdminStore();
  const { user } = useAuthStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedBuses, setSelectedBuses] = useState([]);

  useEffect(() => {
    const fetchBuses = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const data = await adminService.getBuses(user.id);
        
        // Map backend fields to frontend store format
        const mappedBuses = data.map(bus => ({
          id: bus.bus_id || bus.id,
          name: bus.bus_name,
          vehicle_number: bus.bus_number,
          category: bus.type,
          total_seats: bus.capacity,
          status: 'active' // Backend doesn't provide status yet, defaulting to active
        }));
        
        setBuses(mappedBuses);
      } catch (err) {
        console.error("Failed to load buses from API:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, [user?.id, setBuses]);

  const handleCreate = () => {
    setSelectedBus(null);
    setModalOpen(true);
  };

  const handleEdit = (bus) => {
    setSelectedBus(bus);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently remove this vehicle from the fleet?")) return;
    
    try {
      setIsSubmitting(true);
      const response = await adminService.deleteBus(id, user?.id || "SB_ADMIN_6549");
      deleteBus(id);
      toast.success(response.message || "Vehicle removed from fleet");
    } catch (err) {
      console.error("Failed to delete bus:", err);
      toast.error(err.response?.data?.message || err.response?.data?.detail || "Failed to remove vehicle. It might be assigned to active trips.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        user_id: user?.id || "SB_ADMIN_6549",
        bus_number: data.vehicle_number,
        bus_name: data.name,
        type: data.category,
        capacity: data.total_seats
      };

      if (selectedBus) {
        // Update logic using actual API
        const response = await adminService.updateBus(selectedBus.id, payload);
        updateBus(selectedBus.id, data);
        toast.success(response.message || "Vehicle specs updated successfully");
      } else {
        // Add logic using actual API
        const response = await adminService.addBus(payload);
        
        // Add to local store with the returned ID
        addBus({ 
          ...data, 
          id: response?.bus_id || response?.id || Date.now(),
          status: 'active' // Default for new buses
        });
        
        toast.success(response?.message || "New asset registered successfully");
      }
      setModalOpen(false);
    } catch (err) {
      console.error("Failed to save bus:", err);
      toast.error(err?.response?.data?.message || err?.response?.data?.detail || err.message || "Operation failed. Please check connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectBus = (id) => {
    setSelectedBuses(prev => 
      prev.includes(id) ? prev.filter(bId => bId !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Permanently remove ${selectedBuses.length} vehicles from the fleet?`)) return;
    
    try {
      setIsSubmitting(true);
      await Promise.all(selectedBuses.map(id => adminService.deleteBus(id, user?.id || "SB_ADMIN_6549")));
      
      selectedBuses.forEach(id => deleteBus(id));
      setSelectedBuses([]);
      toast.success(`${selectedBuses.length} vehicles removed from fleet`);
    } catch (err) {
      console.error("Failed to delete buses:", err);
      toast.error("Failed to remove some vehicles. They might be assigned to active trips.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [sortBy, setSortBy] = useState('name-asc');

  const filteredBuses = buses.filter(b => 
    (b.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    (b.vehicle_number || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [sortField, sortDirection] = sortBy.split('-');
  const sortedBuses = [...filteredBuses].sort((a, b) => {
    let aValue = a[sortField] || '';
    let bValue = b[sortField] || '';

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = typeof bValue === 'string' ? bValue.toLowerCase() : bValue;
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedBuses(sortedBuses.map(b => b.id));
    } else {
      setSelectedBuses([]);
    }
  };

  const columns = [
    {
      header: (
        <input 
          type="checkbox" 
          className="w-4 h-4 rounded text-primary-500 focus:ring-primary-500 cursor-pointer"
          checked={sortedBuses.length > 0 && selectedBuses.length === sortedBuses.length}
          onChange={handleSelectAll}
        />
      ),
      render: (row) => (
        <input 
          type="checkbox" 
          className="w-4 h-4 rounded text-primary-500 focus:ring-primary-500 cursor-pointer"
          checked={selectedBuses.includes(row.id)}
          onChange={() => handleSelectBus(row.id)}
        />
      )
    },
    {
      header: 'Vehicle Identity',
      render: (row) => (
        <div className="flex items-center gap-4">
           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm border ${row.status === 'active' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
              <BusIcon className="w-6 h-6" />
           </div>
           <div>
              <p className="text-sm font-black text-slate-800 leading-none mb-1.5">{row.name}</p>
              <div className="flex items-center gap-2">
                 <Badge size="xs" variant={row.status === 'active' ? 'success' : 'default'} className="uppercase font-black px-2">
                    {row.status}
                 </Badge>
                 <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID: {row.id}</span>
              </div>
           </div>
        </div>
      )
    },
    {
       header: 'Specifications',
       render: (row) => (
         <div className="space-y-1">
            <p className="text-xs font-black text-slate-700">{row.category}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{row.total_seats} Passenger Capacity</p>
         </div>
       )
    },
    {
      header: 'Registration',
      render: (row) => (
        <span className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-[10px] font-black tracking-widest uppercase italic">
          {row.vehicle_number}
        </span>
      )
    },
    {
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2 pr-2">
           <button 
             onClick={() => handleEdit(row)}
             className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:bg-primary-500 hover:text-white transition-all flex items-center justify-center"
           >
             <Pencil className="w-4 h-4" />
           </button>
           <button 
             onClick={() => handleDelete(row.id)}
             className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center"
           >
             <Trash2 className="w-4 h-4" />
           </button>
        </div>
      )
    }
  ];

  return (
    <AdminLayout title="Fleet Management">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
         <div className="flex flex-col md:flex-row items-center gap-4 flex-1 max-w-2xl w-full">
           <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by name or plate number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-[2rem] py-4 pl-12 pr-6 text-sm font-bold focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all outline-none"
              />
           </div>
           
           <div className="relative shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-slate-200 rounded-[2rem] py-4 pl-6 pr-12 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all outline-none cursor-pointer"
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="vehicle_number-asc">Plate (A-Z)</option>
                <option value="vehicle_number-desc">Plate (Z-A)</option>
                <option value="total_seats-asc">Capacity (Low to High)</option>
                <option value="total_seats-desc">Capacity (High to Low)</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
           </div>
         </div>

         <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
           {selectedBuses.length > 0 && (
             <button 
               onClick={handleBulkDelete}
               className="w-full md:w-auto px-6 py-4 bg-rose-50 text-rose-500 rounded-[2rem] font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
             >
               <Trash2 className="w-4 h-4" /> Delete ({selectedBuses.length})
             </button>
           )}
           <button 
             onClick={handleCreate}
             className="w-full md:w-auto px-8 py-4 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-slate-900/10 hover:bg-primary-500 transition-all hover:scale-105 active:scale-95"
           >
             <Plus className="w-5 h-5" /> Register New Vehicle
           </button>
         </div>
      </div>

      <AdminTable 
        columns={columns} 
        data={sortedBuses} 
        loading={loading || isSubmitting} 
        emptyMessage="No vehicles registered in your fleet yet."
      />

      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)}
        title={selectedBus ? "Modify Vehicle Specs" : "Enroll New Asset"}
      >
        <BusForm 
          initialData={selectedBus} 
          isEditing={!!selectedBus}
          onSave={handleSave}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </AdminLayout>
  );
};

export default BusList;
