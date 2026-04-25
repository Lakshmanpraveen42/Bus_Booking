import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  CheckCircle2, Printer, Share2, 
  ArrowLeft, Bus, Calendar, 
  MapPin, User, Ticket, 
  ChevronRight, Download
} from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import { formatPrice } from '../utils/formatters';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state?.booking;

  if (!bookingData) {
    return (
      <PageWrapper className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center space-y-6">
           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
              <Ticket className="w-10 h-10" />
           </div>
           <h2 className="text-2xl font-black text-slate-800">No Booking Found</h2>
           <button onClick={() => navigate('/')} className="text-primary-500 font-bold hover:underline">Return to Home</button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="bg-slate-50 min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        
        {/* Success Header */}
        <div className="text-center mb-12 animate-fade-in">
           <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/30 animate-scale-in">
              <CheckCircle2 className="w-10 h-10 text-white" />
           </div>
           <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Ticket Confirmed!</h1>
           <p className="text-slate-500 font-medium">Your journey on <span className="text-slate-900 font-black">{bookingData.bus_name}</span> is secured.</p>
        </div>

        {/* DIGITAL TICKET CARD */}
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-fade-in-up">
           
           {/* Ticket Top: Booking ID */}
           <div className="bg-slate-900 p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                    <Ticket className="w-6 h-6 text-primary-400" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase text-white/40 tracking-widest leading-none mb-1">Booking Reference</p>
                    <p className="text-xl font-black tracking-tight">#SB_BK_{bookingData.booking_id}</p>
                 </div>
              </div>
              <div className="px-5 py-2.5 bg-emerald-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg">
                 Confirmed
              </div>
           </div>

           <div className="p-10 space-y-10">
              
              {/* Journey Visualization */}
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-8 border-b border-slate-50 pb-10">
                 <div className="text-center md:text-left">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Departure</p>
                    <h3 className="text-2xl font-black text-slate-900 leading-none">{bookingData.source}</h3>
                    <p className="text-xs font-bold text-slate-400 mt-2">Mon, 27 Apr</p>
                 </div>
                 
                 <div className="flex flex-col items-center gap-1.5 opacity-30">
                    <Bus className="w-5 h-5 text-slate-400" />
                    <div className="w-full h-px bg-slate-200 relative">
                       <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1 h-1 rounded-full bg-slate-400" />
                       <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1 h-1 rounded-full bg-slate-400" />
                    </div>
                 </div>

                 <div className="text-center md:text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Destination</p>
                    <h3 className="text-2xl font-black text-slate-900 leading-none">{bookingData.destination}</h3>
                    <p className="text-xs font-bold text-slate-400 mt-2">Arrival Scheduled</p>
                 </div>
              </div>

              {/* Passengers Table */}
              <div>
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <User className="w-3 h-3" /> Passenger Manifest
                 </h4>
                 <div className="space-y-4">
                    {bookingData.passengers.map((p, idx) => (
                       <div key={idx} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:border-primary-200 transition-all">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-slate-400 shadow-sm">
                                {idx + 1}
                             </div>
                             <div>
                                <p className="text-sm font-black text-slate-900">{p.name}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.gender} • {p.age} Yrs</p>
                             </div>
                          </div>
                          <div className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-black group-hover:bg-primary-500 transition-colors">
                             SEAT {p.seat_number}
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

              {/* Footer Summary */}
              <div className="pt-10 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-8">
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Paid</p>
                    <p className="text-3xl font-black text-slate-900 tracking-tighter">{formatPrice(bookingData.price)}</p>
                 </div>
                 <div className="flex gap-4">
                    <button className="flex items-center gap-2 px-6 py-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-xs font-black text-slate-600 transition-all active:scale-95">
                       <Printer className="w-4 h-4" /> Print
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-black rounded-2xl text-xs font-black text-white transition-all shadow-xl shadow-slate-900/20 active:scale-95">
                       <Download className="w-4 h-4" /> E-Ticket
                    </button>
                 </div>
              </div>
           </div>

           {/* Perforation Effect */}
           <div className="relative h-4 bg-slate-50">
              <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center">
                 <div className="w-full border-t-2 border-dashed border-slate-200 px-10" />
              </div>
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-50 rounded-full border border-slate-100" />
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-50 rounded-full border border-slate-100" />
           </div>

           <div className="bg-slate-50/50 p-8 text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] leading-relaxed">
              Scan this ticket at boarding counter • SMS sent to {bookingData.email}
           </div>
        </div>

        <div className="mt-12 flex justify-center">
           <Link to="/my-bookings" className="flex items-center gap-2 text-sm font-black text-primary-500 hover:underline underline-offset-4 group">
              Manage all my bookings <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
           </Link>
        </div>

      </div>
    </PageWrapper>
  );
};

export default BookingConfirmation;
