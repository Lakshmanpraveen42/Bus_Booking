import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import { XCircle, RefreshCw, Clock, History, AlertTriangle, FileText, CheckCircle } from 'lucide-react';

const Cancellation = () => {
  const refundSchedule = [
    { time: 'Before 24 Hours', refund: '90%', description: '10% cancellation charge applies if cancelled more than 24 hours before departure.' },
    { time: '12 - 24 Hours', refund: '70%', description: '30% cancellation charge applies if cancelled between 12 and 24 hours before departure.' },
    { time: '6 - 12 Hours', refund: '50%', description: '50% cancellation charge applies if cancelled between 6 and 12 hours before departure.' },
    { time: '0 - 6 Hours', refund: '0%', description: 'No refund for cancellations made less than 6 hours before departure or for No-Shows.' }
  ];

  return (
    <PageWrapper className="pb-24">
      {/* Header */}
      <div className="bg-slate-950 py-32 relative overflow-hidden text-center">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[120px] -mr-[300px] -mt-[300px]"></div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 rounded-full text-amber-500 text-sm font-bold tracking-wider uppercase mb-8">
            <XCircle className="w-4 h-4" />
            Cancellation Center
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight">Change of plans? <br/><span className="text-primary-500">We understand.</span></h1>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
            Our cancellation and refund policies are designed to be as fair and transparent as possible for both our customers and bus partners.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Refund Schedule */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[40px] p-10 shadow-2xl shadow-slate-200/50 border border-slate-100">
              <h2 className="text-3xl font-black text-slate-900 mb-10 flex items-center gap-4">
                <Clock className="w-8 h-8 text-primary-500" />
                Standard Refund Schedule
              </h2>
              
              <div className="space-y-6">
                {refundSchedule.map((tier, i) => (
                  <div key={i} className="flex flex-col md:flex-row items-center gap-8 p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-primary-500/20 transition-all duration-300">
                    <div className="flex-1">
                      <div className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-1">{tier.time}</div>
                      <h3 className="text-2xl font-black text-slate-900 mb-2">{tier.refund} Refund</h3>
                      <p className="text-slate-600 leading-relaxed">{tier.description}</p>
                    </div>
                    <div className="w-full md:w-auto">
                      <div className={`px-8 py-3 rounded-2xl font-black text-lg text-center ${tier.refund === '0%' ? 'bg-slate-200 text-slate-500' : 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'}`}>
                        {tier.refund}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[40px] p-10 shadow-2xl shadow-slate-200/50 border border-slate-100">
               <h2 className="text-2xl font-black text-slate-900 mb-6">Important Notes</h2>
               <ul className="space-y-4">
                  {[
                    "Standard cancellation policy may vary for specific bus operators. Please refer to the operator-specific policy during booking.",
                    "Service charges, insurance premiums, and convenience fees are strictly non-refundable.",
                    "Partial cancellation (cancelling only specific seats in a single booking) is currently supported only for selected operators.",
                    "In case of bus cancellation by the operator, a 100% refund will be processed automatically."
                  ].map((note, i) => (
                    <li key={i} className="flex gap-4 items-start text-slate-600 leading-relaxed">
                      <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-1" />
                      {note}
                    </li>
                  ))}
               </ul>
            </div>
          </div>

          {/* How to Cancel Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900 rounded-[40px] p-10 text-white sticky top-32 overflow-hidden shadow-2xl shadow-slate-950/20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
              
              <h2 className="text-3xl font-black mb-8 relative z-10 text-center lg:text-left">How to Cancel?</h2>
              
              <div className="space-y-10 relative z-10">
                {[
                  { step: "01", title: "Visit 'My Bookings'", content: "Login to your account and navigate to the 'My Bookings' section from the user profile." },
                  { step: "02", title: "Select Booking", content: "Locate the booking you wish to cancel and click on 'View Details'." },
                  { step: "03", title: "Confirm Action", content: "Click on 'Cancel Booking'. Review the refund amount based on the current timeframe." },
                  { step: "04", title: "Refund Processing", content: "Once confirmed, your refund is initiated immediately and reflects in your source account within 5-7 business days." }
                ].map((step, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="text-primary-500 font-black text-3xl opacity-50 shrink-0">{step.step}</div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">{step.title}</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">{step.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-10 border-t border-white/5">
                 <button className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black hover:bg-primary-500 hover:text-white transition-all shadow-xl hover:-translate-y-1">
                    Manage My Bookings
                 </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Cancellation;
