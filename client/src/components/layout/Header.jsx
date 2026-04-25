import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Bus, User, LogOut, Menu, X, 
  ChevronDown, BookOpen, Headset, ShieldCheck, ChevronRight 
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const Header = ({ variant = 'light' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  // Detect scroll to trigger theme mutation
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Compute active theme: Force 'light' on scroll for readability
  const activeVariant = isScrolled ? 'light' : variant;
  const isDark = activeVariant === 'dark';

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowProfile(false);
  };

  const navLinks = [
    { name: 'My Bookings', path: '/my-bookings' },
    { name: 'Help', path: '/help' },
    { name: 'Safety', path: '/safety' },
  ];

  return (
    <header 
      className={`fixed top-0 w-full z-[100] transition-all duration-300 border-b
        ${isDark 
          ? 'bg-transparent border-transparent pt-6 pb-2' 
          : 'bg-white/90 backdrop-blur-md border-slate-100 py-3 shadow-sm'}
      `}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
        
        {/* LOGO SECTION */}
        <Link to="/" className="flex items-center gap-3 transition-transform active:scale-95 group">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg
            ${isDark ? 'bg-white text-slate-900' : 'bg-primary-500 text-white shadow-primary-500/20'}
          `}>
            <Bus className="w-6 h-6" />
          </div>
          <span className={`text-2xl font-black tracking-tighter transition-colors
            ${isDark ? 'text-white' : 'text-slate-900'}
          `}>
            Smart<span className={isDark ? 'text-white/60' : 'text-primary-500'}>Bus</span>
          </span>
        </Link>

        {/* NAVIGATION LINKS */}
        <nav className="hidden lg:flex items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all
                ${location.pathname === link.path 
                  ? (isDark ? 'bg-white/10 text-white' : 'bg-primary-50 text-primary-500') 
                  : (isDark ? 'text-white/60 hover:text-white hover:bg-white/5' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50')}
              `}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* ACTION AREA */}
        <div className="flex items-center gap-4">
          
          {isAuthenticated ? (
            <div className="relative">
              <button 
                onClick={() => setShowProfile(!showProfile)}
                className={`flex items-center gap-2 p-1 pr-3 border rounded-2xl transition-all group
                  ${isDark 
                    ? 'bg-white/10 border-white/10 hover:bg-white/20' 
                    : 'bg-slate-50 border-slate-100 hover:bg-slate-100'}
                `}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shadow-sm
                  ${isDark ? 'bg-white text-slate-950' : 'bg-primary-500 text-white'}
                `}>
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <span className={`text-xs font-black hidden sm:inline ${isDark ? 'text-white' : 'text-slate-700'}`}>
                   {user?.name?.split(' ')[0]}
                </span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showProfile ? 'rotate-180' : ''} ${isDark ? 'text-white/40' : 'text-slate-300'}`} />
              </button>

              {showProfile && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowProfile(false)} />
                  <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-100 rounded-[2rem] shadow-2xl overflow-hidden z-20 animate-zoom-in">
                    <div className="p-6 border-b border-slate-50">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Signed in as</p>
                       <p className="text-sm font-black text-slate-800 truncate">{user?.email}</p>
                    </div>
                    <div className="p-2">
                       <DropdownItem to="/profile" icon={<User className="w-4 h-4" />} label="Profile Manager" onClick={() => setShowProfile(false)} />
                       <DropdownItem to="/my-bookings" icon={<BookOpen className="w-4 h-4" />} label="Trip Records" onClick={() => setShowProfile(false)} />
                       <button onClick={handleLogout} className="w-full flex items-center gap-4 px-5 py-4 rounded-xl text-xs font-black text-rose-500 hover:bg-rose-50 transition-all text-left">
                         <LogOut className="w-4 h-4" /> Final Sign Out
                       </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link 
              to="/login"
              className={`px-8 py-3 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-xl
                ${isDark 
                  ? 'bg-white text-slate-950 hover:bg-primary-500 hover:text-white' 
                  : 'bg-primary-500 text-white hover:bg-slate-900 shadow-primary-500/20'}
              `}
            >
              Start Booking
            </Link>
          )}

          {/* Toggle Menu */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-3 border rounded-2xl transition-all
              ${isDark ? 'bg-white/10 border-white/10 text-white' : 'bg-slate-50 border-slate-100 text-slate-600'}
            `}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div className={`fixed inset-0 top-[76px] z-[90] lg:hidden animate-fade-in
          ${isDark ? 'bg-slate-950' : 'bg-white'}
        `}>
           <div className="p-10 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between p-6 rounded-3xl font-black text-lg transition-all
                    ${isDark ? 'bg-white/5 text-white' : 'bg-slate-50 text-slate-900'}
                  `}
                >
                  {link.name}
                  <ChevronRight className="w-5 h-5 opacity-30" />
                </Link>
              ))}
              {!isAuthenticated && (
                <Link to="/login" onClick={() => setIsOpen(false)} className="mt-6 py-6 bg-primary-500 rounded-3xl text-white font-black text-center text-lg">
                  Join SmartBus
                </Link>
              )}
           </div>
        </div>
      )}
    </header>
  );
};

const DropdownItem = ({ to, icon, label, onClick }) => (
  <Link to={to} onClick={onClick} className="flex items-center gap-4 px-5 py-4 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 hover:text-primary-600 transition-all">
    {icon} {label}
  </Link>
);


export default Header;
