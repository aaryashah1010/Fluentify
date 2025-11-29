// @ts-nocheck
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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-teal-400 mx-auto"></div>
            <Loader2 className="w-6 h-6 text-teal-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-sm text-gray-600">Loading {language} courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50 flex items-center justify-center px-4">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-md w-full">
          <p className="text-red-600 mb-4">Error: {error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/learner/modules')}
            className="p-2 rounded-full hover:bg-orange-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-orange-600" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {language}{' '}
              <span className="bg-gradient-to-r from-orange-400 to-teal-400 bg-clip-text text-transparent">
                Courses
              </span>
            </h2>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Explore available courses for {language}.
            </p>
          </div>
        </div>

        {/* Courses Grid */}
        {courses.length === 0 ? (
          <div className="bg-white/80 border border-orange-100 rounded-2xl p-10 text-center shadow-sm">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-100 to-teal-100 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-teal-500" />
            </div>
            <p className="text-gray-700 font-medium mb-1">No courses found for {language}</p>
            <p className="text-sm text-gray-500">Check back soon for new instructor-led courses.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                onClick={() => navigate(`/learner/course/${course.id}`)}
                className="bg-white/90 border border-orange-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-teal-300 transition-all text-left flex flex-col cursor-pointer"
              >
                {/* Course Thumbnail */}
                {course.thumbnail_url ? (
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-full h-40 object-cover"
                  />
                ) : (
                  <div className="w-full h-40 bg-gradient-to-br from-orange-400 to-teal-400 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-white" />
                  </div>
                )}

                {/* Course Info */}
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 mb-2">
                    {course.title}
                  </h3>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {course.description || 'No description'}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-gray-600 mb-4">
                    <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-100">
                      {course.level || 'Beginner'}
                    </span>
                    <span>{course.total_units || 0} units</span>
                    <span>{course.total_lessons || 0} lessons</span>
                  </div>

                  {/* Enroll Button */}
                  <button className="mt-auto w-full flex items-center justify-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-orange-400 to-teal-400 text-white hover:opacity-95 transition-colors text-sm">
                    <ChevronRight className="w-4 h-4" />
                    Explore
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublishedCourseList;
