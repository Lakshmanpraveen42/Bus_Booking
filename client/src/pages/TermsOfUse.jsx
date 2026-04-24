import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import { FileText, CheckCircle, Scale, AlertOctagon, HelpCircle, Info } from 'lucide-react';

const TermsOfUse = () => {
  const sections = [
    {
      title: 'Acceptance of Terms',
      content: 'By accessing or using the BusGo platform, you agree to be bound by these Terms of Use and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.'
    },
    {
      title: 'Booking and Payments',
      content: 'All bookings are subject to availability and the terms of the respective bus operators. Payments must be made in full at the time of booking. All transactions are processed securely through our trusted payment partners.'
    },
    {
      title: 'Cancellation and Refunds',
      content: 'Cancellation policies vary by operator. Refunds, where applicable, will be processed according to the operator\'s policy and may be subject to service fees. Please check the specific terms before finalizing your booking.'
    },
    {
      title: 'User Obligations',
      content: 'You agree to provide accurate and complete information during the booking process. You are responsible for maintaining the confidentiality of your account details and for all activities that occur under your account.'
    },
    {
      title: 'Limitation of Liability',
      content: 'BusGo acts as an intermediary between you and the bus operators. We are not liable for any delays, cancellations, or service issues caused by the operators. Our liability is limited to the extent permitted by law.'
    },
    {
      title: 'Changes to Terms',
      content: 'We reserve the right to modify these terms at any time without prior notice. Your continued use of the platform after any changes constitutes your acceptance of the new Terms of Use.'
    }
  ];

  return (
    <PageWrapper className="pb-24">
      {/* Header Section */}
      <div className="bg-slate-950 py-24 relative overflow-hidden text-center">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl -ml-48 -mb-48"></div>

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full text-blue-400 text-sm font-bold tracking-wider uppercase mb-6">
            <Scale className="w-4 h-4" />
            Legal Framework
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">Terms of Use</h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Welcome to SmartBus. By using our services, you agree to the following terms and conditions designed to ensure a safe and reliable experience for everyone.
          </p>
          <div className="mt-8 text-sm text-slate-500 font-medium italic">
            Last Updated: April 22, 2026
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 -mt-12 relative z-20">
        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 p-8 md:p-16 border border-slate-100">
          <div className="space-y-12">
            {sections.map((section, index) => (
              <div key={index} className="flex gap-6 md:gap-10">
                <div className="hidden sm:flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs ring-4 ring-slate-50 shrink-0">
                    {index + 1}
                  </div>
                  {index !== sections.length - 1 && <div className="w-px h-full bg-slate-100 my-4"></div>}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{section.title}</h3>
                  <p className="text-slate-600 leading-loose text-lg">
                    {section.content}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 p-8 bg-slate-50 rounded-2xl border border-slate-100 flex gap-6 items-start">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
              <HelpCircle className="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Need clarification?</h4>
              <p className="text-slate-600">
                If you have any questions regarding these terms, our legal team is here to help. Reach out to us via the contact form or email us directly at legal@smartbus.com.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default TermsOfUse;
