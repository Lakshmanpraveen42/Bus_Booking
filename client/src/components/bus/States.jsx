import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, RefreshCw, Bus, Calendar } from 'lucide-react';
import { format, addDays } from 'date-fns';
import Button from '../ui/Button';

export const EmptyState = ({ from, to, date }) => {
  const navigate = useNavigate();
  const nextDate = date ? addDays(new Date(date), 1) : new Date();

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 bg-white rounded-[2.5rem] border border-dashed border-slate-200 text-center animate-fade-in shadow-sm">
      <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8 ring-8 ring-slate-50/50">
        <Bus className="w-10 h-10 text-slate-300" />
      </div>
      <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">No buses found</h3>
      <p className="text-slate-500 font-medium mb-10 max-w-sm leading-relaxed">
        We couldn't find any buses from <span className="text-slate-900 font-bold">{from}</span> to <span className="text-slate-900 font-bold">{to}</span> on this date.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          variant="primary"
          onClick={() => {
             const params = new URLSearchParams({ from, to, date: format(nextDate, 'yyyy-MM-dd') });
             navigate(`/buses?${params.toString()}`);
          }}
          leftIcon={<Calendar className="w-4 h-4" />}
          className="px-8 font-black uppercase tracking-widest bg-primary-600 shadow-lg shadow-primary-500/20"
        >
          Check Next Day
        </Button>
        <Button
          variant="secondary"
          onClick={() => navigate('/')}
          className="px-8 font-black uppercase tracking-widest border-2"
        >
          Modify Search
        </Button>
      </div>
    </div>
  );
};

export const ErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-20 px-6 bg-white rounded-[2.5rem] border border-dashed border-red-100 text-center animate-fade-in shadow-sm">
    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6 ring-8 ring-red-50/50">
      <AlertCircle className="w-10 h-10 text-red-400" />
    </div>
    <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">Something went wrong</h3>
    <p className="text-slate-500 font-medium mb-10 max-w-sm leading-relaxed">
      {message || 'We encountered an error while loading available buses. This might be a temporary network issue.'}
    </p>
    {onRetry && (
      <Button
        variant="primary"
        onClick={onRetry}
        leftIcon={<RefreshCw className="w-4 h-4" />}
        className="px-8 font-black uppercase tracking-widest bg-red-600 shadow-lg shadow-red-500/20"
      >
        Try Again
      </Button>
    )}
  </div>
);
