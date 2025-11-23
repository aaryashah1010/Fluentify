import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, LogOut, Edit2, Check, X, ArrowLeft } from 'lucide-react';
import { useUserProfile, useUpdateProfile, useLogout } from '../../hooks/useAuth';
import { Button, Input, ErrorMessage, LoadingSpinner } from '../../components';

const UserProfile = () => {
  const navigate = useNavigate();
  const logout = useLogout();
  const { data: profileData, isLoading, error } = useUserProfile();
  const updateProfileMutation = useUpdateProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '' });
  const [editError, setEditError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Initialize form data when profile is loaded
  React.useEffect(() => {
    if (profileData?.data?.user) {
      setFormData({ name: profileData.data.user.name });
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

    try {
      await updateProfileMutation.mutateAsync(
        { name: formData.name.trim() },
        {
          onSuccess: () => {
            setIsEditing(false);
            setSuccessMessage('Profile updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
          },
        }
      );
    } catch (err) {
      setEditError(err.message || 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    if (profileData?.data?.user) {
      setFormData({ name: profileData.data.user.name });
    }
    setIsEditing(false);
    setEditError('');
    setSuccessMessage('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-yellow-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-yellow-50 flex items-center justify-center p-4">
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
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-orange-900 to-slate-950 text-slate-50 relative overflow-x-hidden">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-950/95 via-slate-900/90 to-slate-950/95 border-b border-white/10 shadow-lg backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin-dashboard')}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-200" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-50">My Profile</h1>
              <p className="text-xs md:text-sm text-slate-300 mt-1">Manage your admin identity and account details.</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-3xl border border-white/10 bg-slate-900/85 shadow-xl hover:shadow-2xl transition-all p-8">
          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-700">{successMessage}</p>
            </div>
          )}

          {/* Profile Header */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/10">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-500 via-sky-500 to-orange-400 flex items-center justify-center shadow-[0_0_28px_rgba(56,189,248,0.6)]">
              <User className="w-12 h-12 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-slate-50 mb-2">
                {user?.name || 'User'}
              </h2>
              <p className="text-sm text-slate-300">Platform Administrator</p>
            </div>
          </div>

          {/* Profile Information */}
          <div className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Full Name
              </label>
              {isEditing ? (
                <div className="flex gap-2">
                  <Input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="flex-1 bg-slate-950/60 border-white/15 text-slate-50 placeholder-slate-500"
                    error={editError}
                    required
                  />
                  <Button
                    variant="success"
                    onClick={handleSave}
                    loading={updateProfileMutation.isPending}
                    disabled={updateProfileMutation.isPending}
                    icon={<Check className="w-4 h-4" />}
                    className="bg-gradient-to-r from-teal-500 to-orange-500 text-white border-none hover:from-teal-600 hover:to-orange-600"
                  >
                    Save
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleCancel}
                    disabled={updateProfileMutation.isPending}
                    icon={<X className="w-4 h-4" />}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-slate-900/80 border border-white/10 rounded-lg px-4 py-3">
                    <p className="text-slate-50">{user?.name || 'Not set'}</p>
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

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <div className="flex items-center gap-3 bg-slate-900/80 border border-white/10 rounded-lg px-4 py-3">
                <Mail className="w-5 h-5 text-slate-300" />
                <p className="text-slate-50">{user?.email || 'Not set'}</p>
              </div>
            </div>

            {/* Member Since */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Member Since
              </label>
              <div className="flex items-center gap-3 bg-slate-900/80 border border-white/10 rounded-lg px-4 py-3">
                <Calendar className="w-5 h-5 text-slate-300" />
                <p className="text-slate-50">{formatDate(user?.created_at)}</p>
              </div>
            </div>

            {/* Email Verification Status */}
            {user?.is_email_verified !== undefined && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email Verification
                </label>
                <div className="flex items-center gap-3 bg-slate-900/80 border border-white/10 rounded-lg px-4 py-3">
                  <div className={`w-2 h-2 rounded-full ${user.is_email_verified ? 'bg-green-500' : 'bg-red-500'}`} />
                  <p className="text-slate-50">
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
              className="w-full bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white border-none"
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

