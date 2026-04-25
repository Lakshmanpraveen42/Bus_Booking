import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Bell, 
  CreditCard, 
  Settings as SettingsIcon, 
  ChevronRight,
  Camera,
  Edit2,
  Eye,
  EyeOff
} from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import { useAuthStore } from '../store/useAuthStore';
import api from '../services/api';
import Modal from '../components/ui/Modal';
import { toast } from 'react-hot-toast';

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ old_password: '', new_password: '', confirm_password: '' });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.new_password !== formData.confirm_password) {
      return toast.error("New passwords don't match");
    }
    
    try {
      setLoading(true);
      await api.post('/auth/change-password', {
        old_password: formData.old_password,
        new_password: formData.new_password
      });
      toast.success("Password changed successfully");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Change Password">
      <form onSubmit={handleSubmit} className="space-y-4 pt-4">
        <div className="space-y-2 relative">
          <label className="text-sm font-bold text-slate-700">Old Password</label>
          <div className="relative">
            <input 
              type={showOldPassword ? "text" : "password"} 
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none pr-10"
              value={formData.old_password}
              onChange={(e) => setFormData({...formData, old_password: e.target.value})}
            />
            <button 
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-500 transition-colors"
            >
              {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div className="space-y-2 relative">
          <label className="text-sm font-bold text-slate-700">New Password</label>
          <div className="relative">
            <input 
              type={showNewPassword ? "text" : "password"} 
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none pr-10"
              value={formData.new_password}
              onChange={(e) => setFormData({...formData, new_password: e.target.value})}
            />
            <button 
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-500 transition-colors"
            >
              {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Confirm New Password</label>
          <input 
            type={showNewPassword ? "text" : "password"} 
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none"
            value={formData.confirm_password}
            onChange={(e) => setFormData({...formData, confirm_password: e.target.value})}
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-4 bg-primary-500 text-white rounded-xl font-bold flex items-center justify-center gap-2"
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </Modal>
  );
};


const Profile = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'account';
  const { user } = useAuthStore();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const tabs = [
    { id: 'account', label: 'Account Details', icon: <User className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> }
  ];

  const handleTabChange = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  return (
    <PageWrapper>
      <div className="py-12 bg-slate-50 min-h-screen">
        <div className="container-max">
          {/* Profile Header */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary-500 to-primary-600 opacity-10"></div>
            
            <div className="relative flex flex-col md:flex-row items-center md:items-end gap-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-3xl bg-primary-500 flex items-center justify-center text-white text-4xl font-black shadow-xl ring-4 ring-white">
                  {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </div>
                <button className="absolute -bottom-2 -right-2 p-3 bg-white rounded-2xl shadow-lg border border-slate-100 text-primary-500 hover:scale-110 transition-transform active:scale-95">
                  <Camera className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                  <h1 className="text-3xl font-black text-slate-900">{user?.name}</h1>
                  <span className="px-3 py-1 bg-slate-900 text-white text-[10px] font-black rounded-lg uppercase tracking-widest">{user?.id}</span>
                </div>
                <p className="text-slate-500 font-medium flex items-center justify-center md:justify-start gap-2">
                  <MapPin className="w-4 h-4" />
                  India • Verified Explorer
                </p>
              </div>

              <div className="flex gap-4">
                <button className="px-6 py-3 bg-primary-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary-500/20 hover:bg-primary-600 transition-all active:scale-95 flex items-center gap-2">
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={[
                    'w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all group',
                    activeTab === tab.id
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                      : 'bg-white text-slate-600 hover:bg-slate-100'
                  ].join(' ')}
                >
                  <div className="flex items-center gap-3">
                    <div className={[
                      'p-2 rounded-xl transition-colors',
                      activeTab === tab.id ? 'bg-white/20' : 'bg-slate-50 text-slate-400 group-hover:text-primary-500'
                    ].join(' ')}>
                      {tab.icon}
                    </div>
                    {tab.label}
                  </div>
                  <ChevronRight className={["w-4 h-4 opacity-50", activeTab === tab.id ? 'block' : 'hidden group-hover:block'].join(' ')} />
                </button>
              ))}
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 min-h-[500px]">
                {activeTab === 'account' && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-2xl font-black text-slate-900 mb-8">Account Details</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <ProfileField label="Full Name" value={user?.name || 'Not provided'} icon={<User className="w-4 h-4" />} />
                        <ProfileField label="Traveler ID" value={user?.id} icon={<Shield className="w-4 h-4" />} />
                        <ProfileField label="Email Address" value={user?.email} icon={<Mail className="w-4 h-4" />} />
                        <ProfileField label="Phone Number" value={user?.phone || 'Not provided'} icon={<Phone className="w-4 h-4" />} />
                      </div>
                    </div>

                    <div className="mt-12 p-6 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                          <Shield className="w-6 h-6 text-orange-500" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 mb-1">Verify your account</h3>
                          <p className="text-sm text-slate-500 mb-4">Verification helps keep our community safe. You'll need to upload an ID reflecting your legal name.</p>
                          <button className="text-primary-500 font-bold text-sm hover:underline">Start Verification Process →</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-2xl font-black text-slate-900 mb-8">Settings</h2>
                    
                    <div className="space-y-8">
                      <SettingsGroup title="Preferences">
                        <SettingsItem label="Language" value="English (US)" />
                        <SettingsItem label="Currency" value="INR - Indian Rupee" />
                        <SettingsItem label="Time Zone" value="(GMT+05:30) India Standard Time" />
                      </SettingsGroup>

                      <SettingsGroup title="Privacy">
                        <ToggleItem label="Show my profile on search results" initialValue={true} />
                        <ToggleItem label="Receive product updates and newsletters" initialValue={false} />
                      </SettingsGroup>
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-2xl font-black text-slate-900 mb-8">Security</h2>
                    <div className="space-y-4">
                      <SecurityAction 
                        label="Change Password" 
                        description="Update your account password" 
                        buttonText="Update" 
                        onClick={() => setIsPasswordModalOpen(true)}
                      />
                      <SecurityAction label="Two-Factor Authentication" description="Add an extra layer of security to your account" buttonText="Enable" />
                      <SecurityAction label="Active Sessions" description="Manage your logged in devices" buttonText="View All" />
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-center py-12">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                      <Bell className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No new notifications</h3>
                    <p className="text-slate-500 max-w-xs mx-auto">We'll notify you here when you have updates about your bookings or account.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ChangePasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} />
    </PageWrapper>
  );
};

