import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import AdminTable from '../../../components/admin/shared/AdminTable';
import Modal from '../../../components/ui/Modal';
import { Plus, Pencil, Trash2, Calendar, Bus, Route as RouteIcon, Search, ArrowRight, Clock } from 'lucide-react';
import Badge from '../../../components/ui/Badge';
import TripForm from '../../../components/admin/modules/trips/TripForm';
import { useAdminStore } from '../../../store/useAdminStore';
import { toast } from 'react-hot-toast';
import { formatTime12h, formatPrice, formatDate } from '../../../utils/formatters';

/**
 * TripList Page - Manages scheduled Trip Instances (Local State Version).
 */
const TripList = () => {
  const { trips, routes, buses, addTrip, updateTrip, deleteTrip } = useAdminStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = () => {
    setSelectedTrip(null);
    setModalOpen(true);
  };

  const handleEdit = (trip) => {
    setSelectedTrip(trip);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Cancel this trip?")) return;
    deleteTrip(id);
    toast.success("Trip schedule removed");
  };

  const handleSave = async (payload) => {
    setIsSubmitting(true);
    setTimeout(() => {
      if (selectedTrip) {
        updateTrip(selectedTrip.id, payload);
        toast.success("Schedule adjusted");
      } else {
        addTrip(payload);
        toast.success("Trip launched successfully (local)");
      }
      setModalOpen(false);
      setIsSubmitting(false);
    }, 450);
  };

  const filteredTrips = trips.filter(t => 
    t.source.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.bus?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      header: 'Schedule Details',
      render: (row) => (
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-900/10">
              <Calendar className="w-6 h-6" />
           </div>
           <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded tracking-widest">#{row.id}</span>
                <p className="text-sm font-black text-slate-800 leading-none">{formatDate(row.departure_time)}</p>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                 <Clock className="w-2.5 h-2.5" /> {formatTime12h(row.departure_time)} Departure
              </p>
           </div>
        </div>
      )
    },
    {
      header: 'Route & Assignment',
      render: (row) => (
        <div className="space-y-2">
           <div className="flex items-center gap-2 text-xs font-black text-slate-900">
              {row.source} <ArrowRight className="w-3 h-3 text-primary-500" /> {row.destination}
           </div>
           <div className="flex items-center gap-2">
              <Bus className="w-3 h-3 text-slate-400" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{row.bus?.name}</span>
           </div>
        </div>
      )
    },
    {
      header: 'Ticketing',
      align: 'center',
      render: (row) => (
        <div className="flex flex-col items-center">
           <p className="text-sm font-black text-primary-600">{formatPrice(row.price)}</p>
           <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Base Fare</p>
        </div>
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
    <AdminLayout title="Trip Scheduler">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
         <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by city or vehicle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-[2rem] py-4 pl-12 pr-6 text-sm font-bold focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all outline-none"
            />
         </div>
         <button 
           onClick={handleCreate}
           className="w-full md:w-auto px-8 py-4 bg-primary-500 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-primary-500/20 hover:bg-primary-600 transition-all hover:scale-105 active:scale-95"
         >
           <Plus className="w-5 h-5 text-white" /> Schedule New Trip
         </button>
      </div>

      <AdminTable 
        columns={columns} 
        data={filteredTrips} 
        loading={isSubmitting} 
        emptyMessage="No trips scheduled for the selected period."
      />

      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)}
        title={selectedTrip ? "Modify Trip Schedule" : "Launch New Trip Instance"}
      >
        <TripForm 
          routes={routes}
          buses={buses}
          initialData={selectedTrip} 
          isEditing={!!selectedTrip}
          onSave={handleSave}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </AdminLayout>
  );
};

export default TripList;
