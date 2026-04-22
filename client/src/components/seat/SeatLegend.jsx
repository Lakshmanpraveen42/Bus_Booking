import React from 'react';

const LEGEND_ITEMS = [
  { label: 'Available', className: 'bg-white border-2 border-slate-300' },
  { label: 'Selected', className: 'bg-primary-500 border-2 border-primary-600' },
  { label: 'Booked', className: 'bg-slate-200 border-2 border-slate-300' },
];

const SeatLegend = () => (
  <div className="flex items-center gap-4 flex-wrap">
    {LEGEND_ITEMS.map(({ label, className }) => (
      <div key={label} className="flex items-center gap-2">
        <div className={`w-6 h-6 rounded-md ${className}`} />
        <span className="text-xs text-slate-600">{label}</span>
      </div>
    ))}
  </div>
);

export default SeatLegend;
