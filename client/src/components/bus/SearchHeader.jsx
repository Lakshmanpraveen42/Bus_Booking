import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { format, parseISO, isValid, startOfToday } from 'date-fns';
import { MapPin, ArrowLeftRight, Search } from 'lucide-react';
import CustomDatePicker from '../../components/ui/CustomDatePicker';
import { useAdminStore } from '../../store/useAdminStore';
import staticCities from '../../data/cities.json';
import { toast } from 'react-hot-toast';

const CitySearchDropdown = ({ label, value, onChange, placeholder, icon: Icon, iconColor, cities }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = query.length > 0
    ? cities.filter((c) => c.toLowerCase().includes(query.toLowerCase())).slice(0, 10)
    : cities.slice(0, 6);

  return (
    <div className="relative flex-1" ref={dropdownRef}>
      <div 
        className={`flex items-center gap-3 px-4 py-3 bg-white cursor-text transition-all ${open ? 'ring-2 ring-primary-500/20' : ''}`}
        onClick={() => setOpen(true)}
      >
        <Icon className={`w-5 h-5 ${iconColor}`} />
        <div className="flex-1">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className="w-full text-sm font-bold bg-transparent outline-none placeholder:text-slate-300"
          />
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-0.5">
            {value === query ? (value.slice(0, 3).toUpperCase() || '---') : 'Select Location'}
          </p>
        </div>
      </div>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-100 z-[100] py-2 animate-fade-in">
          {filtered.length > 0 ? (
            filtered.map((city) => (
              <button
                key={city}
                type="button"
                className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center gap-3 group transition-colors"
                onClick={() => {
                  onChange(city);
                  setQuery(city);
                  setOpen(false);
                }}
              >
                <div className="w-8 h-8 rounded-lg bg-slate-50 group-hover:bg-primary-50 flex items-center justify-center text-slate-400 group-hover:text-primary-500 transition-colors">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-slate-700">{city}</span>
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-widest italic">
              No cities found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const SearchHeader = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [source, setSource] = useState(searchParams.get('source') || '');
  const [destination, setDestination] = useState(searchParams.get('destination') || '');
  const [date, setDate] = useState(searchParams.get('date') || format(new Date(), 'yyyy-MM-dd'));
  
  const apiLocations = useAdminStore((s) => s.locations);
  const cities = apiLocations.length > 0 ? apiLocations : staticCities;

  useEffect(() => {
    setSource(searchParams.get('source') || '');
    setDestination(searchParams.get('destination') || '');
    setDate(searchParams.get('date') || format(new Date(), 'yyyy-MM-dd'));
  }, [searchParams]);

  const handleSwap = () => {
    setSource(destination);
    setDestination(source);
  };

  const handleSearch = () => {
    if (!source || !destination || !date) {
      toast.error("Please fill all fields");
      return;
    }

    if (source.toLowerCase() === destination.toLowerCase()) {
      toast.error("Source and destination cannot be same");
      return;
    }

    setSearchParams({ source, destination, date });
  };

  const getDayName = (dateString) => {
    try {
      const d = parseISO(dateString);
      return isValid(d) ? format(d, 'EEEE') : '';
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="bg-white border-b border-slate-100 py-4 shadow-sm sticky top-[76px] z-40">
      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-4">
        <div className="flex-1 relative flex flex-col md:flex-row items-stretch border border-slate-200 rounded-xl overflow-visible bg-white">
          
          {/* Source */}
          <CitySearchDropdown
            label="From"
            value={source}
            onChange={setSource}
            placeholder="From City"
            icon={MapPin}
            iconColor="text-emerald-500"
            cities={cities}
          />

          {/* Swap Button */}
          <div className="relative flex items-center justify-center">
            <div className="absolute md:relative z-20">
              <button 
                onClick={handleSwap}
                className="bg-white border border-slate-200 rounded-full w-10 h-10 flex items-center justify-center text-slate-400 hover:text-primary-500 hover:border-primary-200 transition-all shadow-sm hover:shadow-md group active:scale-95"
              >
                <ArrowLeftRight className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              </button>
            </div>
            <div className="hidden md:block w-px h-10 bg-slate-100" />
          </div>

          {/* Destination */}
          <CitySearchDropdown
            label="To"
            value={destination}
            onChange={setDestination}
            placeholder="To City"
            icon={MapPin}
            iconColor="text-rose-500"
            cities={cities}
          />

          <div className="hidden md:block w-px h-10 bg-slate-100 self-center" />

          {/* Date Picker */}
          <div className="flex-1 flex items-center bg-white rounded-r-xl relative">
            <CustomDatePicker
              selectedDate={date ? parseISO(date) : null}
              onChange={(d) => setDate(d ? format(d, 'yyyy-MM-dd') : '')}
              minDate={startOfToday()}
              className="border-none shadow-none"
            />
          </div>
        </div>

        <button 
          onClick={handleSearch}
          className="w-full lg:w-auto h-14 px-10 bg-[#e32e33] hover:bg-[#c1272c] text-white rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-red-500/20 active:scale-[0.98] flex items-center justify-center gap-3"
        >
          <Search className="w-4 h-4" />
          Modify Search
        </button>
      </div>
    </div>
  );
};

export default SearchHeader;
