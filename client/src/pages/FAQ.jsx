import React, { useState } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import { HelpCircle, ChevronDown, ChevronUp, Search, Info } from 'lucide-react';
import { useChatStore } from '../store/useChatStore';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const openChat = useChatStore((s) => s.openChat);

  const faqData = [
    {
      category: 'Booking Process',
      questions: [
        { q: 'How do I book a bus ticket on SmartBus?', a: 'To book a ticket, simply enter your source, destination, and travel date on the homepage. Browse the available buses, select your preferred seat, enter passenger details, and complete the payment.' },
        { q: 'Can I book a ticket without registering an account?', a: 'Yes, you can book as a guest. However, we recommend creating an account to easily track your bookings, manage refunds, and receive exclusive offers.' },
        { q: 'Can I select a specific seat?', a: 'Absolutely! Our interactive seat map allows you to pick your preferred seat, whether it\'s a window seat, an aisle seat, or a lower/upper berth in sleeper buses.' }
      ]
    },
    {
      category: 'Payments & Refunds',
      questions: [
        { q: 'What payment methods are supported?', a: 'We support all major credit/debit cards, UPI (GPay, PhonePe, Paytm), Net Banking, and popular digital wallets.' },
        { q: 'How long does it take to get a refund?', a: 'Refunds are initiated immediately after cancellation. Depending on your bank, it typically takes 5-7 business days for the amount to reflect in your source account.' },
        { q: 'Is my payment transaction secure?', a: 'Yes, we use industry-standard SSL encryption and secure payment gateways to ensure your financial data is always protected.' }
      ]
    },
    {
      category: 'Cancellations & Modifications',
      questions: [
        { q: 'How do I cancel my booking?', a: 'You can cancel your booking via the \"My Bookings\" section. Click on the booking details and select the \"Cancel\" option. Refund will be calculated based on the cancellation policy.' },
        { q: 'Can I modify my journey date after booking?', a: 'Currently, direct modification of travel dates is not supported. You would need to cancel your existing booking and make a new one.' },
        { q: 'What happens if the bus is cancelled by the operator?', a: 'In the rare event that a bus is cancelled by the operator, you will receive a 100% refund of the ticket fare.' }
      ]
    }
  ];

  return (
    <PageWrapper className="pb-24">
      {/* Header */}
      <div className="bg-slate-950 py-32 relative overflow-hidden text-center">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[100px] -mr-[250px] -mt-[250px]"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] -ml-[250px] -mb-[250px]"></div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 rounded-full text-primary-500 text-sm font-bold tracking-wider uppercase mb-8">
            <HelpCircle className="w-4 h-4" />
            Knowledge Base
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight">Got questions? <br/>We have <span className="text-primary-500 underline decoration-primary-500/30 underline-offset-8 italic">answers.</span></h1>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about using SmartBus, from booking your first ticket to managing refunds and insurance.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-16 relative z-20">
        <div className="space-y-12">
          {faqData.map((category, catIdx) => (
            <div key={catIdx}>
              <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <div className="w-2 h-8 bg-primary-500 rounded-full"></div>
                {category.category}
              </h2>
              
              <div className="space-y-4">
                {category.questions.map((faq, idx) => {
                  const globalIdx = `${catIdx}-${idx}`;
                  const isOpen = openIndex === globalIdx;
                  
                  return (
                    <div 
                      key={idx} 
                      className={`bg-white border rounded-3xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-primary-500 shadow-xl shadow-primary-500/5' : 'border-slate-100 shadow-sm'}`}
                    >
                      <button 
                        onClick={() => setOpenIndex(isOpen ? null : globalIdx)}
                        className="w-full text-left p-6 md:p-8 flex items-center justify-between gap-4 group"
                      >
                        <span className={`text-lg font-bold transition-colors ${isOpen ? 'text-primary-500' : 'text-slate-900 group-hover:text-primary-500'}`}>
                          {faq.q}
                        </span>
                        <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isOpen ? 'bg-primary-500 text-white rotate-180' : 'bg-slate-50 text-slate-400'}`}>
                          <ChevronDown className="w-5 h-5" />
                        </div>
                      </button>
                      
                      <div className={`transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-[500px]' : 'max-h-0'}`}>
                        <div className="p-6 md:p-8 pt-0 text-slate-600 text-lg leading-relaxed border-t border-slate-50">
                          {faq.a}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Support CTA */}
        <div className="mt-24 p-12 bg-slate-50 rounded-[40px] border border-slate-100 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
           <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center shrink-0">
              <Info className="w-10 h-10 text-primary-500" />
           </div>
           <div className="flex-1">
              <h3 className="text-2xl font-black text-slate-900 mb-2">Can't find what you're looking for?</h3>
              <p className="text-slate-600">Our dedicated support team is available 24/7 to answer your specific queries.</p>
           </div>
           <button 
             onClick={openChat}
             className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black hover:bg-primary-500 transition-all shadow-xl hover:-translate-y-1 block text-center"
           >
              Talk to Support
           </button>
        </div>
      </div>
    </PageWrapper>
  );
};

export default FAQ;
