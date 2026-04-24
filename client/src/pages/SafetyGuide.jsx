import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import { Shield, MapPin, UserCheck, Smartphone, Eye, Bell, HardHat, HeartPulse } from 'lucide-react';

const SafetyGuide = () => {
  const safetyFeatures = [
    {
      icon: <MapPin className="w-8 h-8 text-rose-500" />,
      title: 'Real-time GPS Tracking',
      description: 'Track your bus in real-time and share your live location with family/friends for extra peace of mind.'
    },
    {
      icon: <UserCheck className="w-8 h-8 text-blue-500" />,
      title: 'Verified Drivers',
      description: 'All our drivers undergo rigorous background checks, professional training, and routine medical screenings.'
    },
    {
      icon: <Smartphone className="w-8 h-8 text-emerald-500" />,
      title: 'Emergency SOS Button',
      description: 'Instant SOS button in our mobile app to alert our 24/7 safety response team and local emergency services.'
    },
    {
      icon: <Eye className="w-8 h-8 text-amber-500" />,
      title: 'CCTV Surveillance',
      description: 'Strategic CCTV monitoring inside buses to ensure passenger security and prevent misconduct.'
    },
    {
      icon: <HardHat className="w-8 h-8 text-slate-700" />,
      title: 'Technically Sound Fleet',
      description: 'Regular maintenance audits and safety equipment checks (fire extinguishers, emergency exits) for every bus.'
    },
    {
      icon: <HeartPulse className="w-8 h-8 text-red-500" />,
      title: 'Health & Hygiene',
      description: 'Strict sanitization protocols after every trip and availability of basic medical kits on board.'
    }
  ];

  return (
    <PageWrapper className="pb-24">
      {/* Hero Section */}
      <div className="bg-slate-900 py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-[150px] -mr-[400px] -mt-[400px]"></div>
        
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500/10 rounded-full text-rose-400 text-sm font-bold tracking-wider uppercase mb-8">
            <Shield className="w-4 h-4" />
            Safety First Initiative
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">Safety Guide</h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Your safety is our top commitment. Discover how SmartBus ensures a secure and protected travel experience for every passenger.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-20">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {safetyFeatures.map((feature, i) => (
            <div key={i} className="bg-white rounded-[40px] p-10 shadow-2xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-2 transition-all duration-500">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-8">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">{feature.title}</h3>
              <p className="text-slate-500 leading-relaxed text-lg">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Women Safety Highlight */}
        <div className="bg-slate-950 rounded-[50px] p-12 md:p-20 relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[120px] -mr-32 -mb-32"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full text-blue-400 text-sm font-bold tracking-wider uppercase mb-8">
                Exclusive Features
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight">Focus on Solo <br/> Women Travelers</h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                Traveling alone? Relax. We offer dedicated lady seats (next to another lady only), secure boarding points, and prioritized support for women passengers.
              </p>
              <ul className="space-y-4">
                {['Reserved Lady Seats', 'Safe Boarding Locations', 'Emergency Response Priority'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-white font-bold">
                    <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
                      <Shield className="w-3 h-3 text-white" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="lg:w-1/2 w-full aspect-video rounded-3xl bg-slate-900 border border-white/10 flex items-center justify-center overflow-hidden">
               <div className="text-center p-8">
                  <HeartPulse className="w-20 h-20 text-rose-500 mx-auto mb-6 animate-pulse" />
                  <p className="text-white text-2xl font-black">Safety Response Team</p>
                  <p className="text-slate-400 mt-2">Active & Monitoring 24/7</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default SafetyGuide;
