import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, LogOut, Edit2, Check, X, ArrowLeft, RefreshCw } from 'lucide-react';
import { useUserProfile, useUpdateProfile, useLogout } from '../../hooks/useAuth';
import { Button, Input, ErrorMessage, LoadingSpinner } from '../../components';

const UserProfile = () => {
  const navigate = useNavigate();
  const logout = useLogout();
  const { data: profileData, isLoading, error, refetch } = useUserProfile();
  const updateProfileMutation = useUpdateProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', contest_name: '' });
  const [editError, setEditError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Initialize form data when profile is loaded
  React.useEffect(() => {
    if (profileData?.data?.user) {
      setFormData({ 
        name: profileData.data.user.name,
        contest_name: profileData.data.user.contest_name || ''
      });
    }
  }, [profileData]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setEditError('');
    setSuccessMessage('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setEditError('');
    setSuccessMessage('');

    if (!formData.name || formData.name.trim().length < 2) {
      setEditError('Name must be at least 2 characters');
      return;
    }

    if (!/^[a-zA-Z\s'-]+$/.test(formData.name.trim())) {
      setEditError('Name can only contain letters, spaces, hyphens, and apostrophes');
      return;
    }

    // Validate contest_name if provided
    if (formData.contest_name && formData.contest_name.trim().length > 50) {
      setEditError('Contest name must be 50 characters or less');
      return;
    }

    try {
      const updates = { 
        name: formData.name.trim(),
        contest_name: formData.contest_name.trim() || null
      };
      
      await updateProfileMutation.mutateAsync(updates, {
        onSuccess: () => {
          setIsEditing(false);
          setSuccessMessage('Profile updated successfully!');
          setTimeout(() => setSuccessMessage(''), 3000);
        },
      });
    } catch (err) {
      setEditError(err.message || 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    if (profileData?.data?.user) {
      setFormData({ 
        name: profileData.data.user.name,
        contest_name: profileData.data.user.contest_name || ''
      });
    }
    setIsEditing(false);
    setEditError('');
    setSuccessMessage('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
        <ErrorMessage message="Failed to load profile. Please try again." />
      </div>
    );
  }

  const user = profileData?.data?.user;

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          </div>
          
          {/* Refresh Button */}
          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors disabled:opacity-50"
            title="Refresh profile data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-700">{successMessage}</p>
            </div>
          )}

          {/* Profile Header */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
            <div className="w-24 h-24 bg-indigo-500 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {user?.name || 'User'}
              </h2>
              <p className="text-gray-600">Language Learner</p>
            </div>
          </div>

          {/* Profile Information */}
          <div className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              {isEditing ? (
                <Input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full"
                  error={editError}
                  required
                />
              ) : (
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                    <p className="text-gray-900">{user?.name || 'Not set'}</p>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setIsEditing(true)}
                    icon={<Edit2 className="w-4 h-4" />}
                  >
                    Edit
                  </Button>
                </div>
              )}
            </div>

            {/* Contest Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contest Display Name
                <span className="text-gray-500 text-xs ml-2">(Optional - used in leaderboards)</span>
              </label>
              {isEditing ? (
                <Input
                  name="contest_name"
                  type="text"
                  value={formData.contest_name}
                  onChange={handleInputChange}
                  placeholder="Leave empty to use your full name"
                  className="w-full"
                  maxLength={50}
                />
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                  <p className="text-gray-900">
                    {user?.contest_name || <span className="text-gray-500">Using full name ({user?.name})</span>}
                  </p>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                This name will be displayed on contest leaderboards. Leave empty to use your full name.
              </p>
            </div>

            {/* Save/Cancel Buttons (only show when editing) */}
            {isEditing && (
              <div className="flex gap-2 pt-2">
                <Button
                  variant="success"
                  onClick={handleSave}
                  loading={updateProfileMutation.isPending}
                  disabled={updateProfileMutation.isPending}
                  icon={<Check className="w-4 h-4" />}
                  className="flex-1"
                >
                  Save Changes
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleCancel}
                  disabled={updateProfileMutation.isPending}
                  icon={<X className="w-4 h-4" />}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <p className="text-gray-900">{user?.email || 'Not set'}</p>
              </div>
            </div>

            {/* Member Since */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Member Since
              </label>
              <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <p className="text-gray-900">{formatDate(user?.created_at)}</p>
              </div>
            </div>

            {/* Email Verification Status */}
            {user?.is_email_verified !== undefined && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Verification
                </label>
                <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                  <div className={`w-2 h-2 rounded-full ${user.is_email_verified ? 'bg-green-500' : 'bg-red-500'}`} />
                  <p className="text-gray-900">
                    {user.is_email_verified ? 'Verified' : 'Not Verified'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <Button
              variant="danger"
              onClick={logout}
              className="w-full"
              icon={<LogOut className="w-4 h-4" />}
            >
              Log Out
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;

