import React, { useState } from 'react';
import ReactCountryFlag from 'react-country-flag';

/**
 * Custom Dropdown Component
 * @param {Object} props
 * @param {Array} props.options - Array of options (objects or strings)
 * @param {string} props.value - Selected value
 * @param {Function} props.onChange - Change handler
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.showFlags - Show country flags for language options
 */
const CustomDropdown = ({ options, value, onChange, placeholder, showFlags = false }) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (option) => {
    onChange(option.name || option);
    setOpen(false);
  };

  const selected = options.find(
    (opt) => (opt.name ? opt.name : opt) === value
  );

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full border border-white/15 rounded-xl px-4 py-3 flex items-center justify-between text-sm md:text-base bg-slate-900/80 shadow-md focus:ring-2 focus:ring-teal-500/60 hover:border-teal-400/70 transition-colors text-slate-50"
      >
        {selected ? (
          <span className="flex items-center gap-2">
            {showFlags && selected.code && (
              <ReactCountryFlag
                countryCode={selected.code}
                svg
                className="text-2xl"
              />
            )}
            <span className="text-slate-50">{selected.name || selected}</span>
          </span>
        ) : (
          <span className="text-slate-400">{placeholder}</span>
        )}
        <span
          className="text-slate-300 transition-transform text-xs md:text-sm"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          ▼
        </span>
      </button>

      {open && (
        <>
          {/* Overlay to close dropdown when clicking outside */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setOpen(false)}
          />
          
          {/* Dropdown menu */}
          <div className="absolute mt-2 w-full bg-slate-950/95 border border-white/15 rounded-xl shadow-2xl z-20 max-h-60 overflow-y-auto backdrop-blur-md">
            {options.map((opt, idx) => (
              <div
                key={opt.code || idx}
                onClick={() => handleSelect(opt)}
                className="px-4 py-3 flex items-center gap-2 cursor-pointer hover:bg-slate-800/80 transition-colors text-slate-100 text-sm"
              >
                {showFlags && opt.code && (
                  <ReactCountryFlag
                    countryCode={opt.code}
                    svg
                    className="text-2xl"
                  />
                )}
                <span>{opt.name || opt}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
;

export default CustomDropdown;
