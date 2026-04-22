import React from 'react';
import AdminSidebar from './AdminSidebar';
import { Bell, Search, Settings } from 'lucide-react';

const AdminLayout = ({ children, title = 'Admin Dashboard' }) => (
  <div className="flex bg-slate-50 min-h-screen">
    {/* Sidebar */}
    <AdminSidebar />

    {/* Main Content Area */}
    <div className="flex-1 flex flex-col min-w-0">
      {/* Top Header */}
      <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-30">
        <h2 className="text-2xl font-black text-slate-900">{title}</h2>
        
        <div className="flex items-center gap-6">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search administration..." 
              className="bg-slate-100 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary-500 w-64 transition-all"
            />
          </div>
          
          <button className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
          </button>
          
          <button className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Page Content */}
      <main className="p-8">
        {children}
      </main>
    </div>
  </div>
);

export default AdminLayout;
