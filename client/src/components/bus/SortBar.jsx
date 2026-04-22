import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { SORT_OPTIONS } from '../../utils/constants';

const SORT_LABELS = {
  [SORT_OPTIONS.PRICE_ASC]: 'Price: Low to High',
  [SORT_OPTIONS.PRICE_DESC]: 'Price: High to Low',
  [SORT_OPTIONS.DEPARTURE_EARLY]: 'Departure: Earliest',
  [SORT_OPTIONS.DEPARTURE_LATE]: 'Departure: Latest',
  [SORT_OPTIONS.RATING]: 'Rating',
  [SORT_OPTIONS.DURATION]: 'Duration',
};

const SortBar = ({ activeSort, onSort, resultCount }) => (
  <div className="flex items-center justify-between gap-4 flex-wrap">
    <p className="text-sm text-slate-500">
      <span className="font-semibold text-slate-800">{resultCount}</span> buses found
    </p>
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-slate-500 flex items-center gap-1">
        <ArrowUpDown className="w-3 h-3" /> Sort:
      </span>
      {Object.entries(SORT_LABELS).map(([key, label]) => (
        <button
          key={key}
          onClick={() => onSort(key)}
          className={[
            'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border',
            activeSort === key
              ? 'bg-primary-500 text-white border-primary-500'
              : 'bg-white text-slate-600 border-slate-200 hover:border-primary-300 hover:text-primary-600',
          ].join(' ')}
        >
          {label}
        </button>
      ))}
    </div>
  </div>
);

export default SortBar;
