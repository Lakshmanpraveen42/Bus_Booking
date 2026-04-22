import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import { Database, MousePointer2, Settings, ShieldCheck, HelpCircle, Info } from 'lucide-react';

const CookiePolicy = () => {
  const cookieTypes = [
    {
      title: 'Essential Cookies',
      description: 'These are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences or logging in.',
      icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />
    },
    {
      title: 'Performance Cookies',
      description: 'These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site.',
      icon: <Database className="w-6 h-6 text-blue-500" />
    },
    {
      title: 'Functional Cookies',
      description: 'These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we have added to our pages.',
      icon: <Settings className="w-6 h-6 text-amber-500" />
    },
    {
      title: 'Targeting Cookies',
      description: 'These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant adverts on other sites.',
      icon: <MousePointer2 className="w-6 h-6 text-purple-500" />
    }
  ];

  return (
    <PageWrapper className="pb-24">
      {/* Header Section */}
      <div className="bg-slate-950 py-24 relative overflow-hidden text-center">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -ml-48 -mb-48"></div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full text-emerald-400 text-sm font-bold tracking-wider uppercase mb-6">
            <Database className="w-4 h-4" />
            Cookie Settings
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">Cookie Policy</h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic.
          </p>
          <div className="mt-8 text-sm text-slate-500 font-medium italic">
            Last Updated: April 22, 2026
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-5xl mx-auto px-4 -mt-12 relative z-20">
        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 p-8 md:p-16 border border-slate-100">
          <div className="prose prose-slate max-w-none mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-6">What are cookies?</h2>
            <p className="text-slate-600 text-xl leading-relaxed">
              Cookies are small text files that are used to store small pieces of information. They are stored on your device when the website is loaded on your browser. These cookies help us make the website function properly, make it more secure, provide better user experience, and understand how the website performs and to analyze what works and where it needs improvement.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {cookieTypes.map((type, index) => (
              <div key={index} className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:border-primary-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/5 group">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform duration-300">
                  {type.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{type.title}</h3>
                <p className="text-slate-600 leading-relaxed">
                  {type.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-12 border-t border-slate-100 flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">How can I control cookie preferences?</h3>
              <p className="text-slate-600 leading-relaxed">
                You can manage your cookies preferences by clicking on the "Settings" or "Cookie Banner" on our website. In addition to this, different browsers provide different methods to block and delete cookies used by websites. You can change the settings of your browser to block/delete the cookies.
              </p>
            </div>
            <div className="w-full md:w-auto">
              <button className="w-full md:w-auto px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-primary-500 transition-all duration-300 shadow-lg shadow-slate-900/10 active:scale-95">
                Manage Preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default CookiePolicy;
