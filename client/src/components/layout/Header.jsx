import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bus, Phone, HelpCircle, Menu, X, User, Ticket } from 'lucide-react';
import { useBookingStore } from '../../store/useBookingStore';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const resetBooking = useBookingStore((s) => s.resetBooking);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = location.pathname === '/';

  const handleLogoClick = () => {
    resetBooking();
    navigate('/');
  };

  return (
    <header
      className={[
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled || !isHome
          ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-slate-100 py-3'
          : 'bg-transparent py-5',
      ].join(' ')}
    >
      <div className="container-max">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center group-hover:bg-primary-600 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-primary-500/20">
              <Bus className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col items-start leading-none">
              <span
                className={[
                  'text-xl md:text-2xl font-black tracking-tight transition-colors',
                  scrolled || !isHome ? 'text-slate-900' : 'text-white',
                ].join(' ')}
              >
                Bus<span className="text-primary-500">Go</span>
              </span>
              <span className={[
                'text-[8px] md:text-[10px] font-bold uppercase tracking-widest transition-colors',
                scrolled || !isHome ? 'text-slate-400' : 'text-white/50',
              ].join(' ')}>
                Travel India
              </span>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6 pr-6 border-r border-slate-200/50">
              {[
                { label: 'Help', icon: <HelpCircle className="w-4 h-4" />, href: '#' },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={[
                    'flex items-center gap-1.5 text-sm font-semibold transition-all hover:translate-y-[-1px]',
                    scrolled || !isHome ? 'text-slate-600 hover:text-primary-500' : 'text-white/80 hover:text-white',
                  ].join(' ')}
                >
                  {item.icon}
                  {item.label}
                </a>
              ))}
              <Link
                to="/contact"
                className={[
                  'flex items-center gap-1.5 text-sm font-semibold transition-all hover:translate-y-[-1px]',
                  scrolled || !isHome ? 'text-slate-600 hover:text-primary-500' : 'text-white/80 hover:text-white',
                ].join(' ')}
              >
                <Phone className="w-4 h-4" />
                Contact
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link 
                to="/my-bookings"
                className={[
                  'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all',
                  scrolled || !isHome ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10'
                ].join(' ')}
              >
                <Ticket className="w-4 h-4" />
                My Bookings
              </Link>
              <Link 
                to="/login"
                className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary-500/25 transition-all hover:scale-105 active:scale-95"
              >
                <User className="w-4 h-4" />
                Login
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className={[
              'md:hidden p-2.5 rounded-xl transition-all',
              scrolled || !isHome ? 'bg-slate-100 text-slate-700' : 'bg-white/10 text-white'
            ].join(' ')}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-modal border-t border-slate-100 p-6 space-y-4 animate-slide-up">
          <a href="#" className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 text-slate-700 font-bold hover:bg-primary-50 hover:text-primary-600 transition-colors">
            <HelpCircle className="w-5 h-5 text-primary-500" /> Help Center
          </a>
          <Link 
            to="/contact" 
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 text-slate-700 font-bold hover:bg-primary-50 hover:text-primary-600 transition-colors"
          >
            <Phone className="w-5 h-5 text-primary-500" /> Contact Support
          </Link>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <Link 
              to="/my-bookings"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center p-4 rounded-2xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-colors"
            >
              My Bookings
            </Link>
            <Link 
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center p-4 rounded-2xl bg-primary-500 text-white font-bold text-sm hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/20"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
