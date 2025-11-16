import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserDetails, useUpdateUser, useDeleteUser } from '../../../../hooks/useUserManagement';
import { Loader2, ArrowLeft, Mail, Calendar, BookOpen, Edit2, Save, X, Trash2 } from 'lucide-react';

const UserDetailsPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { data: user, isLoading } = useUserDetails(userId);
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
  });

  React.useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user]);

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
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">User not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/admin/users')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Users
      </button>

      {/* User Info Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
          <div className="flex gap-2">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
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
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {updateUserMutation.isPending ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditForm({ name: user.name, email: user.email });
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            {isEditing ? (
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{user.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Mail className="w-4 h-4 inline mr-1" />
              Email
            </label>
            {isEditing ? (
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{user.email}</p>
            )}
          </div>

          {/* Created At */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="w-4 h-4 inline mr-1" />
              Member Since
            </label>
            <p className="text-gray-900">
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
      {user.courses && user.courses.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Course Progress
          </h3>
          <div className="space-y-4">
            {user.courses.map((course) => (
              <div key={course.id} className="border border-gray-200 rounded-lg p-4">
                {/* Header with title and completion status */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{course.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {course.language} • {course.total_lessons} lessons • {course.total_units} units
                    </p>
                  </div>
                  <span className={`text-sm font-medium px-2 py-1 rounded ${
                    course.is_completed 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {course.is_completed ? 'Completed' : `${course.progress_percentage}%`}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      course.is_completed ? 'bg-green-600' : 'bg-blue-600'
                    }`}
                    style={{ width: `${course.progress_percentage}%` }}
                  />
                </div>

                {/* Statistics grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Lessons</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {course.lessons_completed}/{course.total_lessons}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Units</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {course.units_completed}/{course.total_units}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">XP Earned</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {course.total_xp}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Streak</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {course.current_streak} days
                    </p>
                  </div>
                </div>

                {/* Last activity */}
                <div className="flex justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
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
      {(!user.courses || user.courses.length === 0) && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600">No courses started yet</p>
        </div>
      )}
    </div>
  );
};

export default UserDetailsPage;
