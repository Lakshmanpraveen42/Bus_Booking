import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Bus, Map, Ticket, Users, Settings, LogOut, X } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const AdminSidebar = ({ onClose }) => {
  const location = useLocation();
  const { logout } = useAuthStore();

  const menuItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Overview', path: '/admin' },
    { icon: <Map className="w-5 h-5" />, label: 'Route Templates', path: '/admin/routes' },
    { icon: <Ticket className="w-5 h-5" />, label: 'Trip Scheduler', path: '/admin/trips' },
    { icon: <Bus className="w-5 h-5" />, label: 'Fleet Manager', path: '/admin/buses' },
    { icon: <Users className="w-5 h-5" />, label: 'User Database', path: '/admin/users' },
  ];

  return (
    <div className="w-72 bg-slate-950 min-h-screen flex flex-col border-r border-white/5 sticky top-0">
      {/* Admin Logo */}
      <div className="p-8 pb-12 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
            <Bus className="w-6 h-6 text-white" />
          </div>
          <span className="text-white font-black text-2xl tracking-tight">SmartBus</span>
        </Link>
        <button onClick={onClose} className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors">
           <X className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 1024) { // Only close if on mobile/tablet
                  onClose();
                }
              }}
              className={`flex items-center gap-4 px-4 py-4 rounded-2xl font-bold transition-all duration-300 group ${
                isActive 
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className={`transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                {item.icon}
              </div>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-6 border-t border-white/5 bg-slate-950/50">
        <div className="flex items-center gap-3 p-4 mb-4 bg-white/5 rounded-2xl">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white text-xs border border-white/10">
            AD
          </div>
          <div>
            <p className="text-white text-sm font-bold leading-none">Admin User</p>
            <p className="text-slate-500 text-[10px] uppercase font-black mt-1 tracking-widest">Master Control</p>
          </div>
        </div>
        
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 font-bold hover:text-white hover:bg-white/5 rounded-xl transition-all"
        >
          <LogOut className="w-5 h-5 text-rose-500" />
          Log Out
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
