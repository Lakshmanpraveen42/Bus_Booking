import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { User, Mail, Lock, Phone, UserPlus, ShieldCheck, ArrowLeft, Eye, EyeOff, LogIn } from 'lucide-react';
import api from '../services/api';
import { useAuthStore } from '../store/useAuthStore';

const Signup = () => {
  const navigate = useNavigate();
  const { verifyOtp } = useAuthStore();
  
  // States
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [otpCode, setOtpCode] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // New States as per requirements
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(""); // Clear error on change
  };

  /**
   * handleSignup: Production-grade API call with robust error handling
   * Prevents navigation on failure and provides clear user feedback.
   */
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post('/register', formData);
      
      // Axios resolves if status is 2xx. 
      // We check for custom error fields in data if the backend returns 200 with error.
      const data = response.data;

      if (data?.error || data?.detail) {
        const errorMsg = data.error || data.detail;
        setError(errorMsg === "Email already registered" 
          ? "Email already exists. Please login instead." 
          : errorMsg);
        return; // STOP execution immediately
      }

      // Success: Proceed to OTP
      setIsOtpStep(true);
    } catch (err) {
      // Handle Network Errors and non-2xx API Responses
      const apiError = err.response?.data?.detail || err.response?.data?.error || "Registration failed. Please try again.";
      
      if (apiError === "Email already registered") {
        setError("Email already exists. Please login instead.");
      } else {
        setError(apiError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const success = await verifyOtp(formData.email, otpCode, false);
      if (success) {
        setIsSuccess(true);
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              email: formData.email, 
              message: 'Account verified successfully! Please log in.' 
            } 
          });
        }, 2000);
      }
    } catch (err) {
      setError("Verification failed. Please check your code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper className="flex items-center justify-center py-20 bg-slate-50">
      <div className="max-w-md w-full px-4">
        <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 p-10 border border-slate-100">
          
          {!isOtpStep ? (
            <>
              {/* Registration Form */}
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-primary-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary-500">
                   <UserPlus className="w-8 h-8" />
                </div>
                <h1 className="text-3xl font-black text-slate-900 mb-2">Create Account</h1>
                <p className="text-slate-500">Join SmartBus and enjoy seamless travel.</p>
              </div>

              {/* Error UI Rendering */}
              {error && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl animate-shake">
                  <p className="text-rose-500 text-sm font-bold">{error}</p>
                  
                  {error.includes("already exists") && (
                    <Link 
                      to="/login" 
                      state={{ email: formData.email }}
                      className="mt-3 flex items-center justify-center gap-2 text-xs font-black text-primary-600 bg-white border border-primary-100 py-2 rounded-xl hover:bg-primary-50 transition-colors"
                    >
                      <LogIn className="w-3 h-3" />
                      Go to Login
                    </Link>
                  )}
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSignup}>
                <Input 
                  label="Full Name" 
                  name="name"
                  type="text" 
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  leftIcon={<User className="w-4 h-4" />}
                  required
                  disabled={loading}
                />
                <Input 
                  label="Email Address" 
                  name="email"
                  type="email" 
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  leftIcon={<Mail className="w-4 h-4" />}
                  required
                  disabled={loading}
                />
                <Input 
                  label="Phone Number" 
                  name="phone"
                  type="tel" 
                  placeholder="+91 00000 00000"
                  value={formData.phone}
                  onChange={handleChange}
                  leftIcon={<Phone className="w-4 h-4" />}
                  required
                  disabled={loading}
                />
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

                <Button 
                  fullWidth 
                  size="xl" 
                  type="submit" 
                  shadow 
                  loading={loading}
                  disabled={loading} // Prevent Double Submission
                >
                  {loading ? 'Processing...' : 'Send Verification Code'}
                </Button>
              </form>
            </>
          ) : (
            <>
              {/* OTP Verification Step */}
              <div className="text-center mb-10">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-500
                  ${isSuccess ? 'bg-emerald-500 text-white scale-110' : 'bg-emerald-500/10 text-emerald-500'}
                `}>
                   {isSuccess ? <ShieldCheck className="w-8 h-8 animate-bounce" /> : <ShieldCheck className="w-8 h-8" />}
                </div>
                <h1 className="text-3xl font-black text-slate-900 mb-2">
                  {isSuccess ? 'Verified!' : 'Verify Email'}
                </h1>
                <p className="text-slate-500">
                  {isSuccess 
                    ? "Your account is ready. Redirecting to login..." 
                    : <>We've sent a 6-digit code to <br /><span className="text-slate-900 font-bold">{formData.email}</span></>
                  }
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-500 text-sm font-bold animate-shake">
                  {error}
                </div>
              )}

              {!isSuccess && (
                <form className="space-y-6" onSubmit={handleVerify}>
                  <Input 
                    label="6-Digit Code" 
                    type="text" 
                    maxLength={6}
                    placeholder="000000"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="text-center text-2xl tracking-[12px] font-black"
                    required
                    disabled={loading}
                  />

                  <Button 
                    fullWidth 
                    size="xl" 
                    type="submit" 
                    shadow 
                    loading={loading} 
                    variant="success"
                    disabled={loading}
                  >
                    {loading ? 'Verifying...' : 'Verify & Continue'}
                  </Button>

                  <button 
                    type="button" 
                    onClick={() => {
                      setIsOtpStep(false);
                      setError("");
                    }}
                    className="w-full flex items-center justify-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Change Email Address
                  </button>
                </form>
              )}
            </>
          )}

          {/* Footer */}
          {!isOtpStep && (
            <p className="mt-10 text-center text-sm text-slate-500 font-medium">
              Already have an account? {' '}
              <Link to="/login" className="text-primary-500 font-black hover:underline underline-offset-4">
                Log In
              </Link>
            </p>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default Signup;
