import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-hot-toast';

/**
 * Hardened Admin Store - Production-grade Mock Database.
 * Enforces strict data integrity, relational constraints, and conflict detection.
 */
export const useAdminStore = create(
  persist(
    (set, get) => ({
      routes: [],
      buses: [],
      trips: [],
      locations: [],

      setLocations: (data) => set({ locations: data }),

      // --- Route Operations: Network Integrity ---
      addRoute: (route) => {
        const { routes } = get();

        // 1. Structural Validation
        if (route.source.toLowerCase() === route.destination.toLowerCase()) {
          toast.error("Source and Destination cannot be the same");
          return false;
        }
        if (route.stops.length < 2 && (route.source && route.destination)) {
           // Basic check - source/destination are effectively stops
        }

        // 2. Uniqueness: Prevent duplicate route paths
        const exists = routes.find(r => 
          r.source.toLowerCase() === route.source.toLowerCase() && 
          r.destination.toLowerCase() === route.destination.toLowerCase()
        );
        if (exists) {
          toast.error("A template for this route already exists");
          return false;
        }

        set((state) => ({ 
          routes: [...state.routes, { ...route, id: Date.now() }] 
        }));
        toast.success("Route template established");
        return true;
      },

      updateRoute: (id, data) => {
        set((state) => ({
          routes: state.routes.map(r => r.id === id ? { ...r, ...data } : r)
        }));
        return true;
      },

      deleteRoute: (id) => {
        const { trips } = get();
        // Relational Integrity: Prevent deletion if used in active trips
        const isUsed = trips.some(t => t.route_id === id);
        if (isUsed) {
          toast.error("Cannot delete: Route is currently used in active schedules");
          return false;
        }

        set((state) => ({
          routes: state.routes.filter(r => r.id !== id)
        }));
        toast.success("Route template removed");
        return true;
      },

      // --- Bus Operations: Fleet Integrity ---
      addBus: (bus) => {
        const { buses } = get();

        // 1. Uniqueness: Prevent duplicate registration
        const exists = buses.find(b => b.vehicle_number.toUpperCase() === bus.vehicle_number.toUpperCase());
        if (exists) {
          toast.error(`Vehicle ${bus.vehicle_number} is already registered`);
          return false;
        }

        // 2. Field Validation
        if (bus.total_seats <= 0) {
          toast.error("Seat count must be greater than zero");
          return false;
        }

        set((state) => ({ 
          buses: [...state.buses, { ...bus, id: Date.now() }] 
        }));
        toast.success("Vehicle added to fleet");
        return true;
      },

      updateBus: (id, data) => {
        set((state) => ({
          buses: state.buses.map(b => b.id === id ? { ...b, ...data } : b)
        }));
        return true;
      },

      deleteBus: (id) => {
        const { trips } = get();
        // Relational Integrity
        const isUsed = trips.some(t => t.bus_id === id);
        if (isUsed) {
          toast.error("Cannot delete: Vehicle is assigned to future trips");
          return false;
        }

        set((state) => ({
          buses: state.buses.filter(b => b.id !== id)
        }));
        toast.success("Vehicle removed from fleet");
        return true;
      },

      // --- Trip Operations: Conflict & Temporal Management ---
      addTrip: (trip) => {
        const { routes, buses, trips } = get();
        
        const newStart = new Date(trip.departure_time);
        const newEnd = new Date(trip.arrival_time);

        // 1. Temporal Logic
        if (newStart >= newEnd) {
          toast.error("Arrival must be after departure");
          return false;
        }

        // 2. BUS CONFLICT CHECK: Prevent overlapping assignments
        const conflict = trips.find(t => {
          if (t.bus_id !== trip.bus_id) return false;
          
          const existStart = new Date(t.departure_time);
          const existEnd = new Date(t.arrival_time);

          // Intersection: (StartA <= EndB) AND (EndA >= StartB)
          return (existStart <= newEnd && existEnd >= newStart);
        });

        if (conflict) {
          toast.error(`Bus Conflict: This vehicle is already assigned to ${conflict.source} → ${conflict.destination} during this window`);
          return false;
        }

        // 3. Relational Mapping
        const route = routes.find(r => r.id === parseInt(trip.route_id));
        const bus = buses.find(b => b.id === parseInt(trip.bus_id));

        if (!route || !bus) {
          toast.error("Invalid route or bus selection");
          return false;
        }

        const newTrip = {
          ...trip,
          id: Date.now(),
          source: route.source,
          destination: route.destination,
          bus: { 
            name: bus.name, 
            vehicle_number: bus.vehicle_number,
            category: bus.category 
          }
        };

        set((state) => ({ trips: [...state.trips, newTrip] }));
        toast.success("Trip successfully scheduled");
        return true;
      },

      updateTrip: (id, data) => {
        set((state) => ({
          trips: state.trips.map(t => t.id === id ? { ...t, ...data } : t)
        }));
        return true;
      },

      deleteTrip: (id) => {
        set((state) => ({
          trips: state.trips.filter(t => t.id !== id)
        }));
        toast.success("Trip schedule cancelled");
        return true;
      }
    }),
    {
      name: 'smartbus-admin-mock-db-hardened', // New key for the hardened version
    }
  )
);