const ProfileField = ({ label, value, icon }) => (
  <div className="space-y-2">
    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
    <div className="flex items-center gap-3 text-slate-700 font-bold">
      <div className="text-primary-500">{icon}</div>
      {value}
    </div>
  </div>
);

const SettingsGroup = ({ title, children }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-bold text-slate-900">{title}</h3>
    <div className="space-y-3">
      {children}
    </div>
  </div>
);

const SettingsItem = ({ label, value }) => (
  <button className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all text-left">
    <div>
      <p className="text-sm font-bold text-slate-900">{label}</p>
      <p className="text-xs text-slate-500 font-medium">{value}</p>
    </div>
    <ChevronRight className="w-4 h-4 text-slate-300" />
  </button>
);

const ToggleItem = ({ label, initialValue }) => {
  const [enabled, setEnabled] = useState(initialValue);
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100">
      <span className="text-sm font-bold text-slate-900">{label}</span>
      <button 
        onClick={() => setEnabled(!enabled)}
        className={[
          'w-12 h-6 rounded-full transition-colors relative',
          enabled ? 'bg-primary-500' : 'bg-slate-200'
        ].join(' ')}
      >
        <div className={[
          'absolute top-1 w-4 h-4 bg-white rounded-full transition-all',
          enabled ? 'left-7' : 'left-1'
        ].join(' ')} />
      </button>
    </div>
  );
};

const SecurityAction = ({ label, description, buttonText, onClick }) => (
  <div className="flex items-center justify-between p-6 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 transition-all">
    <div>
      <h4 className="font-bold text-slate-900">{label}</h4>
      <p className="text-sm text-slate-500 font-medium">{description}</p>
    </div>
    <button 
      onClick={onClick}
      className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
    >
      {buttonText}
    </button>
  </div>
);

export default Profile;
