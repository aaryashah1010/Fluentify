import React from 'react';
import { ChevronRight } from 'lucide-react';

const LANGUAGE_OPTIONS = ['Spanish', 'French', 'German', 'English'];

const buildTitleOptions = (language, level) => {
  if (!language || !level) return [];
  const base = language.trim();

  switch (level) {
    case 'Beginner':
      return [`${base} for Beginners`];
    case 'Intermediate':
      return [`${base} for Intermediate`];
    case 'Advanced':
      return [`${base} for Advanced Learners`];
    default:
      return [`${base} Course`];
  }
};

const CourseForm = ({ courseData, onChange, disabled = false, onNext }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onChange({
      ...courseData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const titleOptions = buildTitleOptions(courseData.language, courseData.level);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Language */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Language <span className="text-red-500">*</span>
          </label>
          <select
            name="language"
            value={courseData.language || ''}
            onChange={handleChange}
            disabled={disabled}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          >
            <option value="">Select Language</option>
            {LANGUAGE_OPTIONS.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        {/* Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
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
        <select
          name="title"
          value={courseData.title || ''}
          onChange={handleChange}
          disabled={disabled || !courseData.language || !courseData.level}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
        >
          <option value="">Select Course Title</option>
          {titleOptions.map((title) => (
            <option key={title} value={title}>
              {title}
            </option>
          ))}
        </select>
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
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* Estimated Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estimated Duration
          </label>
          <select
            name="estimated_duration"
            value={courseData.estimated_duration || ''}
            onChange={handleChange}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          >
            <option value="">Select Duration</option>
            <option value="1 month">1 month</option>
            <option value="3 months">3 months</option>
            <option value="6 months">6 months</option>
            <option value="1 year">1 year</option>
          </select>
        </div>
      </div>

      {/* Is Published + Next */}
      <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center">
          <input
            type="checkbox"
            name="is_published"
            id="is_published"
            checked={courseData.is_published || false}
            onChange={handleChange}
            disabled={disabled}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="is_published" className="ml-2 text-sm font-medium text-gray-700">
            Publish this course (make it visible to learners)
          </label>
        </div>

        {onNext && !disabled && (
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#F29A36] via-[#A8C79B] to-[#56D7C5] text-white text-sm font-medium shadow-sm hover:opacity-90 transition-colors self-start"
          >
            <ChevronRight className="w-4 h-4" />
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseForm;
