import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useModuleManagement } from '../../../../hooks/useModuleManagement';
import { Plus, Edit, Trash2, ArrowLeft, BookOpen, Loader2, CheckCircle, Sparkles, Target, Crown } from 'lucide-react';

const CourseListPage = () => {
  const navigate = useNavigate();
  const { language } = useParams();
  const { courses, loading, error, fetchCoursesByLanguage, deleteCourse } = useModuleManagement();
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const renderLevelIcon = (level) => {
    const key = (level || '').toLowerCase();
    if (key.includes('beginner')) {
      return <Sparkles className="w-10 h-10 text-white" />;
    }
    if (key.includes('intermediate')) {
      return <Target className="w-10 h-10 text-white" />;
    }
    if (key.includes('advanced')) {
      return <Crown className="w-10 h-10 text-white" />;
    }
    return <BookOpen className="w-10 h-10 text-white" />;
  };

  useEffect(() => {
    if (language) {
      fetchCoursesByLanguage(language);
    }
  }, [language]);

  const handleDelete = async (courseId) => {
    try {
      await deleteCourse(courseId);
      setDeleteConfirm(null);
      // Refresh the list
      fetchCoursesByLanguage(language);
    } catch (err) {
      console.error('Failed to delete course:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/modules')}
            className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-r from-[#F29A36] via-[#A8C79B] to-[#56D7C5] text-white shadow-sm hover:opacity-90 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400 font-semibold">
              Courses
            </p>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 capitalize">{language} Courses</h2>
            <p className="text-xs text-slate-500 mt-1">Manage courses, levels and content for {language}.</p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/admin/modules/course/new?language=${language}`)}
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F29A36] via-[#A8C79B] to-[#56D7C5] text-white rounded-full hover:opacity-90 transition-colors text-sm font-medium shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add New Course
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Error: {error}</p>
        </div>
      )}

      {/* Courses Grid */}
      {courses.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 mb-4 text-sm">No courses found for {language}</p>
          <button
            onClick={() => navigate(`/admin/modules/course/new?language=${language}`)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F29A36] via-[#A8C79B] to-[#56D7C5] text-white rounded-full hover:opacity-90 transition-colors text-sm font-medium shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Create First Course
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 flex flex-col"
            >
              {/* Course Thumbnail */}
              {course.thumbnail_url ? (
                <img
                  src={course.thumbnail_url}
                  alt={course.title}
                  className="w-full h-40 object-cover"
                />
              ) : (
                <div className="w-full h-40 bg-gradient-to-br from-[#F29A36] via-[#A8C79B] to-[#56D7C5] flex items-center justify-center">
                  {renderLevelIcon(course.level)}
                </div>
              )}

              {/* Course Info */}
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-base text-slate-900 line-clamp-2">
                    {course.title}
                  </h3>
                  {course.is_published && (
                    <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-medium">
                      <CheckCircle className="w-3 h-3" />
                      Published
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 mb-3 line-clamp-2">
                  {course.description || 'No description'}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mb-3">
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                    {course.level}
                  </span>
                  <span>{course.unit_count || 0} units</span>
                  <span>{course.lesson_count || 0} lessons</span>
                  {course.estimated_duration && (
                    <span>{course.estimated_duration}</span>
                  )}
                </div>

                {/* Mini meta row */}
                <div className="mb-3 flex items-center justify-between text-[10px] text-slate-400">
                  <span>
                    Last updated{' '}
                    {course.updated_at ? new Date(course.updated_at).toLocaleDateString() : 'recently'}
                  </span>
                </div>

                {/* Actions */}
                <div className="mt-auto flex gap-2">
                  <button
                    onClick={() => navigate(`/admin/modules/course/edit/${course.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-[#F29A36] via-[#A8C79B] to-[#56D7C5] text-white rounded-full hover:opacity-90 transition-colors text-xs sm:text-sm font-medium shadow-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(course.id)}
                    className="px-3 py-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/25 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Course</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this course? This will also delete all units and lessons. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseListPage;
