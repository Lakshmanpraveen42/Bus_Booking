import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import BusCard from '../components/bus/BusCard';
import FilterSidebar from '../components/bus/FilterSidebar';
import SortBar from '../components/bus/SortBar';
import { BusCardSkeleton } from '../components/ui/Skeleton';
import { EmptyState, ErrorState } from '../components/bus/States';
import { useBuses } from '../hooks/useBuses';
import { useBookingStore } from '../store/useBookingStore';
import { SORT_OPTIONS, DEPARTURE_SLOTS } from '../utils/constants';
import { timeToMinutes, formatDate } from '../utils/formatters';

const DEFAULT_FILTERS = { priceMax: 5000, departureSlots: [], busTypes: [] };

const applyFiltersAndSort = (buses, filters, sortBy) => {
  let result = buses.filter((b) => {
    if (b.pricePerSeat > filters.priceMax) return false;
    if (filters.busTypes.length > 0 && !filters.busTypes.includes(b.busType)) return false;
    if (filters.departureSlots.length > 0) {
      const depMin = timeToMinutes(b.departureTime);
      const depHour = depMin / 60;
      const inSlot = filters.departureSlots.some((slotId) => {
        const slot = DEPARTURE_SLOTS.find((s) => s.id === slotId);
        return slot && depHour >= slot.range[0] && depHour < slot.range[1];
      });
      if (!inSlot) return false;
    }
    return true;
  });

  switch (sortBy) {
    case SORT_OPTIONS.PRICE_ASC:     result.sort((a, b) => a.pricePerSeat - b.pricePerSeat); break;
    case SORT_OPTIONS.PRICE_DESC:    result.sort((a, b) => b.pricePerSeat - a.pricePerSeat); break;
    case SORT_OPTIONS.DEPARTURE_EARLY: result.sort((a, b) => timeToMinutes(a.departureTime) - timeToMinutes(b.departureTime)); break;
    case SORT_OPTIONS.DEPARTURE_LATE:  result.sort((a, b) => timeToMinutes(b.departureTime) - timeToMinutes(a.departureTime)); break;
    case SORT_OPTIONS.RATING:        result.sort((a, b) => b.rating - a.rating); break;
    case SORT_OPTIONS.DURATION:      result.sort((a, b) => a.durationMinutes - b.durationMinutes); break;
    default: break;
  }
  return result;
};

const BusListing = () => {
  const navigate = useNavigate();
  const searchParams = useBookingStore((s) => s.searchParams);
  const { data: buses, loading, error, refetch } = useBuses(searchParams);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.DEPARTURE_EARLY);

  const filtered = useMemo(
    () => applyFiltersAndSort(buses, filters, sortBy),
    [buses, filters, sortBy]
  );

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
              <button onClick={() => navigate('/')} className="hover:text-primary-500 transition-colors">Home</button>
              <span>/</span>
              <span className="text-slate-900">{searchParams?.from} to {searchParams?.to}</span>
            </nav>
            <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
              Available <span className="text-primary-500">Buses</span>
              <span className="text-sm font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-full">{filtered.length}</span>
            </h1>
          </div>
          
          {searchParams?.date && (
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100">
              <Calendar className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-bold text-slate-700">{formatDate(searchParams.date)}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* Unified Sidebar */}
          <FilterSidebar filters={filters} onChange={setFilters} />

          {/* Result List */}
          <div className="flex-1 min-w-0 w-full">
            <div className="mb-6">
              <SortBar activeSort={sortBy} onSort={setSortBy} resultCount={filtered.length} />
            </div>

            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => <BusCardSkeleton key={i} />)}
              </div>
            ) : error ? (
              <ErrorState message={error} onRetry={refetch} />
            ) : filtered.length === 0 ? (
              <EmptyState from={searchParams?.from} to={searchParams?.to} date={searchParams?.date} />
            ) : (
              <div className="space-y-6">
                {filtered.map((bus, index) => (
                  <div key={bus.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 80}ms` }}>
                    <BusCard bus={bus} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default BusListing;
