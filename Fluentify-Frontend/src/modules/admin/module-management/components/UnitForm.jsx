import React from 'react';

const UnitForm = ({ unitData, onChange, onSubmit, onCancel, onNext, loading = false }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({
      ...unitData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Unit Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={unitData.title || ''}
          onChange={handleChange}
          required
          disabled={loading}
          className="w-full px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          placeholder="e.g., Unit 1: The Absolute Basics"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={unitData.description || ''}
          onChange={handleChange}
          disabled={loading}
          rows={3}
          className="w-full px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          placeholder="Describe what this unit covers..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Difficulty */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Difficulty
          </label>
          <input
            type="text"
            name="difficulty"
            value={unitData.difficulty || 'Beginner'}
            readOnly
            className="w-full px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          />
        </div>

        {/* Estimated Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estimated Time
          </label>
          <select
            name="estimated_time"
            value={unitData.estimated_time || ''}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          >
            <option value="">Select time</option>
            <option value="5">5 min</option>
            <option value="10">10 min</option>
            <option value="15">15 min</option>
            <option value="20">20 min</option>
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="sm:flex-1 px-4 py-2 bg-gradient-to-r from-[#F29A36] via-[#A8C79B] to-[#56D7C5] text-white font-semibold rounded-full hover:opacity-90 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        {onNext && (
          <button
            type="button"
            onClick={onNext}
            disabled={loading}
            className="sm:flex-1 px-4 py-2 bg-gradient-to-r from-[#F29A36] via-[#A8C79B] to-[#56D7C5] text-white font-semibold rounded-full hover:opacity-90 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? 'Saving...' : 'Next'}
          </button>
        )}
      </div>
    </form>
  );
};

export default UnitForm;
