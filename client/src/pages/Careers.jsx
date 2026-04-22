import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import { Briefcase, MapPin, Clock, Coffee, Heart, Rocket, Code, Laptop, Zap } from 'lucide-react';

const Careers = () => {
  const perks = [
    { icon: <Coffee className="w-6 h-6 text-amber-500" />, title: 'Work-Life Balance', desc: 'Flexible hours and remote work options.' },
    { icon: <Heart className="w-6 h-6 text-rose-500" />, title: 'Premium Health', desc: 'Comprehensive insurance for you and family.' },
    { icon: <Rocket className="w-6 h-6 text-blue-500" />, title: 'Growth & Learning', desc: 'Dedicated annual budget for your upskilling.' },
    { icon: <Zap className="w-6 h-6 text-primary-500" />, title: 'Modern Tools', desc: 'The best hardware and software to work on.' }
  ];

  const openings = [
    { title: 'Senior Frontend Engineer', dept: 'Engineering', type: 'Full-time', location: 'Remote / Bangalore' },
    { title: 'Product Manager', dept: 'Product', type: 'Full-time', location: 'Bangalore' },
    { title: 'UI/UX Designer', dept: 'Design', type: 'Full-time', location: 'Remote' },
    { title: 'Digital Marketing Lead', dept: 'Marketing', type: 'Full-time', location: 'Bangalore' }
  ];

  return (
    <PageWrapper className="pb-24">
      {/* Hero Section */}
      <div className="bg-slate-950 py-32 relative overflow-hidden text-center">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[100px] -mr-[250px] -mt-[250px]"></div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full text-blue-400 text-sm font-bold tracking-wider uppercase mb-8">
            <Briefcase className="w-4 h-4" />
            We Are Hiring
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight">Join the <span className="text-primary-500">Future</span> of <br/>Travel Technology.</h1>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
            At BusGo, we're building more than just a booking app. We're building the infrastructure that moves millions of people every day.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-20">
        {/* Culture Section */}
        <div className="bg-white rounded-[50px] p-12 md:p-20 shadow-2xl shadow-slate-200/50 border border-slate-100 mb-24">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                 <h2 className="text-4xl font-black text-slate-900 mb-6 font-display ring-offset-slate-950">Why work at <span className="text-primary-500">BusGo?</span></h2>
                 <p className="text-slate-600 text-lg leading-relaxed mb-8">
                   We're a team of dreamers, doers, and builders who are passionate about solving complex logistics problems. Our culture is built on transparency, creative freedom, and mutual respect.
                 </p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {perks.map((p, i) => (
                      <div key={i} className="flex flex-col gap-3 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                         <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                            {p.icon}
                         </div>
                         <h4 className="font-bold text-slate-900">{p.title}</h4>
                         <p className="text-slate-500 text-sm leading-relaxed">{p.desc}</p>
                      </div>
                    ))}
                 </div>
              </div>
              <div className="bg-slate-900 rounded-[40px] aspect-square overflow-hidden relative flex items-center justify-center p-12">
                 <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000')] bg-cover"></div>
                 <div className="relative z-10 text-center">
                    <Zap className="w-16 h-16 text-primary-500 mx-auto mb-6 animate-pulse" />
                    <p className="text-white text-3xl font-black mb-2">High Impact Roles</p>
                    <p className="text-slate-400">Scale the platform to 100M+ users</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Open Positions */}
        <h2 className="text-4xl font-black text-slate-900 mb-12 text-center">Current Openings</h2>
        <div className="space-y-6 max-w-5xl mx-auto">
           {openings.map((job, i) => (
             <div key={i} className="group bg-white border border-slate-100 rounded-3xl p-8 hover:border-primary-500/30 hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-8 cursor-pointer">
                <div>
                   <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-primary-500 transition-colors">{job.title}</h3>
                   <div className="flex flex-wrap gap-4 text-slate-500 text-sm font-medium">
                      <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full"><Laptop className="w-4 h-4 text-slate-300" /> {job.dept}</span>
                      <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full"><MapPin className="w-4 h-4 text-slate-300" /> {job.location}</span>
                      <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full"><Clock className="w-4 h-4 text-slate-300" /> {job.type}</span>
                   </div>
                </div>
                <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold group-hover:bg-primary-500 transition-all shadow-xl shadow-slate-900/5 hover:-translate-y-1">
                   Apply Now
                </button>
             </div>
           ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-24 text-center">
           <p className="text-slate-500 text-lg mb-6">Don't see a role that fits you?</p>
           <button className="text-primary-600 font-black text-xl hover:underline underline-offset-8">
              Send us your Resume anyway →
           </button>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Careers;
