import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import { ShieldCheck, HeartPulse, Luggage, Clock, CheckCircle2, FileText, AlertCircle, PhoneCall } from 'lucide-react';

const Insurance = () => {
  const benefits = [
    {
      icon: <HeartPulse className="w-8 h-8 text-rose-500" />,
      title: 'Personal Accident Cover',
      description: 'Comprehensive coverage of up to ₹5,00,000 for accidental injuries or fatalities during the journey.'
    },
    {
      icon: <Smartphone className="w-8 h-8 text-blue-500" />,
      title: 'Trip Cancellation',
      description: 'Get reimbursed for non-refundable expenses if the bus is cancelled or delayed by more than 6 hours.'
    },
    {
      icon: <Luggage className="w-8 h-8 text-emerald-500" />,
      title: 'Baggage Loss/Damage',
      description: 'Protection for your personal belongings against theft or accidental damage during transit (up to ₹10,000).'
    },
    {
      icon: <Clock className="w-8 h-8 text-amber-500" />,
      title: 'Medical Expenses',
      description: 'Emergency hospitalization and medical expense coverage within 24 hours of the accident.'
    }
  ];

  return (
    <PageWrapper className="pb-24">
      {/* Header */}
      <div className="bg-slate-950 py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] -mr-[300px] -mt-[300px]"></div>
        
        <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full text-emerald-400 text-sm font-bold tracking-wider uppercase mb-8">
            <ShieldCheck className="w-4 h-4" />
            Travel Guard Active
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">Travel with <span className="text-emerald-400 italic">total peace of mind.</span></h1>
          <p className="text-slate-400 text-xl max-w-3xl mx-auto leading-relaxed">
            Protect yourself and your loved ones with BusGo's comprehensive travel insurance, powered by leading global providers. Just ₹15 per passenger.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-20">
        {/* Core Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {benefits.map((benefit, i) => (
            <div key={i} className="bg-white rounded-[40px] p-10 shadow-2xl shadow-slate-200/50 border border-slate-100 hover:border-emerald-500/30 transition-all duration-300">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-8">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-4">{benefit.title}</h3>
              <p className="text-slate-500 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Claim Process */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-24">
           <div className="lg:col-span-1">
              <h2 className="text-4xl font-black text-slate-900 mb-6 leading-tight">Fast & Easy <br/>Claims Process</h2>
              <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                Filing a claim shouldn't be a hassle. Our digital-first approach ensures you get the support you need, when you need it.
              </p>
              <div className="p-8 bg-emerald-50 border border-emerald-100 rounded-3xl">
                 <div className="flex gap-4 items-center text-emerald-700 font-bold mb-2">
                    <PhoneCall className="w-6 h-6" />
                    24/7 Helpline
                 </div>
                 <p className="text-emerald-600">Call 1800-BUS-GUARD for immediate claim assistance.</p>
              </div>
           </div>
           
           <div className="lg:col-span-2 space-y-6">
              {[
                { title: "Intimate the Claim", content: "Notify us or our insurance partner within 24 hours of the incident via app or helpline." },
                { title: "Upload Documents", content: "Submit digital copies of your ticket, hospital bills, or police reports (if applicable)." },
                { title: "Verification", content: "Our team verifies the details with the bus operator and medical providers." },
                { title: "Direct Settlement", content: "Approved claim amounts are credited directly to your bank account within 10 business days." }
              ].map((step, i) => (
                <div key={i} className="flex gap-8 p-8 bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                   <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-xl shrink-0">
                      {i + 1}
                   </div>
                   <div>
                      <h4 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h4>
                      <p className="text-slate-600 leading-relaxed text-lg">{step.content}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Partners & T&C */}
        <div className="bg-slate-50 rounded-[50px] p-12 md:p-16 border border-slate-200/60">
           <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1">
                 <h3 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                    <FileText className="w-7 h-7 text-primary-500" />
                    Terms and Conditions
                 </h3>
                 <ul className="space-y-3">
                    {[
                      "Insurance is optional and can be opted out during checkout.",
                      "Coverage is valid only for the duration of the bus journey.",
                      "Claims are subject to verification and approval by our insurance partners.",
                      "Policy details will be sent to your registered email address post-booking."
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-slate-600">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                        {item}
                      </li>
                    ))}
                 </ul>
              </div>
              <div className="w-full md:w-80 p-8 bg-white rounded-3xl border border-slate-200 shadow-sm text-center">
                 <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-6">Our Insurance Partners</p>
                 <div className="grid grid-cols-2 gap-6 opacity-60">
                    <div className="h-10 bg-slate-100 rounded-lg"></div>
                    <div className="h-10 bg-slate-100 rounded-lg"></div>
                 </div>
                 <p className="mt-6 text-slate-500 text-sm italic">Trusted by millions of travelers worldwide.</p>
              </div>
           </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Insurance;
