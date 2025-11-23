import React from 'react';

const CourseForm = ({ courseData, onChange, disabled = false }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onChange({
      ...courseData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Language */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Language <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="language"
            value={courseData.language || ''}
            onChange={handleChange}
            disabled={disabled}
            required
            className="w-full px-3 py-2 rounded-xl bg-slate-900/70 border border-white/10 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-slate-900/40"
            placeholder="e.g., Spanish, French"
          />
        </div>

        {/* Level */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Level <span className="text-red-500">*</span>
          </label>
          <select
            name="level"
            value={courseData.level || ''}
            onChange={handleChange}
            disabled={disabled}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          >
            <option value="">Select Level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Course Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={courseData.title || ''}
          onChange={handleChange}
          disabled={disabled}
          required
          className="w-full px-3 py-2 rounded-xl bg-slate-900/70 border border-white/10 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-slate-900/40"
          placeholder="e.g., Spanish for Beginners"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={courseData.description || ''}
          onChange={handleChange}
          disabled={disabled}
          rows={4}
          className="w-full px-3 py-2 rounded-xl bg-slate-900/70 border border-white/10 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-slate-900/40"
          placeholder="Describe what students will learn in this course..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Thumbnail URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Thumbnail URL
          </label>
          <input
            type="url"
            name="thumbnail_url"
            value={courseData.thumbnail_url || ''}
            onChange={handleChange}
            disabled={disabled}
            className="w-full px-3 py-2 rounded-xl bg-slate-900/70 border border-white/10 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-slate-900/40"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* Estimated Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estimated Duration
          </label>
          <input
            type="text"
            name="estimated_duration"
            value={courseData.estimated_duration || ''}
            onChange={handleChange}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            placeholder="e.g., 3 months, 6 weeks"
          />
        </div>
      </div>

      {/* Is Published */}
      <div className="flex items-center">
        <input
          type="checkbox"
          name="is_published"
          id="is_published"
          checked={courseData.is_published || false}
          onChange={handleChange}
          disabled={disabled}
          className="w-4 h-4 text-teal-500 border-white/20 rounded focus:ring-teal-500 bg-slate-900/80"
        />
        <label htmlFor="is_published" className="ml-2 text-sm font-medium text-slate-300">
          Publish this course (make it visible to learners)
        </label>
      </div>
    </div>
  );
};

export default CourseForm;
