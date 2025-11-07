import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePublishedCoursesByLanguage } from '../../../hooks/useCourses';
import { ArrowLeft, BookOpen, Loader2, ChevronRight } from 'lucide-react';

const PublishedCourseList = () => {
  const navigate = useNavigate();
  const { language } = useParams();
  const { data: courses = [], isLoading: loading, error } = usePublishedCoursesByLanguage(language);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-600 mb-4">Error: {error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/learner/modules')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{language} Courses</h2>
          <p className="text-gray-600 mt-1">Explore available courses for {language}</p>
        </div>
      </div>

      {/* Courses Grid */}
      {courses.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-4">No courses found for {language}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <button
              key={course.id}
              onClick={() => navigate(`/learner/course/${course.id}`)}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow text-left"
            >
              {/* Course Thumbnail */}
              {course.thumbnail_url ? (
                <img
                  src={course.thumbnail_url}
                  alt={course.title}
                  className="w-full h-40 object-cover"
                />
              ) : (
                <div className="w-full h-40 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-white" />
                </div>
              )}

              {/* Course Info */}
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 mb-2">
                  {course.title}
                </h3>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {course.description || 'No description'}
                </p>

                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                    {course.level}
                  </span>
                  <span>{course.total_units || 0} units</span>
                  <span>{course.total_lessons || 0} lessons</span>
                </div>

                {/* Enroll Button */}
                <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  <ChevronRight className="w-4 h-4" />
                  Explore
                </button>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublishedCourseList;
