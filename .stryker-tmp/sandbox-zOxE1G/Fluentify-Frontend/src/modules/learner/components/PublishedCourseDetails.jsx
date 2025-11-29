// @ts-nocheck
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePublishedCourseDetails } from '../../../hooks/useCourses';
import { ArrowLeft, BookOpen, Loader2, ChevronDown, ChevronUp } from 'lucide-react';

const PublishedCourseDetails = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { data: course, isLoading: loading, error } = usePublishedCourseDetails(parseInt(courseId));
  const [expandedUnits, setExpandedUnits] = useState({});
  const [showContent, setShowContent] = useState(false);

  const toggleUnit = (unitId) => {
    setExpandedUnits(prev => ({
      ...prev,
      [unitId]: !prev[unitId]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-teal-400 mx-auto"></div>
            <Loader2 className="w-6 h-6 text-teal-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-sm text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50 flex items-center justify-center px-4">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-md w-full">
          <p className="text-red-600 mb-4">Error: {error?.message || 'Course not found'}</p>
          <button
            onClick={() => navigate('/learner/modules')}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
          >
            Back to Modules
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50">
      <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-orange-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-orange-600" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {course.title}
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              {course.language} 
              <span className="mx-1">•</span>
              {course.level}
            </p>
          </div>
        </div>

        {/* Hero / Thumbnail */}
        <div className="rounded-2xl overflow-hidden bg-gradient-to-r from-orange-400 to-teal-400 shadow-md">
          <div className="w-full h-32 sm:h-40 md:h-44 flex items-center justify-center">
            {course.thumbnail_url ? (
              <img
                src={course.thumbnail_url}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <BookOpen className="w-12 h-12 md:w-16 md:h-16 text-white" />
            )}
          </div>
        </div>

        {/* Course Info */}
        <div className="bg-white/95 border border-orange-100 rounded-2xl p-4 shadow-sm">
          <p className="text-gray-700 mb-3 text-sm sm:text-base">{course.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-xl font-bold bg-gradient-to-r from-orange-400 to-teal-400 bg-clip-text text-transparent">
                {course.total_units || 0}
              </p>
              <p className="text-sm text-gray-600">Units</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold bg-gradient-to-r from-orange-400 to-teal-400 bg-clip-text text-transparent">
                {course.total_lessons || 0}
              </p>
              <p className="text-sm text-gray-600">Lessons</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold bg-gradient-to-r from-orange-400 to-teal-400 bg-clip-text text-transparent">
                {course.estimated_duration || '—'}
              </p>
              <p className="text-sm text-gray-600">Duration</p>
            </div>
          </div>
        </div>

        {/* Units and Lessons */}
        {showContent && (
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Course Content</h2>
            {!course.units || course.units.length === 0 ? (
              <div className="bg-white/80 border border-orange-100 rounded-2xl p-8 text-center shadow-sm">
                <p className="text-gray-600">No units available in this course yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {course.units.map((unit) => {
                  const lessons = unit.lessons || [];
                  return (
                    <section
                      key={unit.id}
                      className="bg-white/95 border border-orange-100 rounded-2xl shadow-sm overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => toggleUnit(unit.id)}
                        className="w-full text-left"
                      >
                        <div className="px-5 py-4 border-b border-orange-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="w-2 h-2 rounded-full bg-orange-400" />
                              <h3 className="text-lg font-semibold text-gray-900">{unit.title}</h3>
                            </div>
                            {unit.description && (
                              <p className="text-sm text-gray-600">
                                {unit.description}
                              </p>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-gray-500">
                            {lessons.length} lesson{lessons.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </button>

                      {expandedUnits[unit.id] && (
                        lessons.length === 0 ? (
                          <div className="px-5 py-4 text-sm text-gray-600 bg-orange-50/40">
                            No lessons in this unit yet.
                          </div>
                        ) : (
                          <div className="px-5 py-4 grid grid-cols-1 md:grid-cols-2 gap-3 bg-orange-50/40">
                            {lessons.map((lesson, index) => (
                              <div
                                key={lesson.id}
                                className="rounded-2xl bg-white border border-orange-100 shadow-sm p-4 flex flex-col gap-2"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="w-7 h-7 bg-gradient-to-br from-orange-400 to-teal-400 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                                    {index + 1}
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                                    {lesson.description && (
                                      <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
                                        {lesson.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 mt-2">
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-100">
                                    {lesson.content_type || 'Lesson'}
                                  </span>
                                  {lesson.xp_reward != null && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-100">
                                      {lesson.xp_reward} XP
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )
                      )}
                    </section>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Enroll Button */}
        {!showContent && (
          <button
            onClick={() => setShowContent(true)}
            className="w-full py-2.5 rounded-full bg-gradient-to-r from-orange-400 to-teal-400 text-white font-semibold text-base shadow-md hover:opacity-95 transition-colors"
          >
            Start Learning
          </button>
        )}
      </div>
    </div>
  );
};

export default PublishedCourseDetails;
