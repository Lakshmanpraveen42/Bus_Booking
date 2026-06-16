import React, { useState, useRef, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, eachDayOfInterval, isBefore, startOfToday } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

const CustomDatePicker = ({ selectedDate, onChange, minDate = startOfToday(), className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());
  const containerRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateClick = (day) => {
    if (isBefore(day, minDate) && !isSameDay(day, minDate)) return;
    onChange(day);
    setIsOpen(false);
  };

  const renderHeader = () => (
    <div className="flex items-center justify-between mb-4 px-1">
      <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wider">
        {format(currentMonth, 'MMMM yyyy')}
      </h2>
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const renderDays = () => {
    const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map((day) => (
          <div key={day} className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, i) => {
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isToday = isSameDay(day, new Date());
          const isDisabled = isBefore(day, minDate) && !isSameDay(day, minDate);
          const isCurrentMonth = isSameMonth(day, monthStart);

          return (
            <div
              key={i}
              onClick={() => !isDisabled && handleDateClick(day)}
              className={`
                relative p-2 text-sm font-bold cursor-pointer transition-all duration-200 rounded-lg text-center
                ${!isCurrentMonth ? 'text-gray-200' : ''}
                ${isDisabled ? 'text-gray-300 cursor-not-allowed opacity-50' : 'hover:bg-gray-50'}
                ${isSelected ? 'bg-red-500 text-white font-extrabold shadow-md shadow-red-200 hover:bg-red-600' : 'text-gray-700'}
                ${isToday && !isSelected ? 'border border-red-500 text-red-500' : ''}
              `}
            >
              {format(day, 'd')}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-4 bg-white border-2 border-transparent focus-within:border-red-500 rounded-2xl shadow-sm cursor-pointer group transition-all"
      >
        <CalendarIcon className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
        <div className="flex-1">
          <input
            readOnly
            value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
            placeholder="Select Date"
            className="w-full bg-transparent text-gray-900 font-bold outline-none cursor-pointer placeholder:text-gray-300"
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-3 p-5 bg-white border border-gray-100 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-[999] min-w-[320px] animate-fade-in">
          {renderHeader()}
          {renderDays()}
          {renderCells()}
          
          <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
            <button 
              type="button"
              onClick={() => { onChange(new Date()); setIsOpen(false); }}
              className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors"
            >
              Today
            </button>
            <button 
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;
