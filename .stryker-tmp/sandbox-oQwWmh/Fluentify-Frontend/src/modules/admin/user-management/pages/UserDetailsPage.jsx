// @ts-nocheck
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserDetails, useUpdateUser, useDeleteUser } from '../../../../hooks/useUserManagement';
import { Loader2, ArrowLeft, Mail, Calendar, BookOpen, Edit2, Save, X, Trash2 } from 'lucide-react';

const UserDetailsPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { data: userData, isLoading } = useUserDetails(userId);
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
  });

  React.useEffect(() => {
    if (userData && userData.user) {
      setEditForm({
        name: userData.user.name || '',
        email: userData.user.email || '',
      });
    }
  }, [userData]);

  const handleSave = async () => {
    try {
      await updateUserMutation.mutateAsync({
        userId,
        userData: editForm,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await deleteUserMutation.mutateAsync(userId);
        navigate('/admin/users');
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12 text-slate-200">
        <Loader2 className="w-8 h-8 animate-spin text-teal-400" />
      </div>
    );
  }

  if (!userData || !userData.user) {
    return (
      <div className="text-center py-12 text-slate-200">
        <p className="text-sm text-slate-300">User not found</p>
      </div>
    );
  }

  const { user, courses = [] } = userData;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/admin/users')}
        className="flex items-center gap-2 text-slate-300 hover:text-slate-100 text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Users
      </button>

      {/* User Info Card */}
      <div className="rounded-3xl border border-white/10 bg-slate-900/85 p-6 shadow-xl hover:shadow-2xl transition-all">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-slate-50">User Details</h2>
          <div className="flex gap-2">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-900 bg-gradient-to-r from-teal-500 to-orange-500 rounded-xl shadow-md hover:shadow-lg"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-rose-200 bg-rose-900/60 rounded-xl border border-rose-500/50 hover:bg-rose-800/80"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={updateUserMutation.isPending}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-900 bg-gradient-to-r from-teal-500 to-orange-500 rounded-xl shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {updateUserMutation.isPending ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditForm({ name: user.name, email: user.email });
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-200 bg-slate-800 rounded-xl hover:bg-slate-700"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
            {isEditing ? (
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-white/15 rounded-lg bg-slate-950/60 text-slate-50 placeholder-slate-500 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            ) : (
              <p className="text-slate-50">{user.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              <Mail className="w-4 h-4 inline mr-1" />
              Email
            </label>
            {isEditing ? (
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="w-full px-3 py-2 border border-white/15 rounded-lg bg-slate-950/60 text-slate-50 placeholder-slate-500 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            ) : (
              <p className="text-slate-50">{user.email}</p>
            )}
          </div>

          {/* Created At */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              <Calendar className="w-4 h-4 inline mr-1" />
              Member Since
            </label>
            <p className="text-slate-50">
              {new Date(user.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Course Progress */}
      {courses && courses.length > 0 && (
        <div className="rounded-3xl border border-white/10 bg-slate-900/85 p-6 shadow-xl hover:shadow-2xl transition-all">
          <h3 className="text-xl font-bold text-slate-50 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-300" />
            Course Progress
          </h3>
          <div className="space-y-4">
            {courses.map((course) => (
              <div key={course.id} className="border border-white/10 rounded-2xl p-4 bg-slate-950/60">
                {/* Header with title and completion status */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-slate-50">{course.title}</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      {course.language} • {course.total_lessons} lessons • {course.total_units} units
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      course.is_completed
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/60'
                        : 'bg-sky-500/20 text-sky-200 border border-sky-400/60'
                    }`}
                  >
                    {course.is_completed ? 'Completed' : `${course.progress_percentage}%`}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 rounded-full h-2 mb-3">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      course.is_completed ? 'bg-emerald-400' : 'bg-sky-400'
                    }`}
                    style={{ width: `${course.progress_percentage}%` }}
                  />
                </div>

                {/* Statistics grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  <div className="text-center">
                    <p className="text-xs text-slate-400">Lessons</p>
                    <p className="text-sm font-semibold text-slate-50">
                      {course.lessons_completed}/{course.total_lessons}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-400">Units</p>
                    <p className="text-sm font-semibold text-slate-50">
                      {course.units_completed}/{course.total_units}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-400">XP Earned</p>
                    <p className="text-sm font-semibold text-slate-50">
                      {course.total_xp}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-400">Streak</p>
                    <p className="text-sm font-semibold text-slate-50">
                      {course.current_streak} days
                    </p>
                  </div>
                </div>

                {/* Last activity */}
                <div className="flex justify-between text-xs text-slate-400 pt-2 border-t border-white/10">
                  {course.last_accessed && (
                    <span>
                      Last accessed: {new Date(course.last_accessed).toLocaleDateString()}
                    </span>
                  )}
                  {course.last_activity_date && (
                    <span>
                      Last activity: {new Date(course.last_activity_date).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Courses */}
      {(!courses || courses.length === 0) && (
        <div className="rounded-3xl border border-white/10 bg-slate-900/85 p-6 text-center shadow-xl">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <p className="text-sm text-slate-300">No courses started yet</p>
        </div>
      )}
    </div>
  );
};

export default UserDetailsPage;