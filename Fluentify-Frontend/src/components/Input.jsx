import React from 'react';

/**
 * Input Component
 * @param {Object} props
 * @param {string} props.label - Input label
 * @param {string} props.error - Error message
 * @param {React.ReactNode} props.icon - Icon component
 * @param {string} props.className - Additional classes
 */
const Input = React.forwardRef(({
  label,
  error,
  icon,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={`w-full rounded-lg ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2 transition-colors focus:outline-none focus:ring-2 ${
            error
              ? 'border border-red-500 focus:ring-red-400 focus:border-red-400'
              : 'border border-white/15 focus:ring-teal-400/80 focus:border-teal-400/80'
          } bg-slate-900/80 text-slate-50 placeholder-slate-500 ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
