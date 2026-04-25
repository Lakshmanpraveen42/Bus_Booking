import React, { useState, useEffect } from 'react';
import { Star, Quote, ChevronRight, Users, Route, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const testimonials = [
  {
    name: "Rajesh Kumar",
    role: "Frequent Traveler",
    rating: 5,
    message: "SmartBus has completely changed how I travel between cities. The real-time tracking and clean buses make it a world-class experience. Highly recommended for professionals!"
  },
  {
    name: "Ananya Sharma",
    role: "Digital Nomad",
    rating: 5,
    message: "The seat selection UI is so intuitive. I can always pick my favorite spot. Plus, the boarding points are always accurate. Best booking app in India, hands down."
  },
  {
    name: "Vikram Singh",
    role: "Business Consultant",
    rating: 4,
    message: "Fast, reliable, and secure. I especially appreciate the professional conduct of the staff and the seamless checkout process. Truly a premium way to travel."
  }
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-slide logic
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 lg:py-32 bg-slate-50 overflow-hidden relative">
      
      {/* Background Graphic */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-primary-500 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-primary-500 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative">
        
        {/* Trust Signals Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
           <TrustCard icon={<Users />} count="5M+" label="Happy Travelers" />
           <TrustCard icon={<Route />} count="10,000+" label="Verified Routes" />
           <TrustCard icon={<Award />} count="4.8/5" label="Average Rating" />
        </div>

        {/* Testimonial Active Slide */}
        <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-primary-500 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-xl shadow-primary-500/20 rotate-3">
              <Quote className="w-10 h-10 text-white fill-white/20" />
            </div>

            <div className="relative h-[250px] md:h-[200px]">
              {testimonials.map((t, idx) => (
                <div 
                  key={t.name}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out
                    ${idx === activeIndex 
                      ? 'opacity-100 translate-y-0 scale-100' 
                      : 'opacity-0 translate-y-10 scale-95 pointer-events-none'}
                  `}
                >
                  <div className="flex justify-center gap-1 mb-6">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>

                  <h3 className="text-2xl md:text-4xl font-black text-slate-900 leading-tight mb-8 drop-shadow-sm px-4">
                    "{t.message}"
                  </h3>

                  <div>
                    <p className="text-slate-900 font-black text-lg">{t.name}</p>
                    <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mt-1">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel Nav */}
            <div className="flex justify-center gap-3 mt-12 mb-16">
              {testimonials.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-2 transition-all duration-300 rounded-full
                    ${idx === activeIndex ? 'w-10 bg-primary-500' : 'w-2 bg-slate-200 hover:bg-slate-300'}
                  `}
                />
              ))}
            </div>

            {/* CTA */}
            <div className="animate-bounce-subtle">
              <Link 
                to="/search" 
                className="inline-flex items-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-black transition-all group"
              >
                Book Your Next Trip 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
        </div>

      </div>
    </section>
  );
};

// UI Helpers
const TrustCard = ({ icon, count, label }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center text-center group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
    <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-500 group-hover:text-white transition-colors duration-500">
      {React.cloneElement(icon, { className: 'w-7 h-7' })}
    </div>
    <h4 className="text-3xl font-black text-slate-900 tracking-tighter mb-1">{count}</h4>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
  </div>
);

export default Testimonials;
