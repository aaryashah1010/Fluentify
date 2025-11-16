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
      <div className="relative">
        {/* Icon */}
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-500" />

        {/* Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users by name or email..."
          className="
            w-full pl-10 pr-12 py-3
            rounded-xl
            bg-white
            border border-gray-200
            shadow-sm
            text-gray-800
            placeholder-gray-400
            focus:border-transparent
            focus:ring-2 focus:ring-orange-400
            hover:border-orange-300
            transition-all duration-300
          "
        />

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="
              absolute right-3 top-1/2 -translate-y-1/2 
              text-gray-400 hover:text-red-500
              transition
            "
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </form>
  );
};
