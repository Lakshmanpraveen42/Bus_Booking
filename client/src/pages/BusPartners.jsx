import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import { Network, TrendingUp, Cpu, Smartphone, BarChart3, Users, CheckCircle, ArrowRight } from 'lucide-react';

const BusPartners = () => {
  const benefits = [
    {
      icon: <Network className="w-8 h-8 text-blue-500" />,
      title: 'Widest Customer Reach',
      description: 'Connect with over 50 million active travelers across India instantly through our platform.'
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-emerald-500" />,
      title: 'Revenue Optimization',
      description: 'Our dynamic pricing and inventory management tools help you maximize profit for every trip.'
    },
    {
      icon: <Cpu className="w-8 h-8 text-purple-500" />,
      title: 'Advanced Fleet Tech',
      description: 'Get access to state-of-the-art GPS tracking, driver apps, and real-time operations dashboard.'
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-amber-500" />,
      title: 'Insights & Analytics',
      description: 'Detailed reports on booking trends, customer feedback, and performance metrics.'
    }
  ];

  return (
    <PageWrapper className="pb-24">
      {/* Hero Section */}
      <div className="bg-slate-900 py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[100px] -mr-[300px] -mt-[300px]"></div>
        
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full text-emerald-400 text-sm font-bold tracking-wider uppercase mb-8">
            <Network className="w-4 h-4" />
            Grow Your Business
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight tracking-tight">Partner with <span className="text-emerald-400">India's Leading</span> Bus Network.</h1>
          <p className="text-slate-400 text-xl max-w-2xl leading-relaxed">
            Join 2,500+ bus operators who have transformed their operations and increased their earnings with BusGo's industry-leading technology.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-20">
        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {benefits.map((b, i) => (
            <div key={i} className="bg-white rounded-[40px] p-10 shadow-2xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-8">
                {b.icon}
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-4">{b.title}</h3>
              <p className="text-slate-500 leading-relaxed text-sm">
                {b.description}
              </p>
            </div>
          ))}
        </div>

        {/* Action Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
           <div className="bg-slate-950 rounded-[50px] p-12 md:p-20 text-white relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl -mr-48 -mb-48"></div>
              
              <h2 className="text-4xl font-black mb-8 leading-tight">Ready to <br/>onboard?</h2>
              <div className="space-y-8">
                 {[
                   { title: "Register Your Interest", content: "Fill out our quick partnership form and our team will reach out to you within 24 hours." },
                   { title: "KYC & Verification", content: "Our operations team will verify your fleet details and operating licenses." },
                   { title: "Technical Setup", content: "Go live on our platform with our easy-to-use operator dashboard and booking engine." }
                 ].map((step, i) => (
                   <div key={i} className="flex gap-6">
                      <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center font-black shrink-0">
                         {i + 1}
                      </div>
                      <div>
                         <h4 className="font-bold text-xl mb-2">{step.title}</h4>
                         <p className="text-slate-400 leading-relaxed">{step.content}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-white rounded-[50px] p-12 md:p-20 border border-slate-100 shadow-xl flex flex-col justify-center">
              <h3 className="text-3xl font-black text-slate-900 mb-8">Get in Touch</h3>
              <form className="space-y-6">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Company Name</label>
                    <input type="text" placeholder="e.g. Royal Travels" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-emerald-500 transition-all" />
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                       <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Contact Name</label>
                       <input type="text" placeholder="John Doe" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-emerald-500 transition-all" />
                    </div>
                    <div>
                       <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Phone Number</label>
                       <input type="tel" placeholder="+91 00000 00000" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-emerald-500 transition-all" />
                    </div>
                 </div>
                 <button className="w-full bg-emerald-500 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all hover:scale-105 shadow-xl shadow-emerald-500/20 active:scale-95">
                    Become a Partner
                    <ArrowRight className="w-5 h-5" />
                 </button>
              </form>
           </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default BusPartners;
