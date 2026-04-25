import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, User, Info, MapPin, ChevronRight, ShieldCheck, Search, Check, XCircle, Clock, Navigation } from 'lucide-react';
import { toast } from 'react-hot-toast';
import PageWrapper from '../components/layout/PageWrapper';
import { seatService } from '../services/seatService';
import { useBookingStore } from '../store/useBookingStore';
import { useAuthStore } from '../store/useAuthStore';
import { formatPrice } from '../utils/formatters';
import { SeatMapSkeleton } from '../components/ui/Skeleton';
import Button from '../components/ui/Button';

const SeatSelection = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  
  // Local UI State
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [boardingPoint, setBoardingPoint] = useState('');
  const [droppingPoint, setDroppingPoint] = useState('');
  
  const selectedBus = useBookingStore((s) => s.selectedBus);
  const setStoreBookingData = useBookingStore((s) => s.setBookingData);
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  // Sync Logic & Initial Fetch
  useEffect(() => {
    const fetchSeats = async () => {
      try {
        setLoading(true);
        const res = await seatService.getSeats(tripId);
        setData(res);
      } catch (err) {
        toast.error("Network Error: Could not reach bus server.");
      } finally {
        setLoading(false);
      }
    };
    fetchSeats();
    
    // Safety: Reset on mount to avoid stale artifacts
    setSelectedSeats([]);
    setBoardingPoint('');
    setDroppingPoint('');
  }, [tripId]);

  const basePrice = selectedBus?.price || 1200;
  const totalPrice = selectedSeats.length * basePrice;

  // ─── Journey Logic ──────────────────────────────
  const routingPoints = useMemo(() => selectedBus?.routingPoints || [], [selectedBus]);
  
  const availableDroppingPoints = useMemo(() => {
    const boardingIndex = routingPoints.indexOf(boardingPoint);
    return boardingIndex === -1 ? [] : routingPoints.slice(boardingIndex + 1);
  }, [boardingPoint, routingPoints]);

  const toggleSeat = (seat) => {
    if (seat.is_booked) return;
    setSelectedSeats(prev => {
      const isSelected = prev.find(s => s.trip_seat_id === seat.trip_seat_id);
      if (isSelected) return prev.filter(s => s.trip_seat_id !== seat.trip_seat_id);
      if (prev.length >= 6) {
        toast.error("Selection Limit: 6 seats max");
        return prev;
      }
      return [...prev, seat];
    });
  };

  const handleContinue = () => {
    if (!isAuthenticated) {
      toast.error("Please login to continue booking");
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    setStoreBookingData({ 
      selectedSeats, 
      totalPrice, 
      tripId,
      boardingPoint,
      droppingPoint
    });
    navigate('/checkout');
  };

  // ─── Layout Engine ──────────────────────────────
  const busRows = useMemo(() => {
    if (!data?.seats) return [];
    const sorted = [...data.seats].sort((a, b) => {
      const numA = parseInt(a.seat_number.replace(/\D/g, '')) || 0;
      const numB = parseInt(b.seat_number.replace(/\D/g, '')) || 0;
      return numA - numB;
    });
    const rows = [];
    for (let i = 0; i < sorted.length; i += 4) rows.push(sorted.slice(i, i + 4));
    return rows;
  }, [data]);

  const canConfirm = selectedSeats.length > 0 && boardingPoint && droppingPoint;

  if (loading) return <PageWrapper><div className="p-10"><SeatMapSkeleton /></div></PageWrapper>;
  if (!data) return <PageWrapper>
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-12 gap-6 bg-white rounded-[3rem] border-2 border-slate-50 mt-10">
      <XCircle className="w-16 h-16 text-slate-100" />
      <div className="text-center">
        <h2 className="text-xl font-black text-slate-800">Bus Schedule Expired</h2>
        <p className="text-sm text-slate-400 mt-2 font-bold max-w-xs">The seat data for this trip is no longer available. Please search again.</p>
      </div>
      <Button size="lg" onClick={() => navigate('/')} className="rounded-2xl px-10">Back to Home</Button>
    </div>
  </PageWrapper>;

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-16 animate-fade-in-up">
        
        {/* Header Itinerary Banner */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-12">
          <div className="flex items-center gap-6">
            <button onClick={() => navigate(-1)} className="p-4 bg-white border border-slate-100 rounded-[1.25rem] hover:text-primary-600 hover:border-primary-200 transition-all shadow-sm group">
              <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <p className="text-[10px] font-black uppercase text-primary-500 tracking-[0.4em] mb-2">Bus Information</p>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{data.bus_name}</h1>
              <div className="flex items-center gap-3 mt-4">
                 <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100/80 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest">
                   <Navigation className="w-3 h-3 text-primary-500" /> {data.route}
                 </div>
                 <div className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                    40 Available
                 </div>
              </div>
            </div>
          </div>

          {(boardingPoint && droppingPoint) && (
            <div className="px-6 py-4 bg-primary-600 rounded-[2rem] text-white flex items-center gap-4 shadow-xl shadow-primary-500/30 animate-scale-in">
              <span className="text-xs font-black uppercase tracking-widest opacity-60">Journey:</span>
              <span className="text-sm font-black whitespace-nowrap">{boardingPoint}</span>
              <ChevronRight className="w-4 h-4 opacity-40 shrink-0" />
              <span className="text-sm font-black whitespace-nowrap">{droppingPoint}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-8 flex flex-col gap-10">
            
            {/* Transit Selection Module */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-50 shadow-card">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                 <div className="space-y-4">
                   <h4 className="text-[11px] font-black uppercase text-emerald-600 tracking-[0.2em] flex items-center gap-2">
                     <MapPin className="w-3 h-3" /> Boarding Point
                   </h4>
                   <SearchableSelect 
                     options={routingPoints} 
                     value={boardingPoint} 
                     onChange={(val) => { 
                       setBoardingPoint(val); 
                       setDroppingPoint(''); 
                       setSelectedSeats([]); // Sequential state reset
                     }} 
                     placeholder="Select pickup point..."
                   />
                 </div>

                 <div className="space-y-4">
                   <h4 className="text-[11px] font-black uppercase text-rose-600 tracking-[0.2em] flex items-center gap-2">
                     <MapPin className="w-3 h-3" /> Dropping Point
                   </h4>
                   <SearchableSelect 
                     options={availableDroppingPoints} 
                     value={droppingPoint} 
                     onChange={setDroppingPoint} 
                     placeholder="Select dropping point..."
                     disabled={!boardingPoint}
                   />
                 </div>
               </div>
            </div>

            {/* High-Impact Realistic Bus Layout */}
            <div className="flex justify-center p-8 bg-slate-50/30 rounded-[3.5rem] border border-slate-50">
              <div className="w-full max-w-sm bg-white rounded-[3.5rem] border-[10px] border-slate-100 shadow-2xl p-0.5 relative">
                
                {/* Cockpit / Front */}
                <div className="h-32 bg-slate-100/20 border-b-2 border-slate-100 flex flex-col items-center justify-center relative overflow-hidden">
                   <div className="absolute top-0 inset-x-0 h-1 bg-slate-200/50" />
                   <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mb-2 border border-slate-100">
                      <User className="w-6 h-6" />
                   </div>
                   <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">Driver / Front</span>
                </div>

                <div className="p-12 space-y-7">
                   {busRows.map((row, i) => (
                     <div key={i} className="grid grid-cols-5 items-center gap-4 md:gap-6">
                        <Seat seat={row[0]} active={selectedSeats.some(s => s.trip_seat_id === row[0]?.trip_seat_id)} onClick={toggleSeat} />
                        <Seat seat={row[1]} active={selectedSeats.some(s => s.trip_seat_id === row[1]?.trip_seat_id)} onClick={toggleSeat} />
                        <div className="flex justify-center h-full">
                           <div className="w-px h-full bg-slate-100" />
                        </div>
                        <Seat seat={row[2]} active={selectedSeats.some(s => s.trip_seat_id === row[2]?.trip_seat_id)} onClick={toggleSeat} />
                        <Seat seat={row[3]} active={selectedSeats.some(s => s.trip_seat_id === row[3]?.trip_seat_id)} onClick={toggleSeat} />
                     </div>
                   ))}
                </div>

                <div className="h-10 bg-slate-50 rounded-b-[2.8rem]" />
              </div>
            </div>
          </div>

          {/* ITINERARY DASHBOARD PANEL */}
          <div className="lg:col-span-4 lg:sticky lg:top-10 space-y-6">
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
               <div className="absolute -top-10 -right-10 opacity-5 scale-150 rotate-12"><Check className="w-32 h-32" /></div>
               
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-400 mb-10 pb-4 border-b border-white/5">Order Dashboard</h3>

               <div className="space-y-8">
                 {/* Bus Details Summary */}
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Timings</p>
                       <p className="text-xs font-bold text-white/80">{selectedBus?.departureTime} - {selectedBus?.arrivalTime}</p>
                    </div>
                    <div className="space-y-1 text-right">
                       <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Duration</p>
                       <div className="flex items-center justify-end gap-1.5 text-xs font-bold text-white/80">
                         <Clock className="w-3 h-3 text-primary-400" /> {selectedBus?.duration || '--'}
                       </div>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div>
                       <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block mb-4">Confirmed Seats</label>
                       <div className="flex flex-wrap gap-2.5">
                         {selectedSeats.length > 0 ? selectedSeats.map(s => (
                           <div key={s.trip_seat_id} className="px-5 py-2.5 bg-primary-500 rounded-2xl text-xs font-black shadow-lg shadow-primary-500/20 text-white animate-scale-in">{s.seat_number}</div>
                         )) : <p className="text-white/20 text-[11px] italic font-bold">Waiting for selection...</p>}
                       </div>
                    </div>
                 </div>

                 <div className="pt-8 border-t border-white/10">
                    <div className="flex items-end justify-between transition-all duration-500">
                      <div>
                        <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Payable Total</span>
                        <p className="text-5xl font-black leading-none tracking-tighter mt-1 text-white">{formatPrice(totalPrice)}</p>
                      </div>
                    </div>
                 </div>

                 <div className="space-y-4 pt-4">
                    <button
                      onClick={handleContinue}
                      disabled={!canConfirm}
                      className="w-full h-18 bg-white text-slate-900 disabled:bg-white/5 disabled:text-white/10 rounded-[1.5rem] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95 group shadow-2xl"
                    >
                      Continue Checkout <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    {!canConfirm && (
                      <p className="text-[10px] text-center font-black text-white/20 uppercase tracking-[0.3em] animate-pulse italic">
                         Select journey & seat to confirm
                      </p>
                    )}
                 </div>
               </div>
            </div>

            {/* Quick Legend */}
            <div className="bg-white rounded-[2.25rem] p-8 border border-slate-50 shadow-sm flex items-center justify-between">
               <LegendItem icon={<div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />} text="Open" />
               <LegendItem icon={<div className="w-2.5 h-2.5 rounded-full bg-rose-500" />} text="Yours" />
               <LegendItem icon={<div className="w-2.5 h-2.5 rounded-full bg-slate-100" />} text="Sold" />
            </div>
          </div>

        </div>
      </div>
    </PageWrapper>
  );
};

// ─── HIGH-FIDELITY SUB-COMPONENTS ───────────────────

const SearchableSelect = ({ options, value, onChange, placeholder, disabled }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="relative group">
      <button 
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={`w-full h-16 px-6 bg-slate-50/50 border-2 rounded-[1.5rem] text-sm font-black transition-all flex items-center justify-between
          ${disabled ? 'opacity-30 cursor-not-allowed' : 'border-slate-50 hover:border-primary-400 hover:bg-white group-focus-within:border-primary-500'}
          ${value ? 'text-slate-900' : 'text-slate-400'}
        `}
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronRight className={`w-4 h-4 transition-transform ${open ? 'rotate-90' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-3 z-50 bg-white rounded-[2rem] border border-slate-100 shadow-[0_30px_60px_rgba(0,0,0,0.15)] overflow-hidden animate-zoom-in">
          <div className="p-4 bg-slate-50/50 border-b border-slate-100">
             <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input 
                  autoFocus
                  placeholder="Filter stops..."
                  className="w-full bg-white h-12 px-10 rounded-2xl text-xs font-bold outline-none ring-2 ring-primary-500/5 focus:ring-primary-500/20"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
             </div>
          </div>
          <div className="max-h-56 overflow-y-auto">
            {filtered.map(p => (
              <button 
                key={p} 
                onClick={() => { onChange(p); setOpen(false); setSearch(''); }}
                className="w-full px-7 py-4 text-left text-xs font-black text-slate-600 hover:bg-primary-50 hover:text-primary-700 transition-colors flex items-center justify-between"
              >
                {p}
                {value === p && <Check className="w-4 h-4 text-emerald-500" />}
              </button>
            ))}
            {filtered.length === 0 && <p className="p-8 text-center text-[10px] font-black text-slate-300 tracking-[0.3em] uppercase">No Match Found</p>}
          </div>
        </div>
      )}
    </div>
  );
};

const Seat = ({ seat, active, onClick }) => {
  if (!seat) return <div className="h-16" />;
  
  const base = "relative h-18 w-full rounded-[1.2rem] border-2 font-black text-sm transition-all duration-500 flex items-center justify-center overflow-hidden active:scale-90 group";
  
  const statusColors = seat.is_booked 
    ? "bg-slate-100 text-slate-300 border-slate-100 cursor-not-allowed opacity-40 shadow-inner" 
    : active 
    ? "bg-rose-500 text-white border-rose-600 shadow-[0_15px_30px_-5px_rgba(244,63,94,0.4)] -translate-y-2" 
    : "bg-white text-slate-400 border-slate-100/80 hover:border-emerald-400 hover:bg-emerald-50/20 hover:-translate-y-1";

  return (
    <button disabled={seat.is_booked} onClick={() => onClick(seat)} className={`${base} ${statusColors}`}>
      {/* Anatomy Headrest Curve */}
      <div className={`absolute top-0 inset-x-3 h-1.5 rounded-b-full transition-colors ${active ? 'bg-rose-400' : 'bg-slate-50 group-hover:bg-emerald-100'}`} />
      
      <span className="relative z-10">{seat.seat_number}</span>
      
      {active && <div className="absolute inset-0 bg-white/10 animate-pulse" />}
    </button>
  );
};

const LegendItem = ({ icon, text }) => (
  <div className="flex items-center gap-2.5">
    {icon}
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{text}</span>
  </div>
);

export default SeatSelection;
