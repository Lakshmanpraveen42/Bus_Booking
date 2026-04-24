import React from 'react';
import { MapPin, Info } from 'lucide-react';
import { useBookingStore } from '../../store/useBookingStore';

/**
 * Professional Selector for Boarding & Dropping points.
 * Features a clean, accessible UI with specific icons and clear labels.
 */
const RoutePointsSelector = ({ stops }) => {
  const { boardingPoint, droppingPoint, setRoutePoints } = useBookingStore();

  if (!stops || stops.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 animate-fade-in">
      {/* Boarding Point */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
          <MapPin className="w-3.5 h-3.5 text-emerald-500" />
          Boarding Point
        </label>
        <select
          value={boardingPoint || ''}
          onChange={(e) => setRoutePoints({ boardingPoint: e.target.value })}
          className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-medium text-slate-700 outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-50 transition-all appearance-none cursor-pointer"
        >
          <option value="" disabled>Select Boarding Point</option>
          {stops.slice(0, -1).map((stop) => (
            <option key={stop.location} value={stop.location}>
              {stop.location}
            </option>
          ))}
        </select>
      </div>

      {/* Dropping Point */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
          <MapPin className="w-3.5 h-3.5 text-rose-500" />
          Dropping Point
        </label>
        <select
          value={droppingPoint || ''}
          onChange={(e) => setRoutePoints({ droppingPoint: e.target.value })}
          className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-medium text-slate-700 outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-50 transition-all appearance-none cursor-pointer"
        >
          <option value="" disabled>Select Dropping Point</option>
          {stops.slice(1).map((stop) => (
            <option key={stop.location} value={stop.location}>
              {stop.location}
            </option>
          ))}
        </select>
      </div>

      {(!boardingPoint || !droppingPoint) && (
        <div className="md:col-span-2 flex items-center gap-2 p-3 bg-primary-50 rounded-xl border border-primary-100">
          <Info className="w-4 h-4 text-primary-500" />
          <p className="text-[11px] text-primary-700 font-medium">
            Please select both boarding and dropping points to continue.
          </p>
        </div>
      )}
    </div>
  );
};

export default RoutePointsSelector;
