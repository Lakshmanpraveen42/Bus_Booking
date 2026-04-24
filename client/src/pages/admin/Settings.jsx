import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Mail, Shield, Save, Loader2, CheckCircle2, AlertCircle, Globe, Lock, Bell } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const Settings = () => {
  const [settings, setSettings] = useState({
    admin_contact_email: '',
    system_notifications: 'true',
    maintenance_mode: 'false'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/settings');
      if (Object.keys(res.data).length > 0) {
        setSettings(prev => ({ ...prev, ...res.data }));
      }
    } catch (err) {
      console.error('Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.post('/admin/settings', settings);
      toast.success('Settings updated successfully!', {
        style: {
          background: '#0f172a',
          color: '#fff',
          borderRadius: '16px',
          fontWeight: '900',
          textTransform: 'uppercase',
          fontSize: '12px',
          letterSpacing: '1px'
        }
      });
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="System Settings">
         <div className="h-96 flex flex-col items-center justify-center text-slate-400 gap-4 uppercase font-black tracking-widest text-xs italic">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            Decrypting Configuration...
         </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="System Settings">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSave} className="space-y-8">
          {/* Contact Configuration Section */}
          <section className="bg-white rounded-[32px] border border-slate-100 shadow-xl overflow-hidden">
            <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-primary-500 text-white flex items-center justify-center shadow-lg shadow-primary-500/20">
                  <Mail className="w-5 h-5" />
               </div>
               <div>
                  <h3 className="font-black text-slate-900 uppercase tracking-tight">Communication Control</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase italic">Configure inquiry routing & customer contact</p>
               </div>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Admin Contact Email</label>
                <div className="relative">
                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                   <input 
                     type="email" 
                     placeholder="admin@smartbus.com"
                     className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                     value={settings.admin_contact_email}
                     onChange={(e) => setSettings({ ...settings, admin_contact_email: e.target.value })}
                     required
                   />
                </div>
                <p className="text-[10px] text-slate-400 font-bold italic px-1">All user messages from the "Contact Us" form will be forwarded to this specific address.</p>
              </div>
            </div>
          </section>

          {/* System Security Section */}
          <section className="bg-white rounded-[32px] border border-slate-100 shadow-xl overflow-hidden opacity-60">
             <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                   <Shield className="w-5 h-5" />
                </div>
                <div>
                   <h3 className="font-black text-slate-900 uppercase tracking-tight">Global Restrictions</h3>
                   <p className="text-[10px] font-bold text-slate-400 uppercase italic">Maintenance & Environment Toggles</p>
                </div>
             </div>
             <div className="p-8 flex items-center justify-between">
                <div>
                   <p className="text-sm font-black text-slate-900">Maintenance Mode</p>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Freeze all public bookings & search</p>
                </div>
                <div className="w-12 h-6 bg-slate-200 rounded-full cursor-not-allowed"></div>
             </div>
          </section>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-4 p-8 bg-slate-900 rounded-[32px] shadow-2xl shadow-slate-900/20">
             <div className="mr-auto hidden sm:block">
                <p className="text-xs font-black text-white uppercase italic tracking-widest">Authorization Level: Master Control</p>
                <p className="text-[9px] text-slate-500 font-bold uppercase">Changes affect live production node</p>
             </div>
             
             <button 
               type="submit"
               disabled={saving}
               className="w-full sm:w-auto flex items-center justify-center gap-3 bg-primary-500 text-white px-10 py-4 rounded-2xl font-black hover:bg-primary-600 transition-all shadow-xl shadow-primary-500/20 active:scale-95 disabled:opacity-50"
             >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {saving ? 'UPDATING...' : 'SAVE CONFIGURATION'}
             </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default Settings;
