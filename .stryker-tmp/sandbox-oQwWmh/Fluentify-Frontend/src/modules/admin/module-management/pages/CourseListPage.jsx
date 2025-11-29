// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useModuleManagement } from '../../../../hooks/useModuleManagement';
import { Plus, Edit, Trash2, ArrowLeft, BookOpen, Loader2, CheckCircle, XCircle } from 'lucide-react';

const CourseListPage = () => {
  const navigate = useNavigate();
  const { language } = useParams();
  const { courses, loading, error, fetchCoursesByLanguage, deleteCourse } = useModuleManagement();
  const [deleteConfirm, setDeleteConfirm] = useState(null);

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
      <div className="flex items-center justify-center min-h-[400px] text-slate-200">
        <Loader2 className="w-8 h-8 animate-spin text-teal-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/modules')}
            className="p-2 hover:bg-slate-800/60 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-200" />
          </button>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-50">{language} Courses</h2>
            <p className="text-sm text-slate-300 mt-1">Manage courses for {language}.</p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/admin/modules/course/new?language=${language}`)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-orange-500 text-slate-950 rounded-xl hover:from-teal-600 hover:to-orange-600 transition-colors text-sm font-medium"
        >
          <Plus className="w-5 h-5" />
          Create New Course
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-rose-950/70 border border-rose-500/60 rounded-2xl p-4">
          <p className="text-sm text-rose-100">Error: {error}</p>
        </div>
      )}

      {/* Courses Grid */}
      {courses.length === 0 ? (
        <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-8 text-center">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-300 mb-4">No courses found for {language}</p>
          <button
            onClick={() => navigate(`/admin/modules/course/new?language=${language}`)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-orange-500 text-slate-950 rounded-xl hover:from-teal-600 hover:to-orange-600 transition-colors text-sm font-medium"
          >
            <Plus className="w-5 h-5" />
            Create First Course
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/85 overflow-hidden shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all"
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
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-base text-slate-50 line-clamp-2">
                    {course.title}
                  </h3>
                  {course.is_published ? (
                    <CheckCircle className="w-5 h-5 text-emerald-300 flex-shrink-0 ml-2" />
                  ) : (
                    <XCircle className="w-5 h-5 text-slate-500 flex-shrink-0 ml-2" />
                  )}
                </div>

                <p className="text-xs text-slate-300 mb-3 line-clamp-2">
                  {course.description || 'No description'}
                </p>

                <div className="flex items-center gap-4 text-[11px] text-slate-400 mb-4">
                  <span className="px-2 py-1 bg-slate-800/80 text-teal-200 rounded border border-white/10">
                    {course.level}
                  </span>
                  <span>{course.unit_count || 0} units</span>
                  <span>{course.lesson_count || 0} lessons</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/admin/modules/course/edit/${course.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-teal-500 to-orange-500 text-slate-950 rounded-xl hover:from-teal-600 hover:to-orange-600 transition-colors text-xs font-medium"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(course.id)}
                    className="px-3 py-2 bg-rose-950/60 text-rose-300 rounded-xl border border-rose-500/40 hover:bg-rose-900/80 transition-colors text-xs font-medium"
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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-950/95 border border-white/10 rounded-3xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-lg font-semibold text-slate-50 mb-2">Delete Course</h3>
            <p className="text-sm text-slate-300 mb-6">
              Are you sure you want to delete this course? This will also delete all units and lessons. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 text-xs font-medium text-slate-100 bg-slate-900/80 hover:bg-slate-800/80 rounded-xl border border-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 text-xs font-medium text-slate-50 bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors"
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