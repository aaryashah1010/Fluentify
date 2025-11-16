import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, TrendingUp, Users, BookOpen, Brain, Activity, Calendar 
} from 'lucide-react';

import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, LineChart, Line, ResponsiveContainer
} from 'recharts';

import { getAnalytics } from '../../api/admin';

const COLORS = ['#14B8A6', '#F97316', '#06B6D4', '#0EA5E9', '#F59E0B', '#10B981'];

const AnalyticsDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await getAnalytics();
        if (response.success) {
          setData(response.data);
        } else {
          setError('Failed to load analytics data');
        }
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-700">{error}</p>

          <button
            onClick={() => navigate('/admin-dashboard')}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-orange-500 to-teal-500 text-white rounded-xl shadow-md hover:shadow-lg transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const { summary, languageDistribution, moduleUsage, aiPerformance, userEngagement, dailyActivity } = data;

  let popularLanguages = [];

  if (languageDistribution?.length > 0) {
  const maxCount = Math.max(...languageDistribution.map(l => l.count));
  popularLanguages = languageDistribution
    .filter(lang => lang.count === maxCount)
    .map(lang => lang.language_name);
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50">
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin-dashboard')}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="
              text-2xl font-extrabold
              bg-gradient-to-r from-orange-500 via-amber-600 to-teal-500
              bg-clip-text text-transparent
            ">
              Platform Analytics
            </h1>
          </div>

          <p className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleString()}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 mb-10">
          
          {/* Total Lessons */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Lessons</p>
                <p className="text-3xl font-extrabold text-gray-900">{summary?.totalLessons || 0}</p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-orange-400 to-teal-400">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          {/* Active Users */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Users</p>
                <p className="text-3xl font-extrabold text-gray-900">{summary?.totalActiveUsers || 0}</p>
              </div>
              <div className="p-4 rounded-xl bg-teal-100">
                <Users className="w-7 h-7 text-teal-600" />
              </div>
            </div>
          </div>

          {/* Popular Language */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Popular Language</p>
                <p className="text-2xl font-semibold">{popularLanguages.length > 0 ? popularLanguages.join(", ") : "N/A"}</p>
              </div>
              <div className="p-4 rounded-xl bg-orange-100">
                <TrendingUp className="w-7 h-7 text-orange-500" />
              </div>
            </div>
          </div>

          {/* AI Success */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">AI Success Rate</p>
                <p className="text-3xl font-extrabold">{summary?.aiSuccessRate || '0%'}</p>
              </div>
              <div className="p-4 rounded-xl bg-teal-100">
                <Brain className="w-7 h-7 text-teal-600" />
              </div>
            </div>
          </div>

        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Language Distribution */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Language Distribution</h3>
            {languageDistribution?.length ? (
              <ResponsiveContainer width="100%" height={320}>
                <PieChart margin={{ top: 40, bottom: 40 }}>
                  <Pie
                    data={languageDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    labelRadius={150}
                    dataKey="count"
                    nameKey="language_name"
                    label={({ payload, percent }) =>
                      `${payload.language_name}: ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={true}
                  >
                    {languageDistribution.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => [
                      value,
                      props.payload.language_name
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <Calendar className="w-14 h-14 opacity-50 mb-2" />
                <p>No data available</p>
              </div>
            )}
          </div>

          {/* Module Usage */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Module Usage (Admin vs AI)</h3>

            {moduleUsage?.length ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={moduleUsage}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="module_type" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#14B8A6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                No module usage data
              </div>
            )}
          </div>
        </div>

        {/* AI Performance & Engagement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          
          {/* AI Performance */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Performance</h3>
            
            <div className="space-y-4 text-gray-700">
              <div className="flex justify-between">
                <span>Total Generations</span>
                <span className="font-semibold">{aiPerformance?.total_generations || 0}</span>
              </div>

              <div className="flex justify-between">
                <span>Successful</span>
                <span className="font-semibold text-teal-600">{aiPerformance?.success_count || 0}</span>
              </div>

              <div className="flex justify-between">
                <span>Failed</span>
                <span className="font-semibold text-red-500">{aiPerformance?.failure_count || 0}</span>
              </div>

              {/* Progress Bar */}
              {aiPerformance?.total_generations > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-500 mb-1">
                    <span>Success Rate</span>
                    <span>
                      {(
                        (aiPerformance.success_count / aiPerformance.total_generations) * 100
                      ).toFixed(1)}%
                    </span>
                  </div>

                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-gradient-to-r from-teal-400 to-orange-400 rounded-full"
                      style={{
                        width: `${
                          (aiPerformance.success_count / aiPerformance.total_generations) * 100
                        }%`
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* User Engagement */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Engagement</h3>

            <div className="space-y-4 text-gray-700">
              <div className="flex justify-between">
                <span>Active Users (30 days)</span>
                <span className="font-semibold">{userEngagement?.total_active_users || 0}</span>
              </div>

              <div className="flex justify-between">
                <span>Avg. Lessons per User</span>
                <span className="font-semibold">{userEngagement?.avg_lessons_per_user
                  ? Number(userEngagement.avg_lessons_per_user).toFixed(2)
                  : "0.00"}</span>
              </div>

              <div className="flex justify-between">
                <span>Most Active User</span>
                <span className="font-semibold">{userEngagement?.max_lessons_per_user || 0} lessons</span>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Activity */}
        {dailyActivity?.length > 0 && (
          <div className="mt-10 bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-5">Daily Activity (Last 30 Days)</h3>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={[...dailyActivity]
                  .sort((a, b) => new Date(a.date) - new Date(b.date))
                  .slice(-30)
                }
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(v) => new Date(v).toLocaleDateString()}
                />
                <YAxis />
                <Tooltip labelFormatter={(v) => new Date(v).toLocaleDateString()} />
                <Legend />
                <Line type="monotone" dataKey="total_activities" stroke="#F97316" strokeWidth={3} />
                <Line type="monotone" dataKey="active_users" stroke="#14B8A6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

      </main>
    </div>
  );
};

export default AnalyticsDashboard;
