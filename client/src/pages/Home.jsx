import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Calendar, ArrowLeftRight, Search, ChevronRight, ShieldCheck, Zap, Headphones, CreditCard, Bus } from 'lucide-react';
import { format, addDays } from 'date-fns';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/ui/Button';
import { useBookingStore } from '../store/useBookingStore';
import { POPULAR_ROUTES } from '../utils/constants';
import { tripService } from '../services/tripService';
import staticCities from '../data/cities.json';

const MIN_DATE = format(new Date(), 'yyyy-MM-dd');
const DEFAULT_DATE = format(addDays(new Date(), 1), 'yyyy-MM-dd');

/** City autocomplete input */
const CityInput = ({ id, label, value, onChange, placeholder, icon: Icon, cities }) => {
  const [open, setOpen] = useState(false);
  const filtered = value.length > 0
    ? cities.filter((c) => c.toLowerCase().includes(value.toLowerCase()) && c.toLowerCase() !== value.toLowerCase()).slice(0, 6)
    : [];

  return (
    <div className="relative flex-1 min-w-0" style={{ zIndex: 9999 }}>
      <label htmlFor={id} className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors">
          <Icon className="w-full h-full" />
        </div>
        <input
          id={id}
          value={value}
          onChange={(e) => { onChange(e.target.value); setOpen(true); }}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full pl-12 pr-4 py-4 rounded-2xl text-slate-900 text-base font-bold bg-white border-2 border-transparent focus:border-primary-500 focus:outline-none transition-all shadow-sm placeholder:text-slate-300"
        />
      </div>
      {open && filtered.length > 0 && (
        <ul 
          className="absolute top-full mt-2 left-0 right-0 rounded-2xl border border-slate-200 overflow-hidden animate-fade-in py-1 shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
          style={{ backgroundColor: 'white', opacity: 1, zIndex: 99999 }}
        >
          {filtered.map((city) => (
            <li key={city} style={{ backgroundColor: 'white' }}>
              <button
                type="button"
                onMouseDown={() => { onChange(city); setOpen(false); }}
                className="w-full text-left px-5 py-4 text-sm font-bold text-slate-900 hover:bg-slate-50 hover:text-primary-600 flex items-center gap-4 transition-all group"
                style={{ backgroundColor: 'white' }}
              >
                <div className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-primary-50 flex items-center justify-center text-slate-400 group-hover:text-primary-500 transition-colors">
                  <MapPin className="w-5 h-5 transition-transform group-hover:scale-110" />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-bold uppercase tracking-tight">{city}</span>
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Available Station</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const Home = () => {
  const { t } = useTranslation();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState(DEFAULT_DATE);
  const [error, setError] = useState('');
  const [dynamicCities, setDynamicCities] = useState(staticCities);
  const navigate = useNavigate();
  const setSearchParams = useBookingStore((s) => s.setSearchParams);

  // Fetch unique locations on mount
  useEffect(() => {
    const loadLocations = async () => {
      const liveLocations = await tripService.getLocations();
      if (liveLocations && liveLocations.length > 0) {
        // Merge with static list and remove duplicates
        const merged = Array.from(new Set([...staticCities, ...liveLocations]));
        setDynamicCities(merged);
      }
    };
    loadLocations();
  }, []);

  const handleSwap = () => { setFrom(to); setTo(from); };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!from.trim() || !to.trim()) { setError('Please enter both source and destination.'); return; }
    if (from.toLowerCase() === to.toLowerCase()) { setError('Source and destination cannot be the same.'); return; }
    if (!date) { setError('Please select a travel date.'); return; }
    setError('');
    setSearchParams({ from: from.trim(), to: to.trim(), date });
    navigate('/buses');
  };

  const handlePopularRoute = ({ from: f, to: t }) => {
    setFrom(f); setTo(t); setDate(DEFAULT_DATE);
  };

  return (
    <PageWrapper isTransparent>
      {/* Hero */}
      <section className="hero-gradient min-h-[85vh] flex flex-col items-center justify-center px-4 relative overflow-hidden pt-32">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -right-20 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 -left-20 w-[400px] h-[400px] bg-accent-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto text-center px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 text-xs font-bold uppercase tracking-widest mb-8 shadow-xl backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
            {t('hero.badge')}
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tight px-2">
            {t('hero.title').split('.')[0]}.<br className="hidden sm:block" />
            <span className="text-gradient">{t('hero.title').split('.')[1]}</span>
          </h1>
          
          <p className="text-slate-300 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            {t('hero.subtitle')}
          </p>

          {/* Search Card */}
          <div className="relative z-[100] max-w-5xl mx-auto mt-10 md:mt-16 w-full">
            <div className="absolute -inset-2 bg-gradient-to-r from-primary-600/20 to-accent-600/20 rounded-[2.5rem] blur-xl opacity-50" />
            
            <form 
              onSubmit={handleSearch} 
              className="relative z-[200] bg-[#0f172a] rounded-[2.2rem] p-5 md:p-8 shadow-2xl border border-white/10"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 items-end">
                {/* From Field */}
                <div className="lg:col-span-3">
                  <CityInput 
                    id="from" 
                    label={t('common.from')} 
                    value={from} 
                    onChange={setFrom} 
                    placeholder={t('search.placeholderFrom')} 
                    icon={MapPin} 
                    cities={dynamicCities}
                  />
                </div>

                {/* Swap Button - Desktop: Absolute Center / Mobile: Inline */}
                <div className="flex justify-center items-center lg:col-span-1 h-14 md:h-20 lg:h-auto">
                   <button
                    type="button"
                    onClick={handleSwap}
                    className="w-12 h-12 bg-slate-50 hover:bg-primary-500 border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-all duration-500 hover:rotate-180 hover:shadow-lg hover:shadow-primary-500/20 group"
                    aria-label="Swap cities"
                  >
                    <ArrowLeftRight className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </button>
                </div>

                {/* To Field */}
                <div className="lg:col-span-3">
                  <CityInput 
                    id="to" 
                    label={t('common.to')} 
                    value={to} 
                    onChange={setTo} 
                    placeholder={t('search.placeholderTo')} 
                    icon={MapPin} 
                    cities={dynamicCities}
                  />
                </div>

                {/* Date Picker */}
                <div className="lg:col-span-3">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1">
                    Departure Date
                  </label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors pointer-events-none" />
                    <input
                      type="date"
                      value={date}
                      min={MIN_DATE}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl text-foreground text-sm md:text-base font-bold bg-surface border-2 border-transparent focus:border-primary focus:bg-card focus:outline-none transition-all shadow-sm"
                    />
                  </div>
                </div>

                {/* Search Button */}
                <div className="lg:col-span-2">
                  <button
                    type="submit"
                    className="w-full h-[60px] bg-primary-500 hover:bg-primary-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
                  >
                    <Search className="w-5 h-5" />
                    <span>{t('search.button')}</span>
                  </button>
                </div>
              </div>

              {error && (
                <div className="mt-6 px-5 py-3 bg-red-50 border border-red-100 rounded-2xl text-xs font-bold text-red-500 flex items-center gap-3 animate-fade-in">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  {error}
                </div>
              )}
            </form>
          </div>

          {/* Popular Routes */}
          <div className="mt-16 md:mt-24 w-full relative z-[1]">
            <p className="text-slate-500 text-[10px] uppercase tracking-[0.4em] font-black mb-8">
              Popular Destinations in India
            </p>
            <div className="flex flex-wrap gap-2 md:gap-4 justify-center px-2">
              {POPULAR_ROUTES.slice(0, 5).map((route) => (
                <button
                  key={`${route.from}-${route.to}`}
                  onClick={() => handlePopularRoute(route)}
                  className="group flex items-center gap-2 md:gap-3 px-4 md:px-6 py-3 md:py-4 bg-slate-800/50 hover:bg-primary-600/20 border border-white/10 rounded-xl md:rounded-2xl text-white transition-all hover:translate-y-[-4px]"
                >
                  <span className="text-slate-400 group-hover:text-primary-400 transition-colors font-bold text-xs md:text-sm">{route.from}</span>
                  <ChevronRight className="w-3 md:w-3.5 h-3 md:h-3.5 text-white/20" />
                  <span className="font-bold text-xs md:text-sm">{route.to}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features - Elite Grid */}
      <section className="container-max py-24 md:py-32 relative">
        <div className="text-center mb-16 md:mb-24">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-[10px] font-black uppercase tracking-widest mb-6">
            Our Standards
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-foreground mb-6 tracking-tight">The SmartBus Experience</h2>
          <p className="text-muted font-medium max-w-xl mx-auto text-base md:text-lg leading-relaxed">
            Why millions of travelers prefer us for their inter-city journeys 
            across India's most complex routes.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {[
            { icon: <ShieldCheck />, title: 'Safe & Secure', desc: 'Every booking is protected. We partner only with verified high-rated operators.', color: 'text-emerald-500', bg: 'bg-emerald-50' },
            { icon: <Zap />, title: 'Lightning Fast', desc: 'Instant confirmation and real-time seat availability across 10,000+ routes.', color: 'text-amber-500', bg: 'bg-amber-50' },
            { icon: <Headphones />, title: '24/7 Support', desc: 'Need help? Our dedicated travel experts are available around the clock.', color: 'text-primary-500', bg: 'bg-primary-50' },
            { icon: <CreditCard />, title: 'Easy Refunds', desc: 'Simplified cancellation policy with instant refunds processed to your source.', color: 'text-indigo-500', bg: 'bg-indigo-50' },
          ].map((f) => (
            <div key={f.title} className="group p-8 md:p-10 bg-card rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-card-border transition-all duration-500 hover:shadow-modal hover:translate-y-[-12px]">
              <div className={[`w-14 md:w-16 h-14 md:h-16 rounded-2xl ${f.bg} ${f.color} flex items-center justify-center mb-6 md:mb-8 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`].join(' ')}>
                {React.cloneElement(f.icon, { className: 'w-7 md:w-8 h-7 md:h-8' })}
              </div>
              <h3 className="text-xl md:text-2xl font-black text-foreground mb-3 md:mb-4 tracking-tight">{f.title}</h3>
              <p className="text-muted text-sm md:text-base font-medium leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Quote */}
      <section className="container-max pb-32">
        <div className="relative bg-slate-900 rounded-[3rem] p-10 md:p-24 text-center overflow-hidden shadow-modal">
           {/* Background Decoration */}
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
             <Bus className="w-80 h-80 text-white -rotate-12 translate-x-20 -translate-y-10" />
           </div>
           <div className="absolute bottom-0 left-0 p-12 opacity-[0.03] pointer-events-none">
             <Bus className="w-64 h-64 text-white rotate-12 -translate-x-10 translate-y-20" />
           </div>

           <div className="relative z-10 max-w-3xl mx-auto">
             <div className="flex justify-center mb-10">
               {[1, 2, 3, 4, 5].map((i) => (
                 <svg key={i} className="w-6 h-6 text-amber-400 fill-current" viewBox="0 0 20 20">
                   <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                 </svg>
               ))}
             </div>
             
             <h3 className="text-3xl md:text-5xl font-black text-white mb-10 leading-tight">
               "The best bus booking experience<br className="hidden md:block"/> I've ever had in India."
             </h3>
             
             <div className="flex flex-col items-center">
               <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 mb-6 p-1 flex items-center justify-center border-4 border-white/10">
                 <span className="text-white font-black text-2xl">RS</span>
               </div>
               <p className="text-white font-black tracking-[0.3em] uppercase text-xs">Rahul Sharma</p>
               <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.4em] mt-3">Frequent Traveler • Verified User</p>
             </div>
           </div>
        </div>
      </section>
    </PageWrapper>
  );
};

export default Home;
