import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Mail, Lock, LogIn, Github, Chrome, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuthStore();
  
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
    const success = await login(formData.email, formData.password);
    if (success) {
      const user = useAuthStore.getState().user;
      console.log(`DEBUG: Logged in as => ${user?.is_admin ? 'ADMIN' : 'USER'}`, user);
      navigate(user?.is_admin ? '/admin' : '/');
    }
  };

  return (
    <PageWrapper className="flex items-center justify-center py-20 bg-slate-50">
      <div className="max-w-md w-full px-4">
        <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 p-10 border border-slate-100">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-primary-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary-500">
               <LogIn className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">Welcome Back</h1>
            <p className="text-slate-500">Login to manage your bookings and trips.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-500 text-sm font-bold animate-shake">
              {error}
            </div>
          )}

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input 
              label="Email Address" 
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
              <div className="text-right">
                <button type="button" className="text-xs font-bold text-primary-500 hover:text-primary-600 transition-colors">
                  Forgot Password?
                </button>
              </div>
            </div>

            <Button fullWidth size="xl" type="submit" shadow loading={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
              <span className="px-4 bg-white text-slate-400">Or continue with</span>
            </div>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 py-3 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all font-bold text-sm">
              <Chrome className="w-5 h-5 text-red-500" />
              Google
            </button>
            <button className="flex items-center justify-center gap-3 py-3 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all font-bold text-sm">
              <Github className="w-5 h-5 text-slate-900" />
              Github
            </button>
          </div>

          {/* Footer */}
          <p className="mt-10 text-center text-sm text-slate-500 font-medium">
            Don't have an account? {' '}
            <Link to="/signup" className="text-primary-500 font-black hover:underline underline-offset-4">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Login;
