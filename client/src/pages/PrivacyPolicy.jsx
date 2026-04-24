import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import { Shield, Lock, Eye, FileText, Bell, Mail } from 'lucide-react';

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: <Eye className="w-6 h-6 text-primary-500" />,
      title: 'Information We Collect',
      content: 'We collect information you provide directly to us when you book a bus ticket, create an account, or contact our support team. This includes your name, email address, phone number, and payment information.'
    },
    {
      icon: <Shield className="w-6 h-6 text-primary-500" />,
      title: 'How We Use Your Information',
      content: 'We use the information we collect to process your bookings, communicate with you about your trips, provide customer support, and improve our services. We may also send you promotional offers if you have opted in.'
    },
    {
      icon: <Lock className="w-6 h-6 text-primary-500" />,
      title: 'Data Security',
      content: 'We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, or alteration. Your payment details are encrypted using Secure Socket Layer (SSL) technology.'
    },
    {
      icon: <FileText className="w-6 h-6 text-primary-500" />,
      title: 'Information Sharing',
      content: 'We do not sell or rent your personal information to third parties. We only share your data with bus operators and service providers necessary to complete your booking and provide our services.'
    },
    {
      icon: <Bell className="w-6 h-6 text-primary-500" />,
      title: 'Your Rights',
      content: 'You have the right to access, update, or delete your personal information. You can manage your preferences through your account settings or by contacting our support team.'
    },
    {
      icon: <Mail className="w-6 h-6 text-primary-500" />,
      title: 'Contact Us',
      content: 'If you have any questions or concerns about our Privacy Policy, please contact us at privacy@smartbus.com or through our contact page.'
    }
  ];

  return (
    <PageWrapper className="pb-24">
      {/* Header Section */}
      <div className="bg-slate-950 py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -ml-48 -mb-48"></div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 rounded-full text-primary-500 text-sm font-bold tracking-wider uppercase mb-6">
            <Shield className="w-4 h-4" />
            Privacy Center
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">Privacy Policy</h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Your privacy is our top priority. Learn how we protect your data and maintain your trust at SmartBus.
          </p>
          <div className="mt-8 text-sm text-slate-500 font-medium italic">
            Last Updated: April 22, 2026
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-5xl mx-auto px-4 -mt-12 relative z-20">
        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 p-8 md:p-16 border border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {sections.map((section, index) => (
              <div key={index} className="group">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-50 transition-colors duration-300">
                  {section.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{section.title}</h3>
                <p className="text-slate-600 leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-20 pt-12 border-t border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Commitment to Transparency</h2>
            <p className="text-slate-600 text-center max-w-2xl mx-auto leading-relaxed">
              At SmartBus, we believe in being fully transparent about how we handle your data. This policy is designed to help you understand what information we collect, why we collect it, and how you can manage it.
            </p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default PrivacyPolicy;
