import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative w-14 h-8 rounded-full border transition-colors flex-shrink-0 border-slate-300 bg-slate-100 dark:border-white/15 dark:bg-slate-800/80 ${className}`}
    >
      <span
        className={`absolute top-0.5 w-6 h-6 rounded-full bg-gradient-to-br from-teal-400 to-orange-400 shadow-md flex items-center justify-center text-white transition-transform duration-200 ${
          isDark ? 'translate-x-7' : 'translate-x-0.5'
        }`}
      >
        {isDark ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
      </span>
    </button>
  );
};

export default ThemeToggle;
