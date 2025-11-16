import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserDetails, useUpdateUser, useDeleteUser } from '../../../../hooks/useUserManagement';
import {
  Loader2,
  ArrowLeft,
  Mail,
  Calendar,
  BookOpen,
  Edit2,
  Save,
  X,
  Trash2
} from 'lucide-react';

const UserDetailsPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useUserDetails(userId);
  const user = {
  ...data?.user,
  courses: data?.courses || []
};


  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '' });

  React.useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      await updateUserMutation.mutateAsync({
        userId,
        userData: editForm
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this user?')) {
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
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12 text-slate-600">
        User not found
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Back Button */}
      <button
        onClick={() => navigate('/admin/users')}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Users
      </button>

      {/* User Info Card */}
      <div className="rounded-3xl bg-white border border-orange-200 shadow-md p-6">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-extrabold bg-gradient-to-r from-orange-600 to-teal-600 bg-clip-text text-transparent">
            User Details
          </h2>

          <div className="flex gap-2">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium
                  bg-orange-50 text-orange-600 rounded-xl hover:bg-orange-100"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>

                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium
                  bg-red-50 text-red-600 rounded-xl hover:bg-red-100"
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
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium
                  bg-teal-600 text-white rounded-xl hover:bg-teal-700 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {updateUserMutation.isPending ? 'Saving...' : 'Save'}
                </button>

                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditForm({ name: user.name, email: user.email });
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium
                  bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {/* Basic Info */}
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm text-slate-600 mb-1">Name</label>
            {isEditing ? (
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-500"
              />
            ) : (
              <p className="text-slate-900">{user.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-slate-600 mb-1 flex items-center gap-1">
              <Mail className="w-4 h-4" /> Email
            </label>

            {isEditing ? (
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="w-full px-3 py-2 border border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-500"
              />
            ) : (
              <p className="text-slate-900">{user.email}</p>
            )}
          </div>

          {/* Join Date */}
          <div>
            <label className="block text-sm text-slate-600 mb-1 flex items-center gap-1">
              <Calendar className="w-4 h-4" /> Member Since
            </label>

            <p className="text-slate-900">
              {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Course Progress */}
      {user.courses && user.courses.length > 0 && (
        <div className="rounded-3xl bg-white border border-teal-200 shadow-md p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            Course Progress
          </h3>

          <div className="space-y-4">
            {user.courses.map((course) => (
              <div key={course.id} className="border border-slate-200 rounded-xl p-4">

                {/* Title */}
                <div className="flex justify-between mb-2">
                  <h4 className="font-semibold text-slate-900">{course.title}</h4>
                  <span className={`px-2 py-1 rounded text-xs ${
                    course.is_completed
                      ? 'bg-green-100 text-green-700'
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {course.is_completed ? 'Completed' : `${course.progress_percentage}%`}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-200 h-2 rounded-full mb-3">
                  <div
                    className={`h-2 rounded-full ${
                      course.is_completed ? 'bg-green-600' : 'bg-teal-500'
                    }`}
                    style={{ width: `${course.progress_percentage}%` }}
                  />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 text-center gap-2">
                  <div>
                    <p className="text-xs text-slate-500">Lessons</p>
                    <p className="font-semibold">{course.lessons_completed}/{course.total_lessons}</p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Units</p>
                    <p className="font-semibold">{course.units_completed}/{course.total_units}</p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">XP Earned</p>
                    <p className="font-semibold">{course.total_xp}</p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Streak</p>
                    <p className="font-semibold">{course.current_streak} days</p>
                  </div>
                </div>

                {/* Last Activity */}
                <div className="flex justify-between text-xs text-slate-500 mt-3 border-t pt-2">
                  {course.last_accessed && (
                    <span>Last accessed: {new Date(course.last_accessed).toLocaleDateString()}</span>
                  )}
                  {course.last_activity_date && (
                    <span>Last activity: {new Date(course.last_activity_date).toLocaleDateString()}</span>
                  )}
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Courses */}
      {(!user.courses || user.courses.length === 0) && (
        <div className="rounded-3xl bg-white border border-slate-200 shadow-md p-6 text-center">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-600">No courses yet</p>
        </div>
      )}
    </div>
  );
};

export default UserDetailsPage;
