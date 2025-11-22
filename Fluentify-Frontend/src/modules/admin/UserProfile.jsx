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
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin-dashboard')}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm hover:bg-slate-50"
            >
              <ArrowLeft className="w-4 h-4 text-slate-700" />
            </button>
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400 font-semibold">
                Account
              </p>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900">My Profile</h1>
            </div>
          </div>

          <button
            onClick={logout}
            className="hidden sm:inline-flex items-center gap-2 rounded-full border border-red-100 bg-white px-3 py-1.5 text-xs font-medium text-red-600 shadow-sm hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-5">
        {/* Gradient strip similar to dashboard */}
        <section className="rounded-2xl bg-gradient-to-r from-indigo-50 via-sky-50 to-emerald-50 border border-slate-100 px-5 py-4 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500 font-semibold mb-1">
              Fluentify Admin
            </p>
            <h2 className="text-base sm:text-lg font-semibold text-slate-900">
              Personal profile & account info
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Update your display name and review account details.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center rounded-full bg-white/70 px-3 py-1 border border-slate-100 text-slate-600 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-2" />
              Profile active
            </span>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-7">
          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-700">
              {successMessage}
            </div>
          )}

          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-slate-200">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-indigo-500 rounded-full flex items-center justify-center shadow-sm">
              <User className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1 truncate">
                {user?.name || 'User'}
              </h2>
              <p className="text-sm text-slate-500">Platform Administrator</p>
              <p className="mt-1 text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>

          {/* Profile Information */}
          <div className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-[0.16em]">
                Full Name
              </label>
              {isEditing ? (
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="flex-1"
                    error={editError}
                    required
                  />
                  <div className="flex gap-2 sm:w-auto">
                    <Button
                      variant="success"
                      onClick={handleSave}
                      loading={updateProfileMutation.isPending}
                      disabled={updateProfileMutation.isPending}
                      icon={<Check className="w-4 h-4" />}
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
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                    <p className="text-slate-900 text-sm">{user?.name || 'Not set'}</p>
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
              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-[0.16em]">
                Email Address
              </label>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                <Mail className="w-5 h-5 text-slate-400" />
                <p className="text-slate-900 text-sm break-all">{user?.email || 'Not set'}</p>
              </div>
            </div>

            {/* Member Since */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-[0.16em]">
                Member Since
              </label>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                <Calendar className="w-5 h-5 text-slate-400" />
                <p className="text-slate-900 text-sm">{formatDate(user?.created_at)}</p>
              </div>
            </div>

            {/* Email Verification Status */}
            {user?.is_email_verified !== undefined && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-[0.16em]">
                  Email Verification
                </label>
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                  <div className={`w-2 h-2 rounded-full ${user.is_email_verified ? 'bg-green-500' : 'bg-red-500'}`} />
                  <p className="text-slate-900 text-sm">
                    {user.is_email_verified ? 'Verified' : 'Not Verified'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Logout Button (mobile/extra) */}
          <div className="mt-8 pt-6 border-t border-slate-200 sm:hidden">
            <Button
              variant="danger"
              onClick={logout}
              className="w-full"
              icon={<LogOut className="w-4 h-4" />}
            >
              Log Out
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default UserProfile;

