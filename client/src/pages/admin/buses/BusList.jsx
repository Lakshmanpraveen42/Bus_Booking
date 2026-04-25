import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import AdminTable from '../../../components/admin/shared/AdminTable';
import Modal from '../../../components/ui/Modal';
import { Plus, Pencil, Trash2, Bus as BusIcon, Search, ShieldCheck, Activity } from 'lucide-react';
import Badge from '../../../components/ui/Badge';
import BusForm from '../../../components/admin/modules/buses/BusForm';
import { useAdminStore } from '../../../store/useAdminStore';
import { toast } from 'react-hot-toast';

/**
 * BusList Page - Fleet Manager (Local State Version).
 */
const BusList = () => {
  const { buses, addBus, updateBus, deleteBus } = useAdminStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = () => {
    setSelectedBus(null);
    setModalOpen(true);
  };

  const handleEdit = (bus) => {
    setSelectedBus(bus);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently remove this vehicle?")) return;
    deleteBus(id);
    toast.success("Vehicle removed from fleet");
  };

  const handleSave = async (data) => {
    setIsSubmitting(true);
    setTimeout(() => {
      if (selectedBus) {
        updateBus(selectedBus.id, data);
        toast.success("Vehicle specs updated");
      } else {
        addBus(data);
        toast.success("New asset registered locally");
      }
      setModalOpen(false);
      setIsSubmitting(false);
    }, 400);
  };

  const filteredBuses = buses.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.vehicle_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
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
         <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or plate number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-[2rem] py-4 pl-12 pr-6 text-sm font-bold focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all outline-none"
            />
         </div>
         <button 
           onClick={handleCreate}
           className="w-full md:w-auto px-8 py-4 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-slate-900/10 hover:bg-primary-500 transition-all hover:scale-105 active:scale-95"
         >
           <Plus className="w-5 h-5" /> Register New Vehicle
         </button>
      </div>

      <AdminTable 
        columns={columns} 
        data={filteredBuses} 
        loading={isSubmitting} 
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
