import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePublishedCourseDetails } from '../../hooks/usePublishedModules';
import { ArrowLeft, BookOpen, Loader2, ChevronDown, ChevronUp } from 'lucide-react';

const ModuleCourseDetailsPage = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { data: course, isLoading, error } = usePublishedCourseDetails(courseId);
  const [expandedUnits, setExpandedUnits] = useState({});

  const toggleUnit = (unitId) => {
    setExpandedUnits((prev) => ({
      ...prev,
      [unitId]: !prev[unitId],
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">
            {error?.message || 'Failed to load course details'}
          </p>
        </div>
      </div>
    );
  }

  const units = course.units || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{course.title}</h2>
          <p className="text-gray-600 mt-1">{course.description}</p>
        </div>
      </div>

      {/* Course Info */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">Level</p>
            <p className="text-lg font-semibold text-gray-900">{course.level || 'Beginner'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Duration</p>
            <p className="text-lg font-semibold text-gray-900">
              {course.estimated_duration || 'Not specified'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Units</p>
            <p className="text-lg font-semibold text-gray-900">{units.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Lessons</p>
            <p className="text-lg font-semibold text-gray-900">
              {units.reduce((sum, unit) => sum + (unit.lessons?.length || 0), 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Units and Lessons */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">Course Content</h3>

        {units.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No units available in this course</p>
          </div>
        ) : (
          <div className="space-y-3">
            {units.map((unit, unitIndex) => (
              <div key={unit.id} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Unit Header */}
                <button
                  onClick={() => toggleUnit(unit.id)}
                  className="w-full p-4 bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 text-left flex-1">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full text-blue-600 font-semibold text-sm">
                      {unitIndex + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{unit.title}</h4>
                      <p className="text-sm text-gray-600">{unit.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {unit.lessons?.length || 0} lessons
                    </span>
                    {expandedUnits[unit.id] ? (
                      <ChevronUp className="w-5 h-5 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                </button>

                {/* Lessons List */}
                {expandedUnits[unit.id] && (
                  <div className="bg-orange-50/40 border-t border-orange-100">
                    {unit.lessons && unit.lessons.length > 0 ? (
                      <div className="px-4 py-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                        {unit.lessons.map((lesson, lessonIndex) => (
                          <div
                            key={lesson.id}
                            className="rounded-2xl bg-white border border-orange-100 shadow-sm p-4 flex flex-col gap-2"
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex items-center justify-center w-7 h-7 bg-gradient-to-br from-orange-400 to-teal-400 rounded-full text-white text-xs font-semibold">
                                {lessonIndex + 1}
                              </div>
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-900">{lesson.title}</h5>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                  {lesson.description || 'No description'}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 mt-2">
                              <span className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-100">
                                {lesson.content_type || 'Lesson'}
                              </span>
                              {lesson.xp_reward != null && (
                                <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-100">
                                  +{lesson.xp_reward} XP
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-600">
                        No lessons in this unit
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleCourseDetailsPage;
