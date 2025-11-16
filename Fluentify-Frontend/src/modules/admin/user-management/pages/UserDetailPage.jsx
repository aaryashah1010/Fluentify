import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { getLearnerDetails, updateLearner } from '../../../../api/admin';

const Kpi = ({ label, value }) => (
  <div className="bg-gradient-to-br from-orange-50 to-teal-50 border border-orange-200 rounded-xl p-4 shadow-sm">
    <div className="text-sm text-gray-600">{label}</div>
    <div className="text-2xl font-bold text-gray-900 mt-1">{value ?? '-'}</div>
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

      if (payload?.user) {
        setForm({
          name: payload.user.name || '',
          email: payload.user.email || ''
        });
      }
    } catch (e) {
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
      await updateLearner(userId, {
        name: form.name,
        email: form.email
      });
      setEdit(false);
      await load();
    } catch (e) {
      setError(e?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center text-gray-600">
        Loading...
      </div>
    );
  }

  if (!data || !data.user) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-50 border border-red-300 rounded-xl p-4">
          <p className="text-red-700">
            {error || 'User not found or failed to load details'}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-3 text-sm text-red-600 hover:text-red-700"
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  const { user, summary, courses = [] } = data;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">

      {/* BACK + REFRESH */}
      <div className="flex items-center justify-between">
        <button
          className="text-sm px-4 py-2 rounded-lg bg-gradient-to-r from-orange-100 to-teal-100 
                     text-gray-700 font-medium shadow hover:shadow-md transition"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg 
                     bg-white border border-teal-300 shadow-sm hover:bg-teal-50 
                     disabled:opacity-50 transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* PROFILE CARD */}
      <div className="bg-white border border-orange-200 rounded-2xl p-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Learner Profile</h2>
            <p className="text-sm text-gray-600">Manage user information</p>
          </div>

          {!edit && (
            <button
              onClick={() => setEdit(true)}
              className="px-4 py-2 rounded-lg border border-orange-300 
                         text-orange-700 bg-orange-50 hover:bg-orange-100 shadow-sm transition"
            >
              Edit
            </button>
          )}
        </div>

        {/* VIEW MODE */}
        {!edit ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium text-gray-900">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-900">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Joined</p>
              <p className="font-medium text-gray-900">
                {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Verified</p>
              <p className="font-medium text-gray-900">
                {user.is_email_verified ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
        ) : (
          // EDIT MODE
          <div className="space-y-4 mt-3">
            <div>
              <label className="text-sm text-gray-600">Name</label>
              <input
                className="w-full mt-1 px-3 py-2 rounded-lg border border-orange-300 bg-orange-50 
                           focus:ring-teal-400 focus:border-teal-400 transition"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                className="w-full mt-1 px-3 py-2 rounded-lg border border-teal-300 bg-teal-50 
                           focus:ring-orange-400 focus:border-orange-400 transition"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <div className="flex gap-3">
              <button
                onClick={() => setEdit(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 
                           hover:bg-gray-200 transition"
              >
                Cancel
              </button>

              <button
                onClick={onSave}
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-teal-500 
                           text-white font-semibold shadow hover:shadow-lg transition disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* PROGRESS SUMMARY */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-3">Progress Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <Kpi label="Total XP" value={summary?.total_xp} />
          <Kpi label="Lessons Completed" value={summary?.lessons_completed} />
          <Kpi label="Units Completed" value={summary?.units_completed} />
          <Kpi label="Current Streak" value={summary?.current_streak} />
          <Kpi label="Longest Streak" value={summary?.longest_streak} />
          <Kpi
            label="Last Activity"
            value={
              summary?.last_activity_date
                ? new Date(summary.last_activity_date).toLocaleDateString()
                : '-'
            }
          />
        </div>
      </div>

      {/* ENROLLED COURSES */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-3">Enrolled Courses</h3>

        <div className="bg-white border border-teal-200 rounded-xl shadow-sm overflow-x-auto">
          <table className="min-w-full divide-y divide-teal-200">
            <thead className="bg-gradient-to-r from-orange-100 to-teal-100">
              <tr>
                {['Title', 'Language', 'Type', 'Duration', 'Enrolled', 'Progress', 'Lessons', 'Units']
                  .map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {courses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-center text-gray-500">
                    No courses enrolled
                  </td>
                </tr>
              ) : (
                courses.map((c) => (
                  <tr key={c.id} className="hover:bg-teal-50 transition">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {c.title || c.course_data?.title || 'Untitled Course'}
                    </td>
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
                      {c.created_at
                        ? new Date(c.created_at).toLocaleDateString()
                        : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {c.progress_percentage ?? 0}%
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {c.lessons_completed ?? 0} / {c.total_lessons ?? 0}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {c.units_completed ?? 0} / {c.total_units ?? 0}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default UserDetailPage;
