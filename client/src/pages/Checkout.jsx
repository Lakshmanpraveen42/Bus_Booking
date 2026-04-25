import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, User, Phone, Mail, ChevronRight, 
  ShieldCheck, CreditCard, Calendar, Clock, 
  MapPin, AlertCircle, CheckCircle2 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import PageWrapper from '../components/layout/PageWrapper';
import { useBookingStore } from '../store/useBookingStore';
import { useAuthStore } from '../store/useAuthStore';
import { formatPrice } from '../utils/formatters';
import { BOOKING_STATUS } from '../utils/constants';
import Button from '../components/ui/Button';
import api from '../services/api';

const Checkout = () => {
  const navigate = useNavigate();
  
  // ─── Data Subscription ────────────────────────────
  const selectedBus = useBookingStore((s) => s.selectedBus);
  const selectedSeats = useBookingStore((s) => s.selectedSeats) || [];
  const boardingPoint = useBookingStore((s) => s.boardingPoint);
  const droppingPoint = useBookingStore((s) => s.droppingPoint);
  const searchParams = useBookingStore((s) => s.searchParams);
  const baseFare = useBookingStore((s) => s.totalPrice) || 0;
  const tripId = useBookingStore((s) => s.tripId);
  const setBookingData = useBookingStore((s) => s.setBookingData);
  const { user } = useAuthStore();

  // ─── State Management ─────────────────────────────
  const [passengers, setPassengers] = useState([]);
  const [contact, setContact] = useState({ phone: '', email: '' });
  const [insuranceEnabled, setInsuranceEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Synchronize passengers with selected seats
  useEffect(() => {
    if (selectedSeats.length === 0) {
      toast.error("Booking session expired.");
      navigate('/');
      return;
    }
    setPassengers(selectedSeats.map(s => ({
      seat_number: s.seat_number,
      trip_seat_id: s.trip_seat_id,
      name: '',
      age: '',
      gender: ''
    })));
  }, [selectedSeats, navigate]);

  // ─── Financial Calculations ───────────────────────
  const insuranceCost = insuranceEnabled ? passengers.length * 15 : 0;
  const grandTotal = baseFare + insuranceCost;

  // ─── Validation Engine ────────────────────────────
  const errors = useMemo(() => {
    const err = { passengers: [], contact: {} };
    
    passengers.forEach((p, idx) => {
      const pErr = {};
      if (!p.name.trim()) pErr.name = 'Required';
      if (!p.age || p.age < 1 || p.age > 100) pErr.age = 'Invalid';
      if (!p.gender) pErr.gender = 'Required';
      err.passengers[idx] = pErr;
    });

    if (!/^\d{10}$/.test(contact.phone)) err.contact.phone = '10 digits';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) err.contact.email = 'Invalid';

    return err;
  }, [passengers, contact]);

  const isValid = useMemo(() => {
    const hasPassengerErrors = errors.passengers.some(p => Object.keys(p).length > 0);
    const hasContactErrors = Object.keys(errors.contact).length > 0;
    return !hasPassengerErrors && !hasContactErrors && passengers.length > 0;
  }, [errors, passengers]);

  // ─── Handlers ─────────────────────────────────────
  const handleProceed = async () => {
    setSubmitted(true);
    if (!isValid) return toast.error("Please fill all required fields");
    if (!user) return toast.error("Please login to proceed");
    
    setLoading(true);
    try {
      const payload = {
        user_id: user.id || "SB_USER_6549",
        email: user.email,
        source: boardingPoint,
        destination: droppingPoint,
        price: parseFloat(grandTotal),
        trip_id: parseInt(tripId),
        bus_name: selectedBus?.busName || "SmartBus Travels",
        passengers: passengers.map(p => ({
          name: p.name,
          age: parseInt(p.age),
          gender: p.gender,
          seat_id: p.trip_seat_id,
          seat_number: p.seat_number
        }))
      };
      
      console.log("Submitting Booking:", payload);
      const response = await api.post('/bookings', payload);
      
      if (response.data?.booking_id) {
        // 1. Synchronize store state to unlock guards
        setBookingData({
          bookingId: response.data.booking_id,
          bookingStatus: BOOKING_STATUS.SUCCESS
        });

        toast.success(response.data.message || "Ticket confirmed successfully!");
        
        // 2. Navigate to confirmation
        navigate('/confirmation', { state: { booking: response.data } });
      }
    } catch (err) {
      console.error("Booking Error:", err);
      toast.error(err.response?.data?.detail || "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-14 animate-fade-in">
        
        {/* Navigation */}
        <div className="flex items-center gap-4 mb-10">
          <button onClick={() => navigate(-1)} className="p-3 bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl transition-all shadow-sm">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-900 leading-none">Confirm Booking</h1>
            <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">Step 3 of 4: Finalize Itinerary</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          
          {/* LEFT: FORM STACK */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Passenger Forms */}
            <section className="space-y-6">
              <SectionHeader title="Passenger Details" icon={<User className="w-4 h-4" />} />
              {passengers.map((p, idx) => (
                <PassengerCard 
                  key={p.trip_seat_id} 
                  data={p} 
                  errors={submitted ? errors.passengers[idx] : {}}
                  onChange={(field, val) => {
                    const next = [...passengers];
                    next[idx][field] = val;
                    setPassengers(next);
                  }}
                />
              ))}
            </section>

            {/* Contact Details */}
            <section className="space-y-6">
              <SectionHeader title="Contact Information" icon={<Mail className="w-4 h-4" />} />
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm ring-1 ring-slate-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Input 
                    label="Mobile Number" 
                    placeholder="9876543210" 
                    value={contact.phone}
                    error={submitted && errors.contact.phone}
                    onChange={(val) => setContact({...contact, phone: val.replace(/\D/g, '').slice(0, 10)})}
                    icon={<Phone className="w-4 h-4" />}
                  />
                  <Input 
                    label="Email Address" 
                    placeholder="name@example.com" 
                    value={contact.email}
                    error={submitted && errors.contact.email}
                    onChange={(val) => setContact({...contact, email: val})}
                    icon={<Mail className="w-4 h-4" />}
                  />
                </div>
              </div>
            </section>

            {/* Add-ons (Insurance) */}
            <section className="space-y-6">
              <SectionHeader title="Add-ons" icon={<CreditCard className="w-4 h-4" />} />
              <InsuranceSection 
                enabled={insuranceEnabled} 
                onToggle={() => setInsuranceEnabled(!insuranceEnabled)} 
                count={passengers.length}
              />
            </section>
          </div>

          {/* RIGHT: STICKY SUMMARY */}
          <div className="lg:col-span-1 sticky top-10 h-fit">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl p-1 overflow-hidden">
               <div className="p-8 space-y-8">
                 <div className="pb-6 border-b border-slate-50">
                    <h3 className="text-xl font-black text-slate-900 leading-tight">{selectedBus?.busName}</h3>
                    <div className="flex items-center gap-2 mt-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                       <MapPin className="w-3 h-3 text-primary-500" /> {selectedBus?.busType}
                    </div>
                 </div>

                 {/* Points */}
                 <div className="space-y-4">
                   <SummaryPoint label="Boarding" value={boardingPoint} time={selectedBus?.departureTime} />
                   <SummaryPoint label="Dropping" value={droppingPoint} time={selectedBus?.arrivalTime} />
                 </div>

                 {/* Price Breakdown */}
                 <div className="pt-6 border-t border-slate-50 space-y-3">
                    <div className="flex justify-between text-sm font-bold text-slate-500">
                      <span>Base Fare ({passengers.length} Seats)</span>
                      <span>{formatPrice(baseFare)}</span>
                    </div>
                    {insuranceEnabled && (
                      <div className="flex justify-between text-sm font-bold text-emerald-600">
                        <span>Travel Insurance</span>
                        <span>{formatPrice(insuranceCost)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-end pt-4">
                       <span className="text-xs font-black uppercase text-slate-400 tracking-widest mb-1">Grand Total</span>
                       <span className="text-4xl font-black text-rose-600 tracking-tighter">{formatPrice(grandTotal)}</span>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <button
                      onClick={handleProceed}
                      disabled={loading}
                      className={`w-full h-16 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-2
                        ${isValid 
                          ? 'bg-slate-900 text-white hover:bg-black shadow-slate-900/20 active:scale-95' 
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
                      `}
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>Pay & Confirm <ChevronRight className="w-5 h-5" /></>
                      )}
                    </button>
                    {!isValid && submitted && (
                      <p className="text-[10px] text-center font-bold text-rose-500 uppercase tracking-widest animate-pulse">
                         Correct errors to continue
                      </p>
                    )}
                 </div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </PageWrapper>
  );
};

// ─── SUB-COMPONENTS ───────────────────────────────

const SectionHeader = ({ title, icon }) => (
  <div className="flex items-center gap-3 ml-2">
    <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center">
      {icon}
    </div>
    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">{title}</h3>
  </div>
);

const PassengerCard = ({ data, onChange, errors }) => (
  <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm ring-1 ring-slate-50 transition-all hover:shadow-md animate-scale-in">
    <div className="flex items-center gap-3 mb-6">
      <div className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black tracking-widest text-slate-500">SEAT {data.seat_number}</div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      <div className="md:col-span-6">
        <Input 
          label="Full Name" 
          placeholder="Passenger Name" 
          value={data.name} 
          error={errors.name}
          onChange={(val) => onChange('name', val)} 
        />
      </div>
      <div className="md:col-span-3">
        <Input 
          label="Age" 
          placeholder="Age" 
          type="number" 
          value={data.age} 
          error={errors.age}
          onChange={(val) => onChange('age', val)} 
        />
      </div>
      <div className="md:col-span-3">
        <label className="text-[10px] font-black uppercase text-slate-400 ml-1 mb-2 block">Gender</label>
        <select 
          value={data.gender}
          onChange={(e) => onChange('gender', e.target.value)}
          className={`w-full h-12 px-5 bg-slate-50/50 border rounded-xl text-sm font-bold focus:outline-none transition-all appearance-none
            ${errors.gender ? 'border-rose-300 ring-4 ring-rose-50' : 'border-slate-100 focus:border-primary-500 focus:bg-white'}
          `}
        >
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>
    </div>
  </div>
);

const InsuranceSection = ({ enabled, onToggle, count }) => (
  <div className={`bg-white p-8 rounded-[2rem] border transition-all cursor-pointer flex items-center justify-between shadow-sm
    ${enabled ? 'border-emerald-500 ring-4 ring-emerald-50 bg-emerald-50/10' : 'border-slate-100 hover:border-emerald-300'}
  `} onClick={onToggle}>
    <div className="flex items-start gap-5">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors
        ${enabled ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20' : 'bg-slate-100 text-slate-400'}
      `}>
        <ShieldCheck className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-black text-slate-900 group-hover:text-emerald-600">Travel Insurance</p>
        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">₹15 per passenger • Basic trip protection</p>
      </div>
    </div>
    <div className={`w-12 h-6 rounded-full relative transition-colors ${enabled ? 'bg-emerald-500' : 'bg-slate-200'}`}>
       <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${enabled ? 'left-7 shadow-lg' : 'left-1'}`} />
    </div>
  </div>
);

const Input = ({ label, icon, error, ...props }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 flex justify-between">
      {label}
      {error && <span className="text-rose-500 italic text-[9px] lowercase tracking-normal">{error}</span>}
    </label>
    <div className="relative group">
      {icon && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors">{icon}</span>}
      <input 
        {...props}
        onChange={(e) => props.onChange(e.target.value)}
        className={`w-full h-12 outline-none rounded-xl text-sm font-bold transition-all
          ${icon ? 'pl-11 pr-4' : 'px-5'}
          ${error 
            ? 'bg-rose-50/30 border border-rose-300 ring-4 ring-rose-50 text-rose-900' 
            : 'bg-slate-50/50 border border-slate-100 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-50'}
        `}
      />
    </div>
  </div>
);

const SummaryPoint = ({ label, value, time }) => (
  <div className="flex justify-between items-start">
    <div>
      <p className="text-xs font-black text-slate-800">{value || '--'}</p>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{label}</p>
    </div>
    <p className="text-xs font-bold text-slate-400">{time || '--'}</p>
  </div>
);

export default Checkout;
