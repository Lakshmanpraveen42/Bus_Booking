import React from 'react';

const variantStyles = {
  default: 'bg-slate-100 text-slate-600',
  primary: 'bg-primary-100 text-primary-700',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
};

/**
 * Badge / pill label for tags, status indicators, and counts.
 */
const Badge = ({ children, variant = 'default', className = '' }) => (
  <span
    className={[
      'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium',
      variantStyles[variant] ?? variantStyles.default,
      className,
    ].join(' ')}
  >
    {children}
  </span>
);

export default Badge;
