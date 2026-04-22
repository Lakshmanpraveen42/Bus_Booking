import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const AdminStatCard = ({ label, value, icon, trend, trendValue, color = 'primary' }) => {
  const colors = {
    primary: 'bg-primary-500/10 text-primary-500',
    emerald: 'bg-emerald-500/10 text-emerald-500',
    rose: 'bg-rose-500/10 text-rose-500',
    amber: 'bg-amber-500/10 text-amber-500',
    blue: 'bg-blue-500/10 text-blue-500',
  };

  return (
    <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary-500/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colors[color]}`}>
          {React.cloneElement(icon, { className: 'w-7 h-7' })}
        </div>
        
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-black px-3 py-1 rounded-full ${trend === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
            {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {trendValue}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-slate-400 text-xs font-black uppercase tracking-widest">{label}</p>
        <h3 className="text-3xl font-black text-slate-900">{value}</h3>
      </div>
    </div>
  );
};

export default AdminStatCard;
