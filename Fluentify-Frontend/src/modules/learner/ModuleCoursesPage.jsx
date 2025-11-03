import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePublishedCoursesByLanguage } from '../../hooks/usePublishedModules';
import { ArrowLeft, BookOpen, Loader2 } from 'lucide-react';

const ModuleCoursesPage = () => {
  const navigate = useNavigate();
  const { language } = useParams();
  const { data: courses = [], isLoading, error } = usePublishedCoursesByLanguage(language);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/language-modules')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{language} Courses</h2>
          <p className="text-gray-600 mt-1">Available courses for {language}</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Error: {error.message || 'Failed to load courses'}</p>
        </div>
      )}

      {/* Courses Grid */}
      {courses.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No courses available for {language}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <button
              key={course.id}
              onClick={() => navigate(`/module-course/${course.id}`)}
              className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg hover:border-blue-300 transition-all text-left"
            >
              {/* Course Thumbnail */}
              {course.thumbnail_url ? (
                <img
                  src={course.thumbnail_url}
                  alt={course.title}
                  className="w-full h-32 object-cover rounded mb-4"
                />
              ) : (
                <div className="w-full h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded mb-4 flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
              )}

              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {course.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {course.description || 'No description'}
              </p>

              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                  {course.level || 'Beginner'}
                </span>
                <span>{course.total_units || 0} units</span>
                <span>{course.total_lessons || 0} lessons</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModuleCoursesPage;
