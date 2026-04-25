import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, X } from 'lucide-react';

/**
 * A professional Searchable Select (Combobox) component.
 * Replaces standard HTML selects with a searchable, filtered dropdown.
 */
const SearchableSelect = ({ 
  options = [], 
  value, 
  onChange, 
  placeholder = "Select an option...", 
  label,
  error,
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);

  const selectedOption = options.find(opt => opt.value === value);
  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-2 w-full" ref={wrapperRef}>
      {label && (
        <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={[
            "w-full bg-slate-50 border-2 rounded-2xl p-4 text-sm font-bold text-left flex justify-between items-center transition-all",
            isOpen ? "border-primary-500 bg-white shadow-lg shadow-primary-500/5" : "border-transparent",
            error ? "border-red-500 bg-red-50/30" : ""
          ].join(' ')}
        >
          <span className={selectedOption ? 'text-slate-900' : 'text-slate-400'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown className={["w-4 h-4 text-slate-400 transition-transform", isOpen ? "rotate-180" : ""].join(' ')} />
        </button>

        {isOpen && (
          <div className="absolute z-[100] w-full mt-2 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-3 border-b border-slate-50 bg-slate-50/50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  autoFocus
                  className="w-full pl-9 pr-4 py-2.5 bg-white rounded-xl text-xs font-bold outline-none border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-primary-500 transition-all"
                  placeholder="Type to search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
              {filteredOptions.length === 0 ? (
                <div className="p-6 text-xs text-slate-400 text-center font-bold italic">
                  No matching options
                </div>
              ) : (
                filteredOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    className={[
                      "w-full px-5 py-3.5 text-left text-xs font-bold flex items-center justify-between transition-colors outline-none",
                      value === opt.value ? "bg-primary-50 text-primary-600" : "hover:bg-slate-50 text-slate-600"
                    ].join(' ')}
                  >
                    <div className="flex flex-col gap-0.5">
                       <span>{opt.label}</span>
                       {opt.sublabel && <span className="text-[9px] text-slate-400 uppercase tracking-widest">{opt.sublabel}</span>}
                    </div>
                    {value === opt.value && <Check className="w-4 h-4" />}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      
      {error && <p className="text-[10px] font-bold text-red-500 ml-1 mt-1 uppercase tracking-widest">{error}</p>}
    </div>
  );
};

export default SearchableSelect;
