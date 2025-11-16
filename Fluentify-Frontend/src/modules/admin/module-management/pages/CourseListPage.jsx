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
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
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
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{language} Courses</h2>
            <p className="text-gray-600 mt-1">Manage courses for {language}</p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/admin/modules/course/new?language=${language}`)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
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
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-4">No courses found for {language}</p>
          <button
            onClick={() => navigate(`/admin/modules/course/new?language=${language}`)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create First Course
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
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
                  <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                    {course.title}
                  </h3>
                  {course.is_published ? (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 ml-2" />
                  ) : (
                    <XCircle className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {course.description || 'No description'}
                </p>

                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                    {course.level}
                  </span>
                  <span>{course.unit_count || 0} units</span>
                  <span>{course.lesson_count || 0} lessons</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/admin/modules/course/edit/${course.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(course.id)}
                    className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
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
