import React, { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { BUS_TYPE, DEPARTURE_SLOTS } from '../../utils/constants';

const FilterSidebar = ({ filters, onChange }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDepartureSlot = (slotId) => {
    const current = filters.departureSlots ?? [];
    const next = current.includes(slotId)
      ? current.filter((s) => s !== slotId)
      : [...current, slotId];
    onChange({ ...filters, departureSlots: next });
  };

  const handleBusType = (type) => {
    const current = filters.busTypes ?? [];
    const next = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    onChange({ ...filters, busTypes: next });
  };

  const handleReset = () =>
    onChange({ priceMax: 5000, departureSlots: [], busTypes: [] });

  const hasFilters =
    (filters.departureSlots?.length > 0) ||
    (filters.busTypes?.length > 0) ||
    filters.priceMax < 5000;

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-primary-500" />
          Filters
        </h3>
        {hasFilters && (
          <button onClick={handleReset} className="text-xs text-primary-500 hover:underline">
            Clear all
          </button>
        )}
      </div>

      {/* Price Range */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-slate-700">Max Price</p>
          <p className="text-sm font-semibold text-primary-500">₹{filters.priceMax}</p>
        </div>
        <input
          type="range"
          min={200}
          max={5000}
          step={100}
          value={filters.priceMax}
          onChange={(e) => onChange({ ...filters, priceMax: Number(e.target.value) })}
          className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-primary-500"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>₹200</span>
          <span>₹5,000</span>
        </div>
      </div>

      {/* Departure Slots */}
      <div>
        <p className="text-sm font-medium text-slate-700 mb-2">Departure Time</p>
        <div className="space-y-2">
          {DEPARTURE_SLOTS.map((slot) => {
            const active = filters.departureSlots?.includes(slot.id);
            return (
              <button
                key={slot.id}
                onClick={() => handleDepartureSlot(slot.id)}
                className={[
                  'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors border',
                  active
                    ? 'bg-primary-50 border-primary-300 text-primary-700 font-medium'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-primary-200',
                ].join(' ')}
              >
                {slot.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bus Type */}
      <div>
        <p className="text-sm font-medium text-slate-700 mb-2">Bus Type</p>
        <div className="space-y-2">
          {Object.values(BUS_TYPE).map((type) => {
            const active = filters.busTypes?.includes(type);
            return (
              <label key={type} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={() => handleBusType(type)}
                  className="w-4 h-4 rounded accent-primary-500 cursor-pointer"
                />
                <span className={['text-sm transition-colors', active ? 'text-primary-700 font-medium' : 'text-slate-600 group-hover:text-slate-800'].join(' ')}>
                  {type}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 shadow-sm"
        onClick={() => setMobileOpen(true)}
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filters
        {hasFilters && <span className="w-2 h-2 rounded-full bg-primary-500" />}
      </button>

      {/* Mobile Sheet */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl p-6 overflow-y-auto animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-slate-800">Filters</h2>
              <button onClick={() => setMobileOpen(false)}>
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            {content}
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-5 sticky top-24">
          {content}
        </div>
      </aside>
    </>
  );
};

export default FilterSidebar;
