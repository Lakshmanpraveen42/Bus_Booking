import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftRight, Search, SlidersHorizontal, 
  MapPin, Calendar, ChevronDown, RotateCw
} from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import BusCard from '../components/bus/BusCard';
import EmptyState from '../components/bus/EmptyState';
import { busService } from '../services/busService';
import { seatService } from '../services/seatService';
import { useBookingStore } from '../store/useBookingStore';
import { BusCardSkeleton } from '../components/ui/Skeleton';
import { toast } from 'react-hot-toast';

const BusListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [source, setSource] = useState(searchParams.get('source') || '');
  const [destination, setDestination] = useState(searchParams.get('destination') || '');
  const [date, setDate] = useState(searchParams.get('date') || '');

  const setSelectedBus = useBookingStore((s) => s.setSelectedBus);

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        setLoading(true);
        const data = await busService.searchBuses({
          source: searchParams.get('source'),
          destination: searchParams.get('destination'),
          date: searchParams.get('date')
        });
        setBuses(data);
      } catch (err) {
        toast.error("Failed to load trips.");
      } finally {
        setLoading(false);
      }
    };
    fetchBuses();
  }, [searchParams]);

  return (
    <PageWrapper className="bg-slate-50 min-h-screen pt-[76px]">
      
      {/* 🔴 REFERENCE-MATCHED SEARCH BAR */}
      <div className="bg-white border-b border-slate-100 py-4 shadow-sm sticky top-[76px] z-40">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-0 items-center border border-slate-200 rounded-lg overflow-hidden">
             
             {/* From */}
             <div className="md:col-span-4 flex items-center gap-3 px-4 py-3 bg-white border-r border-slate-200">
                <MapPin className="w-5 h-5 text-emerald-500" />
                <div>
                   <input value={source} onChange={(e) => setSource(e.target.value)} className="w-full text-sm font-bold bg-transparent outline-none placeholder:text-slate-300" placeholder="Anantapur" />
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-0.5">APT</p>
                </div>
             </div>

             {/* Swap */}
             <button className="hidden md:flex absolute left-[32.6%] -translate-x-1/2 bg-white border border-slate-200 rounded-full w-8 h-8 items-center justify-center text-slate-400 hover:text-primary-500 z-10">
                <ArrowLeftRight className="w-4 h-4" />
             </button>

             {/* To */}
             <div className="md:col-span-4 flex items-center gap-3 px-8 py-3 bg-white border-r border-slate-200">
                <MapPin className="w-5 h-5 text-rose-500" />
                <div>
                   <input value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full text-sm font-bold bg-transparent outline-none placeholder:text-slate-300" placeholder="Guntur" />
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-0.5">GNT</p>
                </div>
             </div>

             {/* Date */}
             <div className="md:col-span-4 flex items-center gap-3 px-4 py-3 bg-white">
                <Calendar className="w-5 h-5 text-slate-400" />
                <div>
                   <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full text-sm font-bold bg-transparent outline-none" />
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-0.5">Monday</p>
                </div>
             </div>
          </div>

          <button 
            onClick={() => setSearchParams({ source, destination, date })}
            className="w-full md:w-auto h-14 px-8 bg-[#e32e33] text-white rounded-lg font-bold text-sm transition-all hover:bg-[#c1272c]"
          >
            Modify Search
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 🟢 REFERENCE-MATCHED FILTERS SIDEBAR */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Filters</h3>
                <button className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Reset</button>
             </div>

             <FilterSection title="Departure Time">
                <FilterOption label="Morning (12 AM - 12 PM)" count="120" />
                <FilterOption label="Afternoon (12 PM - 4 PM)" count="85" />
                <FilterOption label="Evening (4 PM - 8 PM)" count="64" checked />
                <FilterOption label="Night (8 PM - 12 AM)" count="91" />
             </FilterSection>

             <FilterSection title="Bus Type">
                <FilterOption label="AC Seater" count="112" />
                <FilterOption label="AC Sleeper" count="98" />
                <FilterOption label="Non AC Seater" count="34" />
                <FilterOption label="Non AC Sleeper" count="16" />
             </FilterSection>

             <FilterSection title="Amenities">
                <FilterOption label="Live Tracking" count="126" />
                <FilterOption label="Charging Point" count="118" />
                <FilterOption label="Water Bottle" count="90" />
                <FilterOption label="Blanket" count="72" />
                <p className="text-[10px] font-bold text-primary-500 mt-2 cursor-pointer">+ More</p>
             </FilterSection>

             <div className="mt-8 pt-8 border-t border-slate-50">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Price Range</h4>
                <div className="h-1.5 w-full bg-slate-100 rounded-full relative">
                   <div className="absolute left-0 right-0 h-full bg-rose-500 rounded-full" />
                   <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-rose-500 rounded-full shadow-sm" />
                   <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-rose-500 rounded-full shadow-sm" />
                </div>
                <div className="flex items-center justify-between mt-4">
                   <span className="text-[10px] font-bold text-slate-500">₹300</span>
                   <span className="text-[10px] font-bold text-slate-500">₹2000+</span>
                </div>
             </div>
          </div>
        </div>

        {/* 🔵 LISTING AREA */}
        <div className="lg:col-span-9">
          <div className="flex items-center justify-between mb-6">
             <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{buses.length} BUSES FOUND</h2>
             <div className="flex items-center gap-4">
                <span className="text-[11px] font-bold text-slate-400">Sort by:</span>
                <select className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-[11px] font-bold text-slate-600 outline-none">
                   <option>Price - Low to High</option>
                   <option>Departure Time</option>
                   <option>Rating</option>
                </select>
             </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              [...Array(4)].map((_, i) => <BusCardSkeleton key={i} />)
            ) : buses.length > 0 ? (
              buses.map((bus) => (
                <BusCard key={bus.id} bus={bus} onSelect={async () => {
                   setSelectedBus(bus);
                   navigate(`/seats/${bus.id}`);
                }} />
              ))
            ) : (
               <EmptyState source={source} destination={destination} date={date} onNextDay={() => {}} onRetry={() => setLoading(true)} />
            )}
          </div>
        </div>

      </div>
    </PageWrapper>
  );
};

const FilterSection = ({ title, children }) => (
  <div className="mb-8 last:mb-0">
    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{title}</h4>
    <div className="space-y-3">{children}</div>
  </div>
);

const FilterOption = ({ label, count, checked }) => (
  <div className="flex items-center justify-between group cursor-pointer">
    <div className="flex items-center gap-3">
       <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${checked ? 'bg-rose-500 border-rose-500' : 'bg-white border-slate-200 group-hover:border-rose-300'}`}>
          {checked && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
       </div>
       <span className={`text-[11px] font-bold ${checked ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-900'}`}>{label}</span>
    </div>
    <span className="text-[10px] font-bold text-slate-300">{count}</span>
  </div>
);

export default BusListing;
