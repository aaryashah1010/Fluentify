import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
    try {
      const resp = await getLearnerDetails(userId);
      const payload = resp.data || resp;
      setData(payload);
      setForm({ name: payload.user.name, email: payload.user.email });
    } catch (e) {
      console.error(e);
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

  if (loading || !data) {
    return <div className="max-w-6xl mx-auto p-6">Loading...</div>;
  }

  const { user, summary, courses = [] } = data;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <button className="text-sm text-indigo-600" onClick={() => navigate(-1)}>&larr; Back</button>

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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lessons</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.length === 0 ? (
                <tr><td className="px-4 py-6 text-center text-gray-500" colSpan={5}>No courses found</td></tr>
              ) : courses.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-3 text-sm text-gray-900">{c.course_data?.title || c.title || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{c.course_data?.language || c.language || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{c.progress_percentage ?? 0}%</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{c.lessons_completed ?? 0}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{c.units_completed ?? 0}</td>
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


