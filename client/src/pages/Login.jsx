import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Mail, Lock, LogIn, Github, Chrome, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, adminLogin, loading, error } = useAuthStore();
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = isAdmin 
      ? await adminLogin(formData.email, formData.password)
      : await login(formData.email, formData.password);

    if (success) {
      const user = useAuthStore.getState().user;
      const from = location.state?.from || (user?.is_admin ? '/admin' : '/');
      navigate(from, { replace: true });
    }
  };

  return (
    <PageWrapper className="flex items-center justify-center py-20 bg-slate-50">
      <div className="max-w-md w-full px-4">
        <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 p-10 border border-slate-100">
          {/* Header */}
          <div className="text-center mb-10">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-500
              ${isAdmin ? 'bg-slate-900 text-white rotate-12 shadow-xl shadow-slate-900/20' : 'bg-primary-500/10 text-primary-500'}
            `}>
               {isAdmin ? <Lock className="w-8 h-8" /> : <LogIn className="w-8 h-8" />}
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">
              {isAdmin ? 'Admin Portal' : 'Welcome Back'}
            </h1>
            <p className="text-slate-500">
              {isAdmin ? 'Authenticate for system-wide access.' : 'Login to manage your bookings and trips.'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-500 text-sm font-bold animate-shake">
              {error}
            </div>
          )}

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input 
              label={isAdmin ? "Staff Email" : "Email Address"} 
              name="email"
              type="email" 
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />
            <div className="space-y-1">
              <Input 
                label="Password" 
                name="password"
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="hover:text-primary-500 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                required
              />
              {!isAdmin && (
                <div className="text-right">
                  <button type="button" className="text-xs font-bold text-primary-500 hover:text-primary-600 transition-colors">
                    Forgot Password?
                  </button>
                </div>
              )}
            </div>

            <Button 
              fullWidth 
              size="xl" 
              type="submit" 
              shadow 
              loading={loading}
              className={isAdmin ? 'bg-slate-900 hover:bg-black' : ''}
            >
              {loading ? 'Authenticating...' : (isAdmin ? 'Access Portal' : 'Sign In')}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-10 flex flex-col gap-4 text-center">
            <p className="text-sm text-slate-500 font-medium">
              {!isAdmin ? (
                <>Don't have an account? <Link to="/signup" className="text-primary-500 font-black hover:underline">Sign Up</Link></>
              ) : (
                <button 
                  onClick={() => setIsAdmin(false)} 
                  className="text-primary-500 font-black hover:underline"
                >
                  Return to User Login
                </button>
              )}
            </p>

            {!isAdmin && (
              <button 
                onClick={() => setIsAdmin(true)}
                className="text-[10px] uppercase font-black tracking-widest text-slate-300 hover:text-slate-900 transition-colors"
              >
                Staff Portal Access
              </button>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Login;
