import React, { useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import AdminTable from '../../../components/admin/shared/AdminTable';
import Modal from '../../../components/ui/Modal';
import { Plus, Pencil, Trash2, MapPin, Route as RouteIcon, Search } from 'lucide-react';
import Badge from '../../../components/ui/Badge';
import RouteForm from '../../../components/admin/modules/routes/RouteForm';
import { useAdminStore } from '../../../store/useAdminStore';
import { toast } from 'react-hot-toast';

/**
 * RouteList Page - Manages Route Templates (Local State Version).
 */
const RouteList = () => {
  const { routes, addRoute, updateRoute, deleteRoute } = useAdminStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = () => {
    setSelectedRoute(null);
    setModalOpen(true);
  };

  const handleEdit = (route) => {
    setSelectedRoute(route);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this template? Proceed?")) return;
    deleteRoute(id);
    toast.success("Route template removed");
  };

  const handleSave = async (data) => {
    setIsSubmitting(true);
    // Mimic slight Latency for Premium feel
    setTimeout(() => {
      if (selectedRoute) {
        updateRoute(selectedRoute.id, data);
        toast.success("Template updated");
      } else {
        addRoute(data);
        toast.success("Route template created locally");
      }
      setModalOpen(false);
      setIsSubmitting(false);
    }, 400);
  };

  const filteredRoutes = routes.filter(r => 
    r.source.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      header: 'Route Identity',
      render: (row) => (
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-500 shadow-sm border border-primary-100">
              <RouteIcon className="w-6 h-6" />
           </div>
           <div>
              <p className="text-sm font-black text-slate-800 leading-none mb-1.5">{row.name || `${row.source} to ${row.destination}`}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                 <MapPin className="w-2.5 h-2.5" /> ID: Template-{row.id}
              </p>
           </div>
        </div>
      )
    },
    {
      header: 'Direction',
      render: (row) => (
        <div className="flex items-center gap-3">
           <span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-700">{row.source}</span>
           <span className="text-slate-300">→</span>
           <span className="px-3 py-1 bg-slate-900 rounded-lg text-xs font-bold text-white">{row.destination}</span>
        </div>
      )
    },
    {
      header: 'Stops',
      align: 'center',
      render: (row) => (
        <Badge variant={row.stops?.length > 0 ? 'info' : 'default'} size="sm" className="font-black">
          {row.stops?.length || 0} Boarding Points
        </Badge>
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
    <AdminLayout title="Network Management">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
         <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Filter by city or route name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-[2rem] py-4 pl-12 pr-6 text-sm font-bold focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all outline-none"
            />
         </div>
         <button 
           onClick={handleCreate}
           className="w-full md:w-auto px-8 py-4 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-slate-900/10 hover:bg-primary-600 transition-all hover:scale-105 active:scale-95"
         >
           <Plus className="w-5 h-5" /> New Route Template
         </button>
      </div>

      <AdminTable 
        columns={columns} 
        data={filteredRoutes} 
        loading={isSubmitting} 
        emptyMessage="No routes defined in your network yet."
      />

      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)}
        title={selectedRoute ? "Modify Route Template" : "Establish New Route"}
      >
        <RouteForm 
          initialData={selectedRoute} 
          isEditing={!!selectedRoute}
          isSubmitting={isSubmitting}
          onSave={handleSave}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </AdminLayout>
  );
};

export default RouteList;
