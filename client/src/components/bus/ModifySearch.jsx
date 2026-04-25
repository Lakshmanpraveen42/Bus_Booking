import React, { useState } from 'react';
import { MapPin, Calendar, ArrowLeftRight, Search } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import { useSearchSync } from '../../hooks/useSearchSync';

const ModifySearch = ({ initialParams }) => {
  const [from, setFrom] = useState(initialParams?.from || '');
  const [to, setTo] = useState(initialParams?.to || '');
  const [date, setDate] = useState(initialParams?.date ? new Date(initialParams.date) : new Date());
  const { updateURL } = useSearchSync();

  const handleSwap = () => { setFrom(to); setTo(from); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (from && to && date) {
      updateURL({
        from: from.trim(),
        to: to.trim(),
        date: format(date, 'yyyy-MM-dd')
      });
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-4 mb-8">
      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row items-center gap-4">
        {/* From */}
        <div className="relative flex-1 group w-full">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-500" />
          <input
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="From City"
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-transparent focus:border-primary-500 rounded-2xl outline-none font-bold text-slate-800"
          />
        </div>

        {/* Swap */}
        <button
          type="button"
          onClick={handleSwap}
          className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary-500 hover:border-primary-200 transition-all shadow-sm"
        >
          <ArrowLeftRight className="w-4 h-4" />
        </button>

        {/* To */}
        <div className="relative flex-1 group w-full">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-500" />
          <input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="To City"
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-transparent focus:border-primary-500 rounded-2xl outline-none font-bold text-slate-800"
          />
        </div>

        {/* Date */}
        <div className="relative flex-1 group w-full custom-datepicker">
          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-500 z-10" />
          <DatePicker
            selected={date}
            onChange={(d) => setDate(d)}
            minDate={new Date()}
            dateFormat="EEE, dd MMM yyyy"
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-transparent focus:border-primary-500 rounded-2xl outline-none font-bold text-slate-800"
          />
        </div>

        {/* Action */}
        <button
          type="submit"
          className="w-full lg:w-40 h-12 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary-500/20"
        >
          <Search className="w-4 h-4" />
          Modify
        </button>
      </form>
    </div>
  );
};

export default ModifySearch;
