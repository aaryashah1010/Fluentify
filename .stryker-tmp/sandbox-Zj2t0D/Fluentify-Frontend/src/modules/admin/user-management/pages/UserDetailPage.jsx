// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { getLearnerDetails, updateLearner } from '../../../../api/admin';

const Kpi = ({ label, value }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4">
    <div className="text-sm text-gray-500">{label}</div>
    <div className="text-2xl font-semibold text-gray-900 mt-1">{value ?? '-'}</div>
  </div>
);

const UserDetailPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ name: '', email: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const resp = await getLearnerDetails(userId);
      const payload = resp.data || resp;
      setData(payload);
      // Safe access to user data with fallbacks
      if (payload?.user) {
        setForm({ name: payload.user.name || '', email: payload.user.email || '' });
      }
    } catch (e) {
      console.error('Error loading learner details:', e);
      // Don't set error if it's a 401 (user will be redirected by ProtectedRoute)
      if (e.status !== 401) {
        setError(e?.message || 'Failed to load user details');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [userId]);

  const onSave = async () => {
    setSaving(true);
    setError('');
    try {
      await updateLearner(userId, { name: form.name, email: form.email });
      setEdit(false);
      await load();
    } catch (e) {
      setError(e?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="max-w-6xl mx-auto p-6">Loading...</div>;
  }

  if (!data || !data.user) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error || 'User not found or failed to load user details'}</p>
          <button 
            onClick={() => navigate(-1)} 
            className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  const { user, summary, courses = [] } = data;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <button className="text-sm text-indigo-600" onClick={() => navigate(-1)}>&larr; Back</button>
        <button 
          onClick={load} 
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </button>
      </div>

      {/* Basic Info */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Learner Profile</h2>
            <p className="text-sm text-gray-600">Manage basic information</p>
          </div>
          {!edit && (
            <button className="px-3 py-1.5 border rounded" onClick={() => setEdit(true)}>Edit</button>
          )}
        </div>

        {!edit ? (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">Name</div>
              <div className="text-gray-900">{user.name}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Email</div>
              <div className="text-gray-900">{user.email}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Joined</div>
              <div className="text-gray-900">{new Date(user.created_at).toLocaleDateString()}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Verified</div>
              <div className="text-gray-900">{user.is_email_verified ? 'Yes' : 'No'}</div>
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Name</label>
              <input className="w-full border rounded px-3 py-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <input className="w-full border rounded px-3 py-2" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            {error && <div className="text-sm text-red-600">{error}</div>}
            <div className="space-x-2">
              <button className="px-3 py-1.5 border rounded" onClick={() => setEdit(false)}>Cancel</button>
              <button className="px-3 py-1.5 border rounded bg-indigo-600 text-white disabled:opacity-50" disabled={saving} onClick={onSave}>{saving ? 'Saving...' : 'Save'}</button>
            </div>
          </div>
        )}
      </div>

      {/* Progress Summary */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Progress Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <Kpi label="Total XP" value={summary?.total_xp} />
          <Kpi label="Lessons Completed" value={summary?.lessons_completed} />
          <Kpi label="Units Completed" value={summary?.units_completed} />
          <Kpi label="Current Streak" value={summary?.current_streak} />
          <Kpi label="Longest Streak" value={summary?.longest_streak} />
          <Kpi label="Last Activity" value={summary?.last_activity_date ? new Date(summary.last_activity_date).toLocaleDateString() : '-'} />
        </div>
      </div>

      {/* Courses */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Enrolled Courses</h3>
        <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Language</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lessons</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.length === 0 ? (
                <tr><td className="px-4 py-6 text-center text-gray-500" colSpan={8}>No courses found</td></tr>
              ) : courses.map((c) => (
                <tr key={c.id}>
                  {/* FIX: Display title correctly for both AI and admin courses */}
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {c.title || c.course_data?.title || 'Untitled Course'}
                  </td>
                  {/* FIX: Display language correctly for both AI and admin courses */}
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {c.language || c.course_data?.language || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        c.course_type === 'ai'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {c.course_type === 'ai' ? 'AI' : 'Admin'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {c.expected_duration || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {c.created_at ? new Date(c.created_at).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{c.progress_percentage ?? 0}%</td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {c.lessons_completed ?? 0} / {c.total_lessons ?? 0}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {c.units_completed ?? 0} / {c.total_units ?? 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;