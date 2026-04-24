import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import { Target, Users, Award, Shield, Heart, Globe, Bus, Sparkles } from 'lucide-react';

const AboutUs = () => {
  const stats = [
    { label: 'Downloads', value: '10M+' },
    { label: 'Bus Partners', value: '2500+' },
    { label: 'Happy Travelers', value: '50M+' },
    { label: 'Daily Trips', value: '50,000+' }
  ];

  const values = [
    {
      icon: <Heart className="w-8 h-8 text-rose-500" />,
      title: 'Customer Centric',
      description: 'We put our customers at the heart of everything we do, ensuring comfort and convenience.'
    },
    {
      icon: <Target className="w-8 h-8 text-blue-500" />,
      title: 'Excellence in Tech',
      description: 'Building the most robust and seamless booking experience through cutting-edge technology.'
    },
    {
      icon: <Shield className="w-8 h-8 text-emerald-500" />,
      title: 'Safety First',
      description: 'We maintain the highest safety standards across our network for every single journey.'
    },
    {
      icon: <Globe className="w-8 h-8 text-amber-500" />,
      title: 'Unity in Diversity',
      description: 'Connecting thousands of cities and towns across India, bridging distances effortlessly.'
    }
  ];

  return (
    <PageWrapper className="pb-24">
      {/* Hero Section */}
      <div className="bg-slate-950 pt-32 pb-64 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-500/10 rounded-full blur-[150px] -mr-[400px] -mt-[400px]"></div>
        
        <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 rounded-full text-primary-500 text-sm font-bold tracking-wider uppercase mb-8">
            <Sparkles className="w-4 h-4" />
            Our Journey
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter">Revolutionizing <br/> <span className="text-primary-500 italic">Road Travel.</span></h1>
          <p className="text-slate-400 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            SmartBus is India's most premium online bus ticketing platform, dedicated to making every journey a seamless and delightful experience.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-32 relative z-20">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-[40px] p-10 text-center shadow-2xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-2 transition-all duration-500">
              <div className="text-4xl md:text-5xl font-black text-slate-900 mb-2">{stat.value}</div>
              <div className="text-slate-500 font-bold uppercase tracking-widest text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
           <div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 leading-tight">Driven by a simple <br/>mission: <span className="text-primary-500">Speed.</span></h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-6">
                Founded in 2020, SmartBus was born out of a desire to simplify the chaotic world of bus travel in India. We saw the need for a platform that wasn't just about tickets, but about the trust and comfort of the passenger.
              </p>
              <p className="text-slate-600 text-lg leading-relaxed">
                Today, we operate across 100,000+ routes, partnering with the finest bus operators to ensure that whether you're traveling for work or leisure, you arrive happy.
              </p>
           </div>
           <div className="relative group">
              <div className="absolute -inset-4 bg-primary-500 rounded-[60px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
              <div className="relative bg-slate-900 rounded-[50px] aspect-square overflow-hidden flex items-center justify-center p-12">
                 <Bus className="w-full h-full text-white/10 absolute -bottom-16 -right-16 rotate-12" />
                 <div className="text-center">
                    <Award className="w-24 h-24 text-primary-500 mx-auto mb-8 animate-bounce" />
                    <p className="text-white text-3xl font-black mb-4">India's #1 Premium App</p>
                    <p className="text-slate-400 text-lg">Voted by travelers for 3 consecutive years</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Values */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 mb-4">The Values We Live By</h2>
          <p className="text-slate-500 text-lg">Integrity, Innovation, and Interconnectivity are the pillars of SmartBus.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((v, i) => (
            <div key={i} className="bg-slate-50 rounded-[40px] p-10 border border-slate-100 hover:bg-white hover:shadow-xl transition-all duration-300">
               <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm">
                  {v.icon}
               </div>
               <h3 className="text-xl font-black text-slate-900 mb-4">{v.title}</h3>
               <p className="text-slate-600 leading-relaxed text-sm">
                  {v.description}
               </p>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
};

export default AboutUs;
