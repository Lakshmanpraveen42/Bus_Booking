import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bus, Mail, Phone, MapPin, 
  Facebook, Twitter, Instagram, Linkedin, 
  Send, ShieldCheck, Heart 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return toast.error("Please enter a valid email address");
    }

    setLoading(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1000));
    toast.success("Welcome aboard! You're subscribed.");
    setEmail('');
    setLoading(false);
  };

  const footerLinks = {
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'Our Fleet', path: '/fleet' },
      { name: 'Careers', path: '/careers' },
      { name: 'Partners', path: '/partners' }
    ],
    support: [
      { name: 'Help Center', path: '/help' },
      { name: 'Track Bus', path: '/track' },
      { name: 'Cancellation', path: '/cancellation' },
      { name: 'FAQ', path: '/faq' }
    ],
    legal: [
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Use', path: '/terms' },
      { name: 'Cookie Policy', path: '/cookies' },
      { name: 'Insurance', path: '/insurance' }
    ]
  };

  return (
    <footer className="bg-slate-950 pt-20 pb-10 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-[120px] -mr-64 -mt-64" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-20">
          
          {/* Section 1: Brand */}
          <div className="lg:col-span-4 space-y-8 text-center md:text-left">
            <Link to="/" className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-10 h-10 bg-primary-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                <Bus className="w-6 h-6 text-white" />
              </div>
              <span className="text-white font-black text-2xl tracking-tighter">SmartBus</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed font-medium max-w-sm mx-auto md:mx-0">
              India's most trusted bus booking platform. Experience seamless travel with state-of-the-art fleet and high-fidelity service.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-4">
               <SocialIcon icon={<Facebook className="w-5 h-5" />} />
               <SocialIcon icon={<Twitter className="w-5 h-5" />} />
               <SocialIcon icon={<Instagram className="w-5 h-5" />} />
               <SocialIcon icon={<Linkedin className="w-5 h-5" />} />
            </div>
          </div>

          {/* Section 2, 3, 4: Links */}
          <div className="lg:col-span-1 border-white/5 border-l hidden lg:block" />

          <div className="lg:col-span-2 space-y-8">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-primary-500">Company</h4>
            <ul className="space-y-4">
              {footerLinks.company.map(l => <li key={l.name}><FooterLink to={l.path}>{l.name}</FooterLink></li>)}
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-primary-500">Support</h4>
            <ul className="space-y-4">
              {footerLinks.support.map(l => <li key={l.name}><FooterLink to={l.path}>{l.name}</FooterLink></li>)}
            </ul>
          </div>

          {/* Section 5: Newsletter */}
          <div className="lg:col-span-3 space-y-8">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-primary-500">Stay Updated</h4>
            <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase tracking-widest">Subscribe to get exclusive deals & trip alerts.</p>
            
            <form onSubmit={handleSubscribe} className="relative group">
              <input 
                type="email" 
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-sm font-bold focus:outline-none focus:border-primary-500 focus:bg-white/10 transition-all"
              />
              <button 
                type="submit" 
                disabled={loading}
                className="absolute right-2 top-2 w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center hover:bg-white hover:text-primary-500 transition-all active:scale-90"
              >
                {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </form>

            <div className="flex items-center gap-2 p-4 bg-white/5 rounded-2xl border border-white/5">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 leading-none">Secured by 256-bit SSL</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/5 mb-10" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-5">
           <div className="flex flex-col md:flex-row items-center gap-4 md:gap-10">
              <ContactInfo icon={<Phone />} label="+91 91234 56789" href="tel:+919123456789" />
              <ContactInfo icon={<Mail />} label="support@smartbus.com" href="mailto:support@smartbus.com" />
              <ContactInfo icon={<MapPin />} label="Kadapa, Andhra Pradesh" />
           </div>

           <div className="flex items-center gap-6">
              <Link to="/privacy" className="text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-white transition-all">Privacy</Link>
              <Link to="/terms" className="text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-white transition-all">Terms</Link>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-700">
                MADE WITH <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> IN INDIA
              </div>
           </div>
        </div>
      </div>
    </footer>
  );
};

// UI Helpers
const FooterLink = ({ to, children }) => (
  <Link to={to} className="text-sm font-bold text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-300">
    {children}
  </Link>
);

const SocialIcon = ({ icon }) => (
  <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:bg-primary-500 hover:text-white hover:-translate-y-1 transition-all duration-300 shadow-xl border border-white/5">
    {icon}
  </button>
);

const ContactInfo = ({ icon, label, href }) => {
  const content = (
    <div className="flex items-center gap-3 group">
      <div className="text-slate-600 group-hover:text-primary-500 transition-colors">{React.cloneElement(icon, { size: 14 })}</div>
      <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white transition-all">{label}</span>
    </div>
  );
  
  return href ? <a href={href}>{content}</a> : <div>{content}</div>;
};

export default Footer;
