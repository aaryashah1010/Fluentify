// @ts-nocheck
import React, { useState } from 'react';
import { BookOpen, Flame, CheckCircle, Trash2, AlertTriangle } from 'lucide-react';
import { deleteCourse } from '../../../api/courses';
import { useCourses } from '../../../hooks/useCourses';

/**
 * Course Card Component
 * @param {Object} props
 * @param {Object} props.course - Course object
 * @param {Function} props.onClick - Click handler
 */
const CourseCard = ({ course, onClick }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  // React Query refetch
  const { refetch } = useCourses();
  
  const progress = course.progress || {};
  const progressPercentage = progress.progressPercentage || 0;
  
  const handleDelete = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }
    
    try {
      setDeleting(true);
      await deleteCourse(course.id);
      await refetch(); // Refresh the courses list
    } catch (error) {
      console.error('Failed to delete course:', error);
      alert('Failed to delete course. Please try again.');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (

    <div className="bg-slate-900/85 rounded-2xl shadow-xl border border-white/10 p-6 hover:shadow-2xl hover:border-teal-400/70 transition-all overflow-hidden">
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-950 rounded-2xl p-6 max-w-sm mx-4 border border-red-500/40 shadow-2xl">
            <div className="text-center text-slate-100">
              <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <h4 className="font-semibold text-slate-50 mb-2">Delete Course?</h4>
              <p className="text-sm text-slate-300 mb-4">
                This will permanently delete "{course.title}". This action cannot be undone.
              </p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={handleCancelDelete}
                  className="px-4 py-2 text-sm bg-slate-800 text-slate-200 rounded-md hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-4 py-2 text-sm bg-red-600/90 text-white rounded-md hover:bg-red-500 disabled:opacity-60"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-lg text-slate-50 mb-1">{course.title}</h4>
          <p className="text-sm text-slate-300 mb-2">{course.language}</p>
          
          {/* Course Stats */}
          <div className="text-xs text-slate-300 mb-3">
            {course.totalUnits && course.totalLessons && (
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                <span>{course.totalUnits} units • {course.totalLessons} lessons</span>
              </div>
            )}
          </div>
          
          {/* Difficulty and Duration */}
          <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
            <span className="flex items-center gap-1 whitespace-nowrap">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              {course.expectedDuration || '3 months'}
            </span>
            <span className="flex items-center gap-1 whitespace-nowrap">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              {course.expertise || course.difficulty || 'Beginner'}
            </span>
            {course.createdAt && (
              <span className="flex items-center gap-1 whitespace-nowrap">
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                <span>{new Date(course.createdAt).toLocaleDateString()}</span>
              </span>
            )}
          </div>
        </div>
        {/* Right-side icon column: keep icons inside their squares */}
        <div className="flex flex-col gap-2 items-end flex-shrink-0">
          <div className="w-10 h-10 bg-slate-800/80 rounded-xl flex items-center justify-center border border-white/10 overflow-hidden">
            <BookOpen className="w-5 h-5 text-teal-300" />
          </div>
          {/* Delete Button */}
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="w-10 h-10 rounded-xl border border-red-500/50 bg-slate-900/80 flex items-center justify-center text-slate-300 hover:bg-red-500/20 hover:text-red-200 transition-colors disabled:opacity-50 overflow-hidden"
            title="Delete Course"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-300">Progress</span>
          <span className="font-semibold text-teal-300">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-teal-400 to-orange-400 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm text-slate-300 mb-4">
        <div className="flex items-center gap-1">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{progress.unitsCompleted || 0} units done</span>
        </div>
      </div>
      
      <button
        onClick={() => onClick(course)}
        className="w-full bg-gradient-to-r from-teal-500 to-orange-500 text-white py-2.5 rounded-xl hover:from-teal-600 hover:to-orange-600 transition-colors font-semibold shadow-md hover:shadow-lg"
      >
        {progressPercentage > 0 ? 'Continue Learning' : 'Start Course'}
      </button>
    </div>
  );
};

export default CourseCard;
