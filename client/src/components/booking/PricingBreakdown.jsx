import React from 'react';
import { formatPrice } from '../../utils/formatters';
import { Info } from 'lucide-react';

const Line = ({ label, value, bold = false, large = false, highlight = false }) => (
  <div className={['flex justify-between items-center', bold ? 'py-2' : 'py-1'].join(' ')}>
    <span className={['text-slate-500', bold ? 'text-sm font-medium text-slate-700' : 'text-sm'].join(' ')}>
      {label}
    </span>
    <span className={[
      highlight ? 'text-primary-600' : 'text-slate-800',
      bold ? 'font-bold' : 'font-medium',
      large ? 'text-lg' : 'text-sm',
    ].join(' ')}>
      {value}
    </span>
  </div>
);

/**
 * Pricing breakdown: base fare + GST + total.
 */
const PricingBreakdown = ({ pricing, seatCount }) => (
  <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-5">
    <h3 className="font-semibold text-slate-800 mb-4">Fare Breakdown</h3>

    <div className="space-y-0.5">
      <Line
        label={`Base Fare (${seatCount} × ${formatPrice(Math.round(pricing.baseFare / seatCount))})`}
        value={formatPrice(pricing.baseFare)}
      />
      <Line
        label={
          <span className="flex items-center gap-1">
            GST (5%)
            <Info className="w-3 h-3 text-slate-300" />
          </span>
        }
        value={formatPrice(pricing.gst)}
      />
    </div>

    <div className="border-t border-slate-200 mt-3 pt-3">
      <Line label="Total Amount" value={formatPrice(pricing.total)} bold large highlight />
    </div>

    <p className="text-xs text-slate-400 mt-3 flex items-center gap-1">
      <Info className="w-3 h-3" />
      All fares are inclusive of applicable taxes.
    </p>
  </div>
);

export default PricingBreakdown;
