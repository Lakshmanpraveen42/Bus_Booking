import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Users, Mail, Phone, Calendar, Shield, Search, Filter, MoreHorizontal, UserCheck, UserX } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import api from '../../services/api';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout title="User Database">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search users by name or email..." 
            className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary-500 transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 uppercase italic">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 tracking-widest">User Details</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 tracking-widest">Status/Role</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 tracking-widest">Contact</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center text-slate-400 font-bold uppercase tracking-widest">
                    Accessing user records...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center text-slate-400 font-bold uppercase tracking-widest">
                    No users found
                  </td>
                </tr>
              ) : filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-500 font-black text-lg border border-primary-100">
                        {user.full_name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-black text-slate-900">{user.full_name}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase mt-0.5">ID: {user.id} • Customer Since 2024</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={user.is_admin ? "primary" : "secondary"}>
                          {user.is_admin ? "ADMIN" : "CUSTOMER"}
                        </Badge>
                        <Badge variant="success" size="sm">ACTIVE</Badge>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-slate-600 text-sm font-bold">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 text-xs font-bold italic">
                        <Phone className="w-3.5 h-3.5" />
                        +91 98765 43210
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 text-slate-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageUsers;
