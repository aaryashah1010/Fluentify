import React from 'react';

const UnitForm = ({ unitData, onChange, onSubmit, onCancel, loading = false }) => {
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
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Unit Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={unitData.title || ''}
          onChange={handleChange}
          required
          disabled={loading}
          className="w-full px-3 py-2 rounded-xl bg-slate-900/70 border border-white/10 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-slate-900/40"
          placeholder="e.g., Unit 1: The Absolute Basics"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={unitData.description || ''}
          onChange={handleChange}
          disabled={loading}
          rows={3}
          className="w-full px-3 py-2 rounded-xl bg-slate-900/70 border border-white/10 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-slate-900/40"
          placeholder="Describe what this unit covers..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Difficulty */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Difficulty
          </label>
          <select
            name="difficulty"
            value={unitData.difficulty || 'Beginner'}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-3 py-2 rounded-xl bg-slate-900/70 border border-white/10 text-slate-100 focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-slate-900/40"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        {/* Estimated Time */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Estimated Time (minutes)
          </label>
          <input
            type="number"
            name="estimated_time"
            value={unitData.estimated_time ?? ''}
            onChange={handleChange}
            disabled={loading}
            min="0"
            className="w-full px-3 py-2 rounded-xl bg-slate-900/70 border border-white/10 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-slate-900/40"
            placeholder="30"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 px-4 py-2 border border-white/15 text-slate-200 rounded-xl bg-slate-900/70 hover:bg-slate-800 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-teal-500 to-orange-500 text-slate-950 rounded-xl hover:from-teal-600 hover:to-orange-600 transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Unit'}
        </button>
      </div>
    </form>
  );
};

export default UnitForm;
