import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { User, Mail, Lock, Phone, UserPlus, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const Signup = () => {
  const navigate = useNavigate();
  const { signup, verifyOtp, loading, error } = useAuthStore();
  
  // States
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [otpCode, setOtpCode] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const success = await signup(formData);
    if (success) {
      setIsOtpStep(true);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const success = await verifyOtp(formData.email, otpCode);
    if (success) {
      // Small delay to ensure state is flushed if needed, or just use useAuthStore.getState()
      const isAdmin = useAuthStore.getState().user?.is_admin;
      navigate(isAdmin ? '/admin' : '/');
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
                <p className="text-slate-500">Join BusGo and enjoy seamless travel.</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-500 text-sm font-bold animate-shake">
                  {error}
                </div>
              )}

              <form className="space-y-6" onSubmit={handleRegister}>
                <Input 
                  label="Full Name" 
                  name="name"
                  type="text" 
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  leftIcon={<User className="w-4 h-4" />}
                  required
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
                />
                <Input 
                  label="Password" 
                  name="password"
                  type="password" 
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  leftIcon={<Lock className="w-4 h-4" />}
                  required
                />

                <Button fullWidth size="xl" type="submit" shadow loading={loading}>
                  {loading ? 'Sending OTP...' : 'Send Verification Code'}
                </Button>
              </form>
            </>
          ) : (
            <>
              {/* OTP Verification Step */}
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-500">
                   <ShieldCheck className="w-8 h-8" />
                </div>
                <h1 className="text-3xl font-black text-slate-900 mb-2">Verify Email</h1>
                <p className="text-slate-500">We've sent a 6-digit code to <br /><span className="text-slate-900 font-bold">{formData.email}</span></p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-500 text-sm font-bold">
                  {error}
                </div>
              )}

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
                />

                <Button fullWidth size="xl" type="submit" shadow loading={loading} variant="success">
                  {loading ? 'Verifying...' : 'Verify & Continue'}
                </Button>

                <button 
                  type="button" 
                  onClick={() => setIsOtpStep(false)}
                  className="w-full flex items-center justify-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Change Email Address
                </button>
              </form>
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
