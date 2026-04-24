import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Bus, Phone, HelpCircle, Menu, X, User, Ticket, LogOut, Settings, UserCircle, ChevronDown, Sun, Moon, Languages } from 'lucide-react';
import { useBookingStore } from '../../store/useBookingStore';
import { useAuthStore } from '../../store/useAuthStore';

const Header = () => {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const dropdownRef = useRef(null);
  const langRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const resetBooking = useBookingStore((s) => s.resetBooking);
  const { isAuthenticated, user, logout } = useAuthStore();
  
  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'ta', label: 'தமிழ்' },
    { code:  'te', label: 'తెలుగు' },
    { code: 'kn', label: 'ಕನ್ನಡ' }
  ];

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isHome = location.pathname === '/';

  const handleLogoClick = () => {
    resetBooking();
    navigate('/');
  };

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setLangOpen(false);
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/');
  };

  const NavLink = ({ to, icon, label }) => (
    <Link
      to={to}
      className={[
        'flex items-center gap-1.5 text-sm font-semibold transition-all hover:translate-y-[-1px]',
        scrolled || !isHome ? 'text-slate-600 hover:text-primary-500' : 'text-white/80 hover:text-white',
      ].join(' ')}
    >
      {icon}
      {label}
    </Link>
  );

  return (
    <header
      className={[
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled || !isHome
          ? 'bg-background/80 backdrop-blur-xl shadow-sm border-b border-card-border py-3'
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
                  scrolled || !isHome ? 'text-foreground' : 'text-white',
                ].join(' ')}
              >
                Smart<span className="text-primary-500">Bus</span>
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
          <nav className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-5 pr-5 border-r border-slate-200/50">


              {/* Language Switcher */}
              <div className="relative" ref={langRef}>
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className={[
                    'flex items-center gap-1.5 p-2 rounded-xl transition-all',
                    scrolled || !isHome ? 'text-slate-600 hover:bg-slate-100' : 'text-white/80 hover:bg-white/10'
                  ].join(' ')}
                >
                  <Languages className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">{(i18n.language || 'en').split('-')[0]}</span>
                </button>

                {langOpen && (
                  <div className="absolute top-full mt-2 left-0 w-32 bg-white rounded-xl shadow-modal border border-slate-100 overflow-hidden z-[60] animate-in fade-in zoom-in duration-200">
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => changeLanguage(l.code)}
                        className={[
                          'w-full text-left px-4 py-2 text-xs font-bold transition-colors',
                          i18n.language === l.code ? 'bg-primary-500/10 text-primary-500' : 'text-slate-600 hover:bg-slate-50'
                        ].join(' ')}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <NavLink to="/contact" icon={<Phone className="w-4 h-4" />} label={t('common.contact')} />
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
                {t('common.myBookings')}
              </Link>
              
              {isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className={[
                      'flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300',
                      scrolled || !isHome 
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200' 
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                    ].join(' ')}
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-xs ring-2 ring-white/20 shadow-inner">
                      {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </div>
                    <span className="text-sm font-bold truncate max-w-[100px]">
                      {user?.name?.split(' ')[0] || 'Profile'}
                    </span>
                    <ChevronDown className={["w-4 h-4 transition-transform duration-300", profileOpen ? 'rotate-180' : ''].join(' ')} />
                  </button>

                  {/* Dropdown Menu */}
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[60] animate-in fade-in zoom-in duration-200 origin-top-right">
                      <div className="p-4 bg-slate-50 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Signed in as</p>
                        <p className="font-bold text-slate-900 truncate">{user?.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      </div>
                      <div className="p-2">
                        <Link 
                          to="/profile" 
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                            <UserCircle className="w-4 h-4 text-blue-500" />
                          </div>
                          {t('common.profile')}
                        </Link>
                        <Link 
                          to="/my-bookings" 
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                            <Ticket className="w-4 h-4 text-orange-500" />
                          </div>
                          {t('common.myBookings')}
                        </Link>
                        <Link 
                          to="/profile?tab=settings" 
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                            <Settings className="w-4 h-4 text-slate-500" />
                          </div>
                          Settings
                        </Link>
                      </div>
                      <div className="p-2 border-t border-slate-100 bg-slate-50/30">
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                            <LogOut className="w-4 h-4 text-red-500" />
                          </div>
                          {t('common.logout')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  to="/login"
                  className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary-500/25 transition-all hover:scale-105 active:scale-95"
                >
                  <User className="w-4 h-4" />
                  {t('common.login')}
                </Link>
              )}
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
          {isAuthenticated && (
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-2">
              <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold ring-4 ring-white shadow-lg">
                {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
            </div>
          )}

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
          
          <div className="grid grid-cols-1 gap-3 pt-2">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-colors"
                >
                  <UserCircle className="w-5 h-5 text-slate-500" /> Account Details
                </Link>
                <Link 
                  to="/my-bookings"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-colors"
                >
                  <Ticket className="w-5 h-5 text-slate-500" /> My Bookings
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 transition-colors mt-2"
                >
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center p-4 rounded-2xl bg-primary-500 text-white font-bold text-sm hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/20"
              >
                Login to Account
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

