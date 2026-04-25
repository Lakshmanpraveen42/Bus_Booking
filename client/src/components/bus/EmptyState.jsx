import React from 'react';
import { 
  Bus, Search, SlidersHorizontal, 
  CalendarDays, RotateCcw, ArrowRight,
  Info 
} from 'lucide-react';

const EmptyState = ({ 
  source, 
  destination, 
  date, 
  onNextDay, 
  onClearFilters, 
  onRetry,
  hasFilters = false 
}) => {
  return (
    <div className="w-full py-20 px-6 animate-fade-in-up">
      <div className="max-w-xl mx-auto flex flex-col items-center text-center">
        
        {/* 1. VISUAL ANCHOR */}
        <div className="relative mb-10 group">
          <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center text-slate-200 group-hover:bg-primary-50 group-hover:text-primary-200 transition-colors duration-500">
            <Bus className="w-14 h-14" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center justify-center text-slate-400">
             <Search className="w-6 h-6" />
          </div>
        </div>

        {/* 2. DYNAMIC MESSAGE */}
        <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">
          No Buses Found
        </h2>
        <p className="text-slate-500 font-medium leading-relaxed mb-6">
          We couldn't find any buses traveling from <span className="text-slate-900 font-black">{source}</span> to <span className="text-slate-900 font-black">{destination}</span> on <span className="text-primary-600 font-black">{date}</span>.
        </p>

        {/* 3. FILTER WARNING */}
        {hasFilters && (
          <div className="w-full bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-center gap-4 mb-10 text-left">
             <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                <SlidersHorizontal className="w-5 h-5 text-amber-500" />
             </div>
             <div>
                <p className="text-amber-900 font-black text-xs uppercase tracking-widest leading-none mb-1">Active Filters Detected</p>
                <p className="text-amber-700 text-[11px] font-bold">Your current filters might be hiding valid results. Try clearing them.</p>
             </div>
          </div>
        )}

        {/* 4. RECOVERY ACTIONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
           <button 
             onClick={onNextDay}
             className="flex items-center justify-center gap-3 h-16 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-black transition-all group"
           >
              <CalendarDays className="w-4 h-4 text-primary-400" />
              Check Next Day
           </button>
           
           <button 
             onClick={onClearFilters}
             className="flex items-center justify-center gap-3 h-16 bg-white border-2 border-slate-100 text-slate-900 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:border-primary-500 transition-all"
           >
              <RotateCcw className="w-4 h-4 text-slate-400" />
              Clear Filters
           </button>
        </div>

        {/* 5. ALTERNATIVE SUGGESTION */}
        <div className="mt-12 flex flex-col items-center gap-6">
           <button 
            onClick={onRetry}
            className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-primary-500 transition-colors uppercase tracking-widest"
           >
              <RotateCcw className="w-3.5 h-3.5" /> Refresh Results
           </button>

           <div className="h-px w-20 bg-slate-100" />

           <div className="flex flex-col items-center gap-2">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Need a different route?</p>
              <button className="flex items-center gap-2 text-sm font-black text-primary-500 hover:underline underline-offset-4">
                 Modify Search Area <ArrowRight className="w-4 h-4" />
              </button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default EmptyState;
