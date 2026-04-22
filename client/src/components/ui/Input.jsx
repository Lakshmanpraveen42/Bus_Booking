import React, { forwardRef } from 'react';

/**
 * Reusable Input field with label, error, and icon support.
 */
const Input = forwardRef(({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  className = '',
  containerClassName = '',
  ...props
}, ref) => (
  <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
    {label && (
      <label className="text-sm font-medium text-slate-700">
        {label}
        {props.required && <span className="text-primary-500 ml-0.5">*</span>}
      </label>
    )}
    <div className="relative">
      {leftIcon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {leftIcon}
        </span>
      )}
      <input
        ref={ref}
        className={[
          'w-full border rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 transition-colors duration-150',
          'focus:border-primary-500 focus:ring-2 focus:ring-primary-100',
          error ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-white hover:border-slate-300',
          leftIcon ? 'pl-10' : '',
          rightIcon ? 'pr-10' : '',
          className,
        ].join(' ')}
        {...props}
      />
      {rightIcon && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
          {rightIcon}
        </span>
      )}
    </div>
    {error && <p className="text-xs text-red-500 flex items-center gap-1">⚠ {error}</p>}
    {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
  </div>
));

Input.displayName = 'Input';

export default Input;
