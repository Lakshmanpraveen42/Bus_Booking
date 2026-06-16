import React, { useState, useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftRight, Search, SlidersHorizontal, 
  MapPin, Calendar, ChevronDown, RotateCw
} from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import SearchHeader from '../components/bus/SearchHeader';
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
  
  // States for filters (searchParams are now the source of truth for the header)
  const source = searchParams.get('source') || '';
  const destination = searchParams.get('destination') || '';
  const date = searchParams.get('date') || '';

  // Filter & Sort State
  const [filters, setFilters] = useState({
    departureSlots: [], // labels: Morning, Afternoon, Evening, Night
    busTypes: [],
    priceRange: [0, 5000]
  });
  const [sortBy, setSortBy] = useState('Price - Low to High');

  const setSelectedBus = useBookingStore((s) => s.setSelectedBus);

  const filteredBuses = useMemo(() => {
    let result = [...buses];

    // 1. Filter by Departure Time
    if (filters.departureSlots.length > 0) {
      result = result.filter(bus => {
        const hour = dayjs(bus.departureTime, "hh:mm A").hour();
        return filters.departureSlots.some(slot => {
          if (slot === 'Morning (12 AM - 12 PM)') return hour >= 0 && hour < 12;
          if (slot === 'Afternoon (12 PM - 4 PM)') return hour >= 12 && hour < 16;
          if (slot === 'Evening (4 PM - 8 PM)') return hour >= 16 && hour < 20;
          if (slot === 'Night (8 PM - 12 AM)') return hour >= 20 && hour < 24;
          return false;
        });
      });
    }

    // 2. Filter by Bus Type
    if (filters.busTypes.length > 0) {
      result = result.filter(bus => 
        filters.busTypes.some(type => bus.busType.toLowerCase().includes(type.toLowerCase()))
      );
    }

    // 3. Filter by Price
    result = result.filter(bus => bus.price <= filters.priceRange[1]);

    // 4. Sorting
    result.sort((a, b) => {
      if (sortBy === 'Price - Low to High') return a.price - b.price;
      if (sortBy === 'Departure Time') {
        const timeA = dayjs(a.departureTime, "hh:mm A");
        const timeB = dayjs(b.departureTime, "hh:mm A");
        return timeA.isBefore(timeB) ? -1 : 1;
      }
      if (sortBy === 'Rating') return 4.8 - 4.8; // Hardcoded rating logic for now
      return 0;
    });

    return result;
  }, [buses, filters, sortBy]);

  const toggleFilter = (category, value) => {
    setFilters(prev => {
      const current = prev[category];
      const next = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [category]: next };
    });
  };

  const resetFilters = () => {
    setFilters({
      departureSlots: [],
      busTypes: [],
      priceRange: [0, 5000]
    });
    setSortBy('Price - Low to High');
  };

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
      
      {/* 🔴 SEARCH HEADER */}
      <SearchHeader />

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 🟢 REFERENCE-MATCHED FILTERS SIDEBAR */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Filters</h3>
                <button 
                  onClick={resetFilters}
                  className="text-[10px] font-bold text-rose-500 uppercase tracking-widest hover:underline"
                >
                  Reset
                </button>
             </div>

             <FilterSection title="Departure Time">
                <FilterOption 
                  label="Morning (12 AM - 12 PM)" 
                  count={buses.filter(b => {const h = dayjs(b.departureTime, "hh:mm A").hour(); return h >= 0 && h < 12}).length} 
                  checked={filters.departureSlots.includes("Morning (12 AM - 12 PM)")}
                  onClick={() => toggleFilter('departureSlots', "Morning (12 AM - 12 PM)")}
                />
                <FilterOption 
                  label="Afternoon (12 PM - 4 PM)" 
                  count={buses.filter(b => {const h = dayjs(b.departureTime, "hh:mm A").hour(); return h >= 12 && h < 16}).length} 
                  checked={filters.departureSlots.includes("Afternoon (12 PM - 4 PM)")}
                  onClick={() => toggleFilter('departureSlots', "Afternoon (12 PM - 4 PM)")}
                />
                <FilterOption 
                  label="Evening (4 PM - 8 PM)" 
                  count={buses.filter(b => {const h = dayjs(b.departureTime, "hh:mm A").hour(); return h >= 16 && h < 20}).length} 
                  checked={filters.departureSlots.includes("Evening (4 PM - 8 PM)")}
                  onClick={() => toggleFilter('departureSlots', "Evening (4 PM - 8 PM)")}
                />
                <FilterOption 
                  label="Night (8 PM - 12 AM)" 
                  count={buses.filter(b => {const h = dayjs(b.departureTime, "hh:mm A").hour(); return h >= 20 && h < 24}).length} 
                  checked={filters.departureSlots.includes("Night (8 PM - 12 AM)")}
                  onClick={() => toggleFilter('departureSlots', "Night (8 PM - 12 AM)")}
                />
             </FilterSection>

             <FilterSection title="Bus Type">
                {['AC Seater', 'AC Sleeper', 'Non AC Seater', 'Non AC Sleeper'].map(type => (
                  <FilterOption 
                    key={type}
                    label={type} 
                    count={buses.filter(b => b.busType.toLowerCase().includes(type.toLowerCase().split(' ').join(''))).length} 
                    checked={filters.busTypes.includes(type)}
                    onClick={() => toggleFilter('busTypes', type)}
                  />
                ))}
             </FilterSection>

             <FilterSection title="Amenities">
                <FilterOption label="Live Tracking" count="126" />
                <FilterOption label="Charging Point" count="118" />
                <FilterOption label="Water Bottle" count="90" />
                <FilterOption label="Blanket" count="72" />
                <p className="text-[10px] font-bold text-primary-500 mt-2 cursor-pointer">+ More</p>
             </FilterSection>

             <div className="mt-8 pt-8 border-t border-slate-50">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex justify-between">
                  Price Range
                  <span className="text-rose-500">Up to ₹{filters.priceRange[1]}</span>
                </h4>
                <div className="px-2">
                  <input 
                    type="range" 
                    min="200" 
                    max="5000" 
                    step="100"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters(prev => ({ ...prev, priceRange: [0, parseInt(e.target.value)] }))}
                    className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-rose-500"
                  />
                </div>
                <div className="flex items-center justify-between mt-4">
                   <span className="text-[10px] font-bold text-slate-500">₹200</span>
                   <span className="text-[10px] font-bold text-slate-500">₹5000</span>
                </div>
             </div>
          </div>
        </div>

        {/* 🔵 LISTING AREA */}
        <div className="lg:col-span-9">
          <div className="flex items-center justify-between mb-6">
             <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{filteredBuses.length} BUSES FOUND</h2>
             <div className="flex items-center gap-4">
                <span className="text-[11px] font-bold text-slate-400">Sort by:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-[11px] font-bold text-slate-600 outline-none cursor-pointer"
                >
                   <option>Price - Low to High</option>
                   <option>Departure Time</option>
                   <option>Rating</option>
                </select>
             </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              [...Array(4)].map((_, i) => <BusCardSkeleton key={i} />)
            ) : filteredBuses.length > 0 ? (
              filteredBuses.map((bus) => (
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

const FilterOption = ({ label, count, checked, onClick }) => (
  <div className="flex items-center justify-between group cursor-pointer" onClick={onClick}>
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
