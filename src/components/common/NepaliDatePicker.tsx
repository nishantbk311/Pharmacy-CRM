

import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, X, ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface NepaliDatePickerProps {
  value: string; // Formatted YYYY-MM-DD (BS)
  onChange: (date: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
}

const NEPALI_MONTHS = [
  { id: 1, nameEn: 'Baishakh', nameNp: 'बैशाख', days: 31 },
  { id: 2, nameEn: 'Jestha', nameNp: 'जेठ', days: 31 },
  { id: 3, nameEn: 'Ashadh', nameNp: 'असार', days: 32 },
  { id: 4, nameEn: 'Shrawan', nameNp: 'साउन', days: 32 },
  { id: 5, nameEn: 'Bhadra', nameNp: 'भदौ', days: 31 },
  { id: 6, nameEn: 'Ashwin', nameNp: 'असोज', days: 31 },
  { id: 7, nameEn: 'Kartik', nameNp: 'कात्तिक', days: 30 },
  { id: 8, nameEn: 'Mangsir', nameNp: 'मंसिर', days: 30 },
  { id: 9, nameEn: 'Poush', nameNp: 'पुस', days: 30 },
  { id: 10, nameEn: 'Magh', nameNp: 'माघ', days: 29 },
  { id: 11, nameEn: 'Falgun', nameNp: 'फागुन', days: 30 },
  { id: 12, nameEn: 'Chaitra', nameNp: 'चैत', days: 30 },
];

const WEEK_DAYS = [
  { en: 'SUN', np: 'आइत' },
  { en: 'MON', np: 'सोम' },
  { en: 'TUE', np: 'मङ्गल' },
  { en: 'WED', np: 'बुध' },
  { en: 'THU', np: 'बिही' },
  { en: 'FRI', np: 'शुक्र' },
  { en: 'SAT', np: 'शनि' },
];

const YEARS = Array.from({ length: 26 }, (_, i) => 2070 + i); // 2070 to 2095

export const NepaliDatePicker: React.FC<NepaliDatePickerProps> = ({
  value,
  onChange,
  label,
  placeholder = 'Select BS date',
  className = '',
  inputClassName = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openAbove, setOpenAbove] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleOpen = () => {
    if (!isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      if (spaceBelow < 350 && spaceAbove > spaceBelow) {
        setOpenAbove(true);
      } else {
        setOpenAbove(false);
      }
    }
    setIsOpen(prev => !prev);
  };

  // Parse initial state or fallback to 2083-04-17
  const parseBsDate = (val: string) => {
    if (!val) return { year: 2083, month: 4, day: 17 };
    const parts = val.split('-').map(p => parseInt(p, 10));
    if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
      return { year: parts[0], month: Math.min(Math.max(parts[1], 1), 12), day: parts[2] };
    }
    return { year: 2083, month: 4, day: 17 };
  };

  const parsed = parseBsDate(value);
  const [viewYear, setViewYear] = useState<number>(parsed.year);
  const [viewMonth, setViewMonth] = useState<number>(parsed.month); // 1-indexed

  // Keep view in sync when value changes externally
  useEffect(() => {
    if (value) {
      const p = parseBsDate(value);
      setViewYear(p.year);
      setViewMonth(p.month);
    }
  }, [value]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePrevMonth = () => {
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear(prev => Math.max(2070, prev - 1));
    } else {
      setViewMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear(prev => Math.min(2095, prev + 1));
    } else {
      setViewMonth(prev => prev + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const formattedMonth = String(viewMonth).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const selected = `${viewYear}-${formattedMonth}-${formattedDay}`;
    onChange(selected);
    setIsOpen(false);
  };

  const currentMonthData = NEPALI_MONTHS.find(m => m.id === viewMonth) || NEPALI_MONTHS[3];

  // Calculate starting day offset for the month grid
  const startOffset = (viewYear * 12 + viewMonth * 3 + 2) % 7;

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1 mb-1">
          <CalendarIcon className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span>{label}</span>
        </label>
      )}

      {/* Input box */}
      <div className="relative flex items-center" onClick={toggleOpen}>
        <input
          type="text"
          readOnly
          value={value}
          placeholder={placeholder}
          className={`w-full pl-3 pr-12 py-2 rounded-xl border ${
            isOpen
              ? 'border-blue-500 dark:border-blue-500 ring-2 ring-blue-500/20'
              : 'border-slate-300 dark:border-slate-700/80'
          } bg-white dark:bg-[#121f35] text-slate-800 dark:text-slate-200 text-xs font-medium focus:outline-none shadow-xs cursor-pointer select-none ${inputClassName}`}
        />
        
        {value ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange('');
            }}
            className="absolute right-9 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded cursor-pointer"
            title="Clear date"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : null}

        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-[#101b2d] px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800 pointer-events-none uppercase">
          BS
        </span>
      </div>

      {/* Nepali Calendar Popup Modal */}
      {isOpen && (
        <div className={`absolute left-0 ${openAbove ? 'bottom-full mb-1.5' : 'top-full mt-1.5'} z-[100] w-72 sm:w-80 bg-white dark:bg-[#0f1b2d] border border-slate-200 dark:border-slate-700/90 rounded-2xl shadow-2xl p-4 text-slate-800 dark:text-slate-100 transition-all animate-in fade-in zoom-in-95 duration-150`}>
          {/* Header */}
          <div className="flex items-center justify-between gap-1 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Month & Year Dropdowns */}
            <div className="flex items-center gap-1.5">
              <select
                value={viewMonth}
                onChange={e => setViewMonth(Number(e.target.value))}
                className="px-2.5 py-1 bg-slate-100 dark:bg-[#101b2d] border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-hidden cursor-pointer"
              >
                {NEPALI_MONTHS.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.nameEn} ({m.nameNp})
                  </option>
                ))}
              </select>

              <select
                value={viewYear}
                onChange={e => setViewYear(Number(e.target.value))}
                className="px-2.5 py-1 bg-slate-100 dark:bg-[#101b2d] border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-hidden cursor-pointer"
              >
                {YEARS.map(y => (
                  <option key={y} value={y}>
                    {y} BS
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Weekday Labels Header */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {WEEK_DAYS.map((w, i) => (
              <div
                key={i}
                className={`text-[10px] font-bold uppercase py-1 ${
                  i === 6
                    ? 'text-rose-500 dark:text-rose-400'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {w.en}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {/* Empty Offset cells */}
            {Array.from({ length: startOffset }).map((_, idx) => (
              <div key={`offset-${idx}`} className="h-8" />
            ))}

            {/* Days 1 to month.days */}
            {Array.from({ length: currentMonthData.days }).map((_, idx) => {
              const dayNum = idx + 1;
              const formattedM = String(viewMonth).padStart(2, '0');
              const formattedD = String(dayNum).padStart(2, '0');
              const dayDateStr = `${viewYear}-${formattedM}-${formattedD}`;
              const isSelected = value === dayDateStr;
              const dayOfWeek = (startOffset + idx) % 7;
              const isSaturday = dayOfWeek === 6;

              return (
                <button
                  key={dayNum}
                  type="button"
                  onClick={() => handleSelectDay(dayNum)}
                  className={`h-8 w-full rounded-lg text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 scale-105'
                      : isSaturday
                      ? 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>

          {/* Footer Quick Actions */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
            <button
              type="button"
              onClick={() => {
                onChange('2083-04-17');
                setViewYear(2083);
                setViewMonth(4);
                setIsOpen(false);
              }}
              className="text-blue-600 dark:text-sky-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" /> Today (2083-04-17)
            </button>

            <span className="text-[10px] text-slate-400 font-medium">
              {currentMonthData.nameEn} {viewYear} BS
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

