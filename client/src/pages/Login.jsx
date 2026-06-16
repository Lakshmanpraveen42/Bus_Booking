import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import api from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import { generateSessionId } from '../utils/generators';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // States
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState(location.state?.message || null);
  
  // Local UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(""); // Clear error on input
  };

  /**
   * handleLogin: Refined authentication logic
   * Correctly validates backend response shape and updates UI state.
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    
    // 1. Input Validation
    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const endpoint = isAdmin ? '/admin/login' : '/login';
      const response = await api.post(endpoint, {
        email: formData.email,
        password: formData.password
      });

      // 5. Add Debugging (IMPORTANT)
      console.log("Login Response:", response.data);

      const data = response.data;

      // 3. Only Login on Success
      if (data.user) {
        const sessionId = generateSessionId();
        
        // Update Global Auth State (Persistence handled by Zustand middleware)
        useAuthStore.setState({
          token: data.access_token || null,
          user: data.user,
          isAuthenticated: true,
          sessionId,
          loading: false,
          error: null
        });

        // 3. Navigation logic
        const from = location.state?.from || (data.user.is_admin ? '/admin' : '/');
        navigate(from, { replace: true });
      } else {
        // Block Login on Error
        setError(data?.error || data?.detail || "Invalid email or password");
      }

    } catch (err) {
      // 9. Handle network errors or non-2xx responses
      console.error("Login Error:", err);
      const apiError = err.response?.data?.detail || err.response?.data?.error || "Invalid email or password";
      setError(apiError);
    } finally {
      setLoading(false);
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

          {/* 6. UI Error Handling */}
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-500 text-sm font-bold animate-shake">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-600 text-sm font-bold">
              {successMessage}
            </div>
          )}

          {/* Form */}
          <form className="space-y-6" onSubmit={handleLogin}>
            <Input 
              label={isAdmin ? "Staff Email" : "Email Address"} 
              name="email"
              type="email" 
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              leftIcon={<Mail className="w-4 h-4" />}
              required
              disabled={loading}
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
                disabled={loading}
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
              disabled={loading} // 7. Loading State: Disable button
              className={isAdmin ? 'bg-slate-900 hover:bg-black' : ''}
            >
              {loading ? 'Logging in...' : (isAdmin ? 'Access Portal' : 'Sign In')}
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
