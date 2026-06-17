import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Bus, User, HelpCircle, ClipboardList, 
  ChevronDown, LogIn, UserPlus, Globe, 
  Shield, Headset, LogOut, Check, Moon, Sun
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी (Hindi)' },
  { code: 'ta', label: 'தமிழ் (Tamil)' },
  { code: 'te', label: 'తెలుగు (Telugu)' },
  { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
];

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLanguageList, setShowLanguageList] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsDropdownOpen(false);
  };

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setShowLanguageList(false);
    setIsDropdownOpen(false);
  };

  const menuItems = isAuthenticated ? [
    { label: 'Profile', icon: <User className="w-4 h-4" />, path: '/profile' },
    { label: 'My Bookings', icon: <ClipboardList className="w-4 h-4" />, path: '/my-bookings' },
    { divider: true },
    { label: 'Language', icon: <Globe className="w-4 h-4" />, action: () => setShowLanguageList(!showLanguageList) },
    { label: 'Help', icon: <HelpCircle className="w-4 h-4" />, path: '/help' },
    { label: 'Safety', icon: <Shield className="w-4 h-4" />, path: '/safety' },
    { label: 'Contact Support', icon: <Headset className="w-4 h-4" />, path: '/contact' },
    { divider: true },
    { label: 'Logout', icon: <LogOut className="w-4 h-4" />, action: handleLogout, danger: true },
  ] : [
    { label: 'Login', icon: <LogIn className="w-4 h-4" />, path: '/login' },
    { label: 'Signup', icon: <UserPlus className="w-4 h-4" />, path: '/signup' },
    { divider: true },
    { label: 'Language', icon: <Globe className="w-4 h-4" />, action: () => setShowLanguageList(!showLanguageList) },
    { label: 'Help', icon: <HelpCircle className="w-4 h-4" />, path: '/help' },
    { label: 'Safety', icon: <Shield className="w-4 h-4" />, path: '/safety' },
    { label: 'Contact Support', icon: <Headset className="w-4 h-4" />, path: '/contact' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setShowLanguageList(false);
      }
    };

    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
        setShowLanguageList(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 z-[100] px-6 transition-colors">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
        
        <Link to="/" className="flex items-center gap-2 group transition-transform active:scale-95">
          <div className="bg-red-500 p-2 rounded-lg text-white shadow-lg shadow-red-500/20">
            <Bus className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Smart<span className="text-red-500">Bus</span>
          </span>
        </Link>

        <nav className="flex items-center gap-8">
          <NavLink to="/my-bookings" className="flex items-center gap-2 group">
             <ClipboardList className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-red-500 transition-colors" />
             <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-red-500 transition-colors">Bookings</span>
          </NavLink>

          <NavLink to="/help" className="flex items-center gap-2 group">
             <HelpCircle className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-red-500 transition-colors" />
             <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-red-500 transition-colors">Help</span>
          </NavLink>

          <div className="relative flex items-center gap-4" ref={dropdownRef}>
            <button
              onClick={() => {
                const currentTheme = useThemeStore.getState().theme;
                useThemeStore.getState().setTheme(currentTheme === 'dark' ? 'light' : 'dark');
              }}
              className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-slate-800 transition-colors"
            >
              {useThemeStore((s) => s.theme) === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
          
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  isDropdownOpen ? 'bg-slate-100 dark:bg-slate-800 text-red-500' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
              <div className={`p-1 rounded-full ${isAuthenticated ? 'bg-red-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                <User className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold">
                {isAuthenticated ? user?.name?.split(' ')[0] : 'Account'}
              </span>
              <ChevronDown className={`w-4 h-4 opacity-50 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-2xl py-2 z-[110] animate-in fade-in zoom-in duration-150 origin-top-right">
                {!showLanguageList ? (
                  <ul role="menu">
                    {menuItems.map((item, index) => {
                      if (item.divider) return <li key={index} className="h-px bg-slate-100 dark:bg-slate-800 my-2 mx-2" />;
                      return (
                        <li key={item.label} role="none">
                          <button
                            role="menuitem"
                            onClick={() => {
                              if (item.action) item.action();
                              if (item.path) {
                                navigate(item.path);
                                setIsDropdownOpen(false);
                              }
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all
                              ${item.danger ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-red-500'}
                            `}
                          >
                            <span className="opacity-70">{item.icon}</span>
                            {item.label}
                            {item.label === 'Language' && (
                              <span className="ml-auto text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-400 uppercase">
                                {i18n.language}
                              </span>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="animate-in slide-in-from-right-4 duration-200">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Language</span>
                       <button onClick={() => setShowLanguageList(false)} className="text-[10px] font-bold text-red-500 hover:underline">Back</button>
                    </div>
                    <ul className="py-1">
                      {languages.map((lang) => (
                        <li key={lang.code}>
                          <button
                            onClick={() => changeLanguage(lang.code)}
                            className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-red-500 transition-all"
                          >
                            {lang.label}
                            {i18n.language === lang.code && <Check className="w-4 h-4 text-emerald-500" />}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
