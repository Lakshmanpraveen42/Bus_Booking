import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import AdminTable from '../../../components/admin/shared/AdminTable';
import Modal from '../../../components/ui/Modal';
import { Plus, Pencil, Trash2, Calendar, Bus, Route as RouteIcon, Search, ArrowRight, Clock } from 'lucide-react';
import Badge from '../../../components/ui/Badge';
import TripForm from '../../../components/admin/modules/trips/TripForm';
import { useAdminStore } from '../../../store/useAdminStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { adminService } from '../../../services/adminService';
import { toast } from 'react-hot-toast';
import { formatTime12h, formatPrice, formatDate } from '../../../utils/formatters';

/**
 * TripList Page - Manages scheduled Trip Instances (Local State Version).
 */
const TripList = () => {
  const { trips, setTrips, routes, buses, addTrip, updateTrip, deleteTrip } = useAdminStore();
  const { user } = useAuthStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTrips = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const data = await adminService.getTrips(user.id);
        
        // Map backend fields to frontend store format
        // This assumes the backend returns detailed trip objects
        const mappedTrips = data.map(trip => ({
          id: trip.trip_id || trip.id,
          source: trip.source,
          destination: trip.destination,
          departure_time: trip.departure_time,
          arrival_time: trip.arrival_time,
          price: trip.price,
          route_id: trip.route_id,
          bus_id: trip.bus_id,
          routing_points: Array.isArray(trip.routing_points) ? trip.routing_points.join(', ') : (trip.routing_points || ''),
          bus: trip.bus || { 
            name: trip.bus_name || 'N/A', 
            vehicle_number: trip.bus_number || 'N/A' 
          }
        }));
        
        setTrips(mappedTrips);
      } catch (err) {
        console.error("Failed to load trips from API:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [user?.id, setTrips]);

  const handleCreate = () => {
    setSelectedTrip(null);
    setModalOpen(true);
  };

  const handleEdit = (trip) => {
    setSelectedTrip(trip);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently cancel this trip schedule?")) return;
    
    try {
      setIsSubmitting(true);
      const response = await adminService.deleteTrip(id, user?.id || "SB_ADMIN_6549");
      deleteTrip(id);
      toast.success(response.message || "Trip schedule removed");
    } catch (err) {
      console.error("Failed to cancel trip:", err);
      toast.error(err.response?.data?.message || err.response?.data?.detail || "Failed to remove trip. It might have active bookings.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = async (data) => {
    setIsSubmitting(true);
    try {
      const bus = buses.find(b => b.id === parseInt(data.bus_id));

      if (!bus) {
        toast.error("Critical: Invalid vehicle selection");
        return;
      }

      // Convert routing_points string to array if it's a string (from form)
      const routing_points = typeof data.routing_points === 'string'
        ? data.routing_points.split(',').map(s => s.trim()).filter(s => s)
        : (data.routing_points || []);

      const payload = {
        user_id: user?.id || "SB_ADMIN_6549",
        bus_id: parseInt(data.bus_id),
        source: data.source,
        destination: data.destination,
        departure_time: data.departure_time,
        arrival_time: data.arrival_time,
        price: parseFloat(data.price),
        routing_points: routing_points
      };

      if (selectedTrip) {
        // Update logic using actual API
        const response = await adminService.updateTrip(selectedTrip.id, payload, user?.id || "SB_ADMIN_6549");
        updateTrip(selectedTrip.id, {
          ...data,
          routing_points,
          bus: {
            name: bus.name,
            vehicle_number: bus.vehicle_number,
            category: bus.category
          }
        });
        toast.success(response.message || "Schedule adjusted successfully");
      } else {
        // Add logic using actual API
        const response = await adminService.addTrip(payload);
        
        // Add to local store with details for the UI
        addTrip({
          ...data,
          id: response.trip_id || response.id,
          routing_points,
          bus: {
            name: bus.name,
            vehicle_number: bus.vehicle_number,
            category: bus.category
          }
        });
        
        toast.success(response.message || "Trip launched successfully");
      }
      setModalOpen(false);
    } catch (err) {
      console.error("Failed to schedule trip:", err);
      toast.error(err.response?.data?.message || err.response?.data?.detail || "Operation failed. Possible scheduling conflict.");
    } finally {
      setIsSubmitting(false);
    }
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
        loading={loading || isSubmitting} 
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
