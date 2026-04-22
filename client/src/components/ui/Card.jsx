import React from 'react';

/**
 * Card container with optional hover animation.
 */
const Card = ({ children, className = '', hover = false, padding = true, ...props }) => (
  <div
    className={[
      'bg-white rounded-2xl shadow-card border border-slate-100',
      padding ? 'p-5' : '',
      hover ? 'card-hover cursor-pointer' : '',
      className,
    ].join(' ')}
    {...props}
  >
    {children}
  </div>
);

export default Card;
