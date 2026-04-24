import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import { Search, Book, CreditCard, User, MessageCircle, Phone, Mail, ChevronRight } from 'lucide-react';

const HelpCenter = () => {
  const categories = [
    {
      icon: <Book className="w-8 h-8 text-blue-500" />,
      title: 'Booking & Tickets',
      description: 'Learn how to book, modify, or cancel your bus tickets easily.',
      links: ['How to book a ticket?', 'Modifying your journey', 'Understanding ticket types', 'Bulk bookings']
    },
    {
      icon: <CreditCard className="w-8 h-8 text-emerald-500" />,
      title: 'Payments & Refunds',
      description: 'Questions about payments, wallet, or refund status.',
      links: ['Payment methods', 'Refund timelines', 'Transaction failures', 'Offers & Discounts']
    },
    {
      icon: <User className="w-8 h-8 text-purple-500" />,
      title: 'Account & Security',
      description: 'Manage your profile, password, and account settings.',
      links: ['Setting up your account', 'Password recovery', 'Managing saved passengers', 'Privacy settings']
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-amber-500" />,
      title: 'Support & Feedback',
      description: 'Get in touch with us or share your experience.',
      links: ['Contact support', 'Raise a complaint', 'App feedback', 'Partner with us']
    }
  ];

  return (
    <PageWrapper className="pb-24">
      {/* Search Header */}
      <div className="bg-slate-950 pt-32 pb-48 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[120px] -mr-64 -mt-64"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -ml-64 -mb-64"></div>

        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">How can we help you?</h1>
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
            <input
              type="text"
              placeholder="Search for articles (e.g. refund status, cancellation policy)"
              className="w-full bg-white/10 border border-white/10 text-white rounded-2xl py-6 pl-16 pr-6 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-lg backdrop-blur-xl"
            />
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <span className="text-slate-400 text-sm font-medium">Popular:</span>
            {['Refunds', 'Cancellation', 'Bus Tracking', 'Seat Selection'].map(tag => (
              <button key={tag} className="text-slate-300 hover:text-white text-sm bg-white/5 border border-white/5 px-4 py-1.5 rounded-full transition-colors">
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 -mt-24 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {categories.map((cat, i) => (
            <div key={i} className="bg-white rounded-[32px] p-8 shadow-2xl shadow-slate-200/50 border border-slate-100 hover:border-primary-500/20 transition-all duration-300 group">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {cat.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{cat.title}</h3>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                {cat.description}
              </p>
              <ul className="space-y-3">
                {cat.links.map(link => (
                  <li key={link}>
                    <button className="text-slate-600 hover:text-primary-500 text-sm font-medium flex items-center gap-2 group/link transition-colors">
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover/link:translate-x-1 transition-transform" />
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Strip */}
        <div className="bg-primary-600 rounded-[40px] p-12 overflow-hidden relative shadow-2xl shadow-primary-500/20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="text-center lg:text-left max-w-xl">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Still need assistance?</h2>
              <p className="text-primary-50 text-lg opacity-90">
                Our support team is available 24/7 to help you with any issues or queries you might have.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-6">
              <a href="tel:+918001234567" className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-slate-50 transition-all hover:scale-105 shadow-xl">
                <Phone className="w-5 h-5 text-primary-500" />
                Call Us
              </a>
              <a href="mailto:support@smartbus.com" className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-slate-800 transition-all hover:scale-105 shadow-xl">
                <Mail className="w-5 h-5 text-primary-400" />
                Email Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default HelpCenter;
