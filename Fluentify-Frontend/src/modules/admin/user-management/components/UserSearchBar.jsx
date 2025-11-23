import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

export const UserSearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative rounded-xl border border-white/10 bg-slate-900/80 shadow-[0_0_18px_rgba(56,189,248,0.25)] focus-within:shadow-[0_0_22px_rgba(56,189,248,0.45)] transition-shadow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users by name or email..."
          className="w-full pl-10 pr-10 py-3 bg-transparent text-slate-50 placeholder-slate-500 focus:outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </form>
  );
};
