import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Globe, ShieldCheck } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/ui/Button';

const InfoCard = ({ icon: Icon, title, content, subContent }) => (
  <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group">
    <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
      <Icon className="w-6 h-6 text-primary-600" />
    </div>
    <h3 className="font-bold text-slate-800 mb-1">{title}</h3>
    <p className="text-slate-600 font-medium mb-0.5">{content}</p>
    {subContent && <p className="text-xs text-slate-400">{subContent}</p>}
  </div>
);

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();

  const onSubmit = async (data) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Form data:', data);
    setSubmitted(true);
    reset();
  };

  return (
    <PageWrapper>
      {/* Hero Section */}
      <section className="relative bg-slate-950 py-24 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[120px] -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-500/10 rounded-full blur-[100px] -ml-24 -mb-24" />
        </div>

        <div className="container-max relative z-10">
          <div className="max-w-3xl animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary-400 text-xs font-bold uppercase tracking-widest mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
              Contact Us
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
              We're Here to <span className="text-primary-500">Help</span> You Journey Better.
            </h1>
            <p className="text-xl text-slate-400 font-medium leading-relaxed">
              Have questions about your booking, safety, or partnership opportunities? 
              Our team is available 24/7 to assist you.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container-max -mt-16 pb-24 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Details Side */}
          <div className="lg:col-span-1 space-y-6 animate-fade-in-up [animation-delay:100ms]">
            <InfoCard 
              icon={Phone}
              title="Give us a call"
              content="+91 800 123 4567"
              subContent="24/7 dedicated support line"
            />
            <InfoCard 
              icon={Mail}
              title="Email support"
              content="support@busgo.com"
              subContent="We usually respond within 2 hours"
            />
            <InfoCard 
              icon={MapPin}
              title="Headquarters"
              content="Indiranagar, Bangalore"
              subContent="Karnataka, India - 560038"
            />
            
            <div className="bg-gradient-to-br from-primary-500 to-accent-600 rounded-3xl p-8 text-white shadow-xl shadow-primary-500/20">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-8 h-8" />
                <h3 className="font-bold text-xl">Travel Safety First</h3>
              </div>
              <p className="text-white/80 text-sm leading-relaxed mb-6">
                Your safety is our top priority. Contact our emergency safety response team anytime if you face issues during your journey.
              </p>
              <button className="w-full bg-white text-primary-600 font-bold py-3 rounded-xl hover:bg-slate-50 transition-colors">
                Safety Center
              </button>
            </div>
          </div>

          {/* Contact Form Side */}
          <div className="lg:col-span-2 animate-fade-in-up [animation-delay:200ms]">
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-card border border-slate-100 h-full">
              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 animate-fade-in">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                    <Send className="w-10 h-10 text-emerald-500" />
                  </div>
                  <h2 className="text-3xl font-black text-slate-800 mb-2">Message Sent!</h2>
                  <p className="text-slate-500 max-w-sm mx-auto mb-8">
                    Thanks for reaching out! Our team will review your message and get back to you shortly.
                  </p>
                  <Button 
                    variant="secondary" 
                    onClick={() => setSubmitted(false)}
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <>
                  <div className="mb-10">
                    <h2 className="text-3xl font-black text-slate-800 mb-2">Send us a message</h2>
                    <p className="text-slate-500 font-medium">Fill out the form below and we'll get in touch.</p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Your Name</label>
                        <input 
                          {...register('name', { required: 'Name is required' })}
                          placeholder="John Doe"
                          className={`w-full px-5 py-4 bg-slate-50 border ${errors.name ? 'border-red-300' : 'border-slate-100'} rounded-2xl focus:outline-none focus:border-primary-500 focus:bg-white transition-all`}
                        />
                        {errors.name && <p className="text-xs text-red-500 ml-1">{errors.name.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                        <input 
                          {...register('email', { 
                            required: 'Email is required',
                            pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                          })}
                          placeholder="john@example.com"
                          className={`w-full px-5 py-4 bg-slate-50 border ${errors.email ? 'border-red-300' : 'border-slate-100'} rounded-2xl focus:outline-none focus:border-primary-500 focus:bg-white transition-all`}
                        />
                        {errors.email && <p className="text-xs text-red-500 ml-1">{errors.email.message}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Subject</label>
                      <select 
                        {...register('subject', { required: 'Subject is required' })}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-primary-500 focus:bg-white transition-all appearance-none"
                      >
                        <option value="">Select a reason</option>
                        <option value="Booking Issue">Booking Issue</option>
                        <option value="Refund Request">Refund Request</option>
                        <option value="Safety Concern">Safety Concern</option>
                        <option value="Partnership">Partnership Inquiry</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Message</label>
                      <textarea 
                        {...register('message', { required: 'Message is required' })}
                        rows={5}
                        placeholder="Tell us how we can help..."
                        className={`w-full px-5 py-4 bg-slate-50 border ${errors.message ? 'border-red-300' : 'border-slate-100'} rounded-2xl focus:outline-none focus:border-primary-500 focus:bg-white transition-all resize-none`}
                      />
                      {errors.message && <p className="text-xs text-red-500 ml-1">{errors.message.message}</p>}
                    </div>

                    <Button 
                      type="submit" 
                      fullWidth 
                      size="xl" 
                      loading={isSubmitting}
                      leftIcon={!isSubmitting && <Send className="w-5 h-5" />}
                    >
                      {isSubmitting ? 'Sending Message...' : 'Send Message'}
                    </Button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-slate-50 py-20 border-y border-slate-200/60">
        <div className="container-max">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: MessageSquare, label: '24/7 Support', sub: 'Live Chat' },
              { icon: Clock, label: 'Fast Refunds', sub: 'Within 24hrs' },
              { icon: Globe, label: 'All India', sub: '1 Lakh+ Routes' },
              { icon: ShieldCheck, label: 'Secure Payments', sub: 'Verified' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center space-y-2">
                <item.icon className="w-8 h-8 text-slate-300" />
                <p className="font-bold text-slate-700">{item.label}</p>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};

export default Contact;
