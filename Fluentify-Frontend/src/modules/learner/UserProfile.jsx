import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, LogOut, Edit2, Check, X, ArrowLeft, BookOpen, CheckCircle, Globe } from 'lucide-react';
import { useUserProfile, useUpdateProfile, useLogout } from '../../hooks/useAuth';
import { useCourses } from '../../hooks/useCourses';
import { Button, Input, ErrorMessage, LoadingSpinner } from '../../components';

const UserProfile = () => {
  const navigate = useNavigate();
  const logout = useLogout();
  const { data: profileData, isLoading, error, refetch } = useUserProfile();
  const updateProfileMutation = useUpdateProfile();
  const { data: courses = [] } = useCourses();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', contest_name: '' });
  const [editError, setEditError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const totalCourses = courses.length;
  const totalLessonsCompleted = courses.reduce(
    (acc, course) => acc + Number(course.progress?.lessonsCompleted || 0),
    0
  );

  const formatLessonsCompleted = (value) => {
    if (!value) return '0';
    if (value < 10) return value.toString().padStart(2, '0');
    return value.toString();
  };

  const LANGUAGE_FLAGS = {
    spanish: '🇪🇸',
    french: '🇫🇷',
    german: '🇩🇪',
    japanese: '🇯🇵',
    hindi: '🇮🇳',
    italian: '🇮🇹',
    english: '🇬🇧',
  };

  const getLanguageFlag = (languageName) => {
    if (!languageName || typeof languageName !== 'string') return '🌐';
    const key = languageName.toLowerCase();
    return LANGUAGE_FLAGS[key] || '🌐';
  };

  const user =
    profileData?.data?.user ||
    profileData?.user ||
    profileData?.data ||
    profileData ||
    null;

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        contest_name: user.contest_name || '',
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setEditError('');
    setSuccessMessage('');
  };

  const handleSave = async () => {
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

    if (formData.contest_name && formData.contest_name.trim().length > 50) {
      setEditError('Contest name must be 50 characters or less');
      return;
    }

    try {
      const updates = {
        name: formData.name.trim(),
        contest_name: formData.contest_name.trim() || null,
      };

      await updateProfileMutation.mutateAsync(updates);
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      refetch();
    } catch (err) {
      setEditError(err?.message || 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        contest_name: user.contest_name || '',
      });
    }
    setIsEditing(false);
    setEditError('');
    setSuccessMessage('');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-900 via-orange-900 to-slate-950 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-900 via-orange-900 to-slate-950 flex items-center justify-center p-4">
        <ErrorMessage message="Failed to load profile. Please try again." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-orange-900 to-slate-950">

      <header className="bg-gradient-to-r from-slate-950/95 via-slate-900/90 to-slate-950/95 border-b border-white/10 sticky top-0 z-40 shadow-lg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-slate-200 hover:text-orange-300 hover:bg-white/5 p-2 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Dashboard</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-slate-900/90 rounded-3xl shadow-2xl border border-white/10 p-8">
          {successMessage && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 font-medium">
              <p>{successMessage}</p>
            </div>
          )}

          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/10">
            <div className="w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-r from-orange-400 to-teal-400">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-50 mb-1">{user.name || 'User'}</h2>
              <p className="text-slate-300">Account Management</p>
            </div>
          </div>

          <section className="mb-10">
            <h3 className="text-lg font-semibold text-slate-50 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-teal-600" />
              Statistics
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-900/85 border border-teal-500/50 rounded-2xl px-5 py-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-white">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-300">Courses</p>
                  <p className="text-2xl font-bold text-slate-50">{totalCourses}</p>
                </div>
              </div>
              <div className="bg-slate-900/85 border border-emerald-500/50 rounded-2xl px-5 py-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-300">Lessons Completed</p>
                  <p className="text-2xl font-bold text-slate-50">{formatLessonsCompleted(totalLessonsCompleted)}</p>
                </div>
              </div>
            </div>
          </section>

          <div className="space-y-8">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Full Name</label>
              {isEditing ? (
                <Input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={editError && editError.includes('Name') ? editError : ''}
                  required
                />
              ) : (
                <div className="bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3 flex justify-between items-center">
                  <p className="text-slate-50 font-medium">{user.name || 'Not set'}</p>
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

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Contest Display Name
                <span className="text-slate-300 text-xs ml-2">(Optional - used in leaderboards)</span>
              </label>
              {isEditing ? (
                <Input
                  name="contest_name"
                  type="text"
                  value={formData.contest_name}
                  onChange={handleInputChange}
                  placeholder="Leave empty to use your full name"
                  maxLength={50}
                />
              ) : (
                <div className="bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3">
                  <p className="text-slate-50">
                    {user.contest_name || (
                      <span className="text-slate-300">Using full name ({user.name})</span>
                    )}
                  </p>
                </div>
              )}
              <p className="text-xs text-slate-300 mt-1">
                This name will be displayed on contest leaderboards. Leave empty to use your full name.
              </p>
            </div>

            {courses.length > 0 && (
              <section className="mt-10 pt-8 border-t border-white/10">
                <h3 className="text-lg font-semibold text-slate-50 mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-teal-600" />
                  Languages Learning
                </h3>
                <div className="space-y-4">
                  {courses.map((course) => {
                    const pct = course.progress?.progressPercentage || 0;
                    return (
                      <div
                        key={course.id}
                        className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 flex flex-col gap-3"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-slate-800 flex items-center justify-center text-2xl">
                            {getLanguageFlag(course.language)}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-slate-50">
                              {course.language || 'Language'}
                            </p>
                            <p className="text-xs text-slate-300 truncate">
                              {course.title || 'AI generated course'}
                            </p>
                          </div>
                          <p className="text-sm font-semibold text-teal-600">{pct}%</p>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {isEditing && (
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="secondary"
                  onClick={handleCancel}
                  disabled={updateProfileMutation.isPending}
                  icon={<X className="w-4 h-4" />}
                >
                  Cancel
                </Button>
                <Button
                  variant="success"
                  onClick={handleSave}
                  loading={updateProfileMutation.isPending}
                  disabled={updateProfileMutation.isPending}
                  icon={<Check className="w-4 h-4" />}
                >
                  Save Changes
                </Button>
              </div>
            )}

            {editError && !editError.includes('Name') && (
              <ErrorMessage message={editError} />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Email Address</label>
                <div className="flex items-center gap-3 bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3">
                  <Mail className="w-5 h-5 text-slate-300" />
                  <p className="text-slate-50">{user.email || 'Not set'}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Member Since</label>
                <div className="flex items-center gap-3 bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3">
                  <Calendar className="w-5 h-5 text-slate-300" />
                  <p className="text-slate-50">{formatDate(user.created_at)}</p>
                </div>
              </div>

              {user.is_email_verified !== undefined && (
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Email Verification
                  </label>
                  <div className="flex items-center gap-3 bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        user.is_email_verified ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    />
                    <p className="text-slate-50 font-medium">
                      {user.is_email_verified ? 'Verified' : 'Not Verified'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-12 pt-8 border-t border-white/10">
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
        </div>
      </main>
    </div>
  );
};

export default UserProfile;