import React from 'react';
import { Link } from 'react-router-dom';
import { Bus, Globe, Twitter, Facebook, Instagram, Mail, Phone, MapPin, Send } from 'lucide-react';

const Footer = () => (
  <footer className="bg-slate-950 text-slate-400 mt-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
        {/* Brand & Newsletter */}
        <div className="lg:col-span-5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
              <Bus className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-black text-2xl tracking-tight">SmartBus</span>
          </div>
          <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-md">
            India's most premium online bus ticketing platform. Experience comfort, reliability, and speed with every booking.
          </p>
          
          <div className="space-y-4">
            <p className="text-white font-bold text-sm uppercase tracking-widest">Join our Newsletter</p>
            <div className="flex gap-2 max-w-sm">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors"
              />
              <button className="bg-primary-500 hover:bg-primary-600 text-white p-3 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary-500/20">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
          {[
            { 
              title: 'Company', 
              links: ['About Us', 'Bus Partners', 'Careers', 'Contact Us'] 
            },
            { 
              title: 'Support', 
              links: ['Help Center', 'Safety Guide', 'Cancellation', 'FAQ'] 
            },
            { 
              title: 'Legal', 
              links: ['Privacy Policy', 'Terms of Use', 'Cookie Policy', 'Insurance'] 
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">{col.title}</h4>
              <ul className="space-y-4">
                {col.links.map((link) => (
                  <li key={link}>
                    {link === 'Contact Us' ? (
                      <Link to="/contact" className="text-sm hover:text-white hover:pl-1 transition-all duration-300">
                        {link}
                      </Link>
                    ) : link === 'About Us' ? (
                      <Link to="/about" className="text-sm hover:text-white hover:pl-1 transition-all duration-300">
                        {link}
                      </Link>
                    ) : link === 'Bus Partners' ? (
                      <Link to="/partners" className="text-sm hover:text-white hover:pl-1 transition-all duration-300">
                        {link}
                      </Link>
                    ) : link === 'Careers' ? (
                      <Link to="/careers" className="text-sm hover:text-white hover:pl-1 transition-all duration-300">
                        {link}
                      </Link>
                    ) : link === 'Privacy Policy' ? (
                      <Link to="/privacy" className="text-sm hover:text-white hover:pl-1 transition-all duration-300">
                        {link}
                      </Link>
                    ) : link === 'Terms of Use' ? (
                      <Link to="/terms" className="text-sm hover:text-white hover:pl-1 transition-all duration-300">
                        {link}
                      </Link>
                    ) : link === 'Cookie Policy' ? (
                      <Link to="/cookies" className="text-sm hover:text-white hover:pl-1 transition-all duration-300">
                        {link}
                      </Link>
                    ) : link === 'Help Center' ? (
                      <Link to="/help" className="text-sm hover:text-white hover:pl-1 transition-all duration-300">
                        {link}
                      </Link>
                    ) : link === 'Safety Guide' ? (
                      <Link to="/safety" className="text-sm hover:text-white hover:pl-1 transition-all duration-300">
                        {link}
                      </Link>
                    ) : link === 'Cancellation' ? (
                      <Link to="/cancellation" className="text-sm hover:text-white hover:pl-1 transition-all duration-300">
                        {link}
                      </Link>
                    ) : link === 'FAQ' ? (
                      <Link to="/faq" className="text-sm hover:text-white hover:pl-1 transition-all duration-300">
                        {link}
                      </Link>
                    ) : link === 'Insurance' ? (
                      <Link to="/insurance" className="text-sm hover:text-white hover:pl-1 transition-all duration-300">
                        {link}
                      </Link>
                    ) : (
                      <a href="#" className="text-sm hover:text-white hover:pl-1 transition-all duration-300">
                        {link}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Social & Contact Info */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-10 border-t border-slate-900">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          {[
            { icon: <MapPin />, label: 'India' },
            { icon: <Phone />, label: '+91 800 123 4567' },
            { icon: <Mail />, label: 'support@smartbus.com' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-full text-xs font-bold text-white whitespace-nowrap">
              {React.cloneElement(item.icon, { className: 'w-3 h-3 text-primary-500' })}
              {item.label}
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          {[Globe, Twitter, Instagram, Facebook].map((Icon, i) => (
            <a key={i} href="#" className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center hover:bg-primary-500 hover:text-white transition-all duration-300 hover:rotate-6">
              <Icon className="w-5 h-5" />
            </a>
          ))}
        </div>
      </div>

      <div className="mt-12 text-center text-[10px] uppercase tracking-[0.2em] font-bold text-slate-600">
        © 2026 SmartBus Technologies Private Limited. All Rights Reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
