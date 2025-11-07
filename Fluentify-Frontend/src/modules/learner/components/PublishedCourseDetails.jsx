import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePublishedCourseDetails } from '../../../hooks/useCourses';
import { ArrowLeft, BookOpen, Loader2, ChevronDown, ChevronUp } from 'lucide-react';

const PublishedCourseDetails = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { data: course, isLoading: loading, error } = usePublishedCourseDetails(parseInt(courseId));
  const [expandedUnits, setExpandedUnits] = useState({});

  const toggleUnit = (unitId) => {
    setExpandedUnits(prev => ({
      ...prev,
      [unitId]: !prev[unitId]
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-600 mb-4">Error: {error?.message || 'Course not found'}</p>
        <button
          onClick={() => navigate('/learner/modules')}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Back to Modules
        </button>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
          <p className="text-gray-600 mt-1">{course.language} • {course.level}</p>
        </div>
      </div>

      {/* Course Thumbnail */}
      {course.thumbnail_url ? (
        <img
          src={course.thumbnail_url}
          alt={course.title}
          className="w-full h-64 object-cover rounded-lg"
        />
      ) : (
        <div className="w-full h-64 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center rounded-lg">
          <BookOpen className="w-24 h-24 text-white" />
        </div>
      )}

      {/* Course Info */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <p className="text-gray-700 mb-4">{course.description}</p>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{course.total_units || 0}</p>
            <p className="text-sm text-gray-600">Units</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{course.total_lessons || 0}</p>
            <p className="text-sm text-gray-600">Lessons</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{course.estimated_duration}</p>
            <p className="text-sm text-gray-600">Duration</p>
          </div>
        </div>
      </div>

      {/* Units and Lessons */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Course Content</h2>
        
        {!course.units || course.units.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-600">No units available in this course yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {course.units.map((unit) => (
              <div key={unit.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                {/* Unit Header */}
                <button
                  onClick={() => toggleUnit(unit.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 text-left">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{unit.title}</h3>
                      <p className="text-sm text-gray-500">{unit.lessons?.length || 0} lessons</p>
                    </div>
                  </div>
                  {expandedUnits[unit.id] ? (
                    <ChevronUp className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  )}
                </button>

                {/* Lessons List */}
                {expandedUnits[unit.id] && (
                  <div className="border-t border-gray-200 bg-gray-50">
                    {!unit.lessons || unit.lessons.length === 0 ? (
                      <div className="p-4 text-center text-gray-600">
                        No lessons in this unit yet.
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-200">
                        {unit.lessons.map((lesson, index) => (
                          <div
                            key={lesson.id}
                            className="p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  {lesson.content_type} • {lesson.xp_reward} XP
                                </p>
                                {lesson.description && (
                                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                    {lesson.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Enroll Button */}
      <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg">
        Start Learning
      </button>
    </div>
  );
};

export default PublishedCourseDetails;
