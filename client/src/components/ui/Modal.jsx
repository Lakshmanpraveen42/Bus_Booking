import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Content */}
      <div className="relative bg-white w-full max-w-lg rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden animate-zoom-in">
        <div className="flex items-center justify-between p-6 border-b border-slate-50">
          <h3 className="text-xl font-black text-slate-900">{title}</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
