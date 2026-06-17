import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { Bell, Search, Settings, Menu, Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';

const AdminLayout = ({ children, title = 'Admin Dashboard' }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex bg-slate-50 dark:bg-slate-950 h-screen overflow-hidden relative transition-colors">
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] lg:hidden animate-fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed/Sticky Container */}
      <div className={`
        fixed inset-y-0 left-0 z-[70] w-72 transition-transform duration-500 transform lg:translate-x-0 lg:static lg:inset-auto lg:h-full lg:block
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <AdminSidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Container Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header - Always Fixed */}
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8 z-30 flex-shrink-0 transition-colors">
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setIsSidebarOpen(true)}
               className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-500 dark:text-slate-400"
             >
                <Menu className="w-6 h-6" />
             </button>
             <h2 className="text-lg lg:text-2xl font-black text-slate-900 dark:text-slate-100 truncate tracking-tight">{title}</h2>
          </div>
          
          <div className="flex items-center gap-3 lg:gap-6">
            <button 
              onClick={() => {
                const currentTheme = useThemeStore.getState().theme;
                useThemeStore.getState().setTheme(currentTheme === 'dark' ? 'light' : 'dark');
              }}
              className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {useThemeStore((s) => s.theme) === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            <button className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
            </button>
            
            <Link 
              to="/admin/settings"
              className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </Link>
          </div>
        </header>

        {/* Page Content - ONLY THIS SCROLLS */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-10 bg-slate-50/50 dark:bg-slate-950/50 transition-colors">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
