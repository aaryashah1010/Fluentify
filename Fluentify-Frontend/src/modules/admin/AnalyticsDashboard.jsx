import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Users, BookOpen, Brain, Activity, Calendar } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';
import { getAnalytics } from '../../api/admin';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

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
      <div className="min-h-screen bg-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <Activity className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => navigate('/admin')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const { summary, languageDistribution, moduleUsage, aiPerformance, userEngagement, dailyActivity } = data;

  return (
    <div className="min-h-screen bg-yellow-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Platform Analytics</h1>
          </div>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Lessons</p>
                <p className="text-2xl font-bold text-gray-900">{summary?.totalLessons || 0}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{summary?.totalActiveUsers || 0}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Popular Language</p>
                <p className="text-2xl font-bold text-gray-900">{summary?.mostPopularLanguage || 'N/A'}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">AI Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">{summary?.aiSuccessRate || '0%'}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Brain className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Language Distribution */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Languages</h3>
            {languageDistribution && languageDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={languageDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ language_name, percent }) => `${language_name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="language_name"
                  >
                    {languageDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No language data available</p>
                </div>
              </div>
            )}
          </div>

          {/* Module Usage */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Module Usage (Admin vs AI)</h3>
            {moduleUsage && moduleUsage.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={moduleUsage}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="module_type" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <BarChart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No module usage data available</p>
                </div>
              </div>
            )}
          </div>

          {/* AI Performance */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Generation Performance</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Generations</span>
                <span className="font-semibold">{aiPerformance?.total_generations || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Successful</span>
                <span className="font-semibold text-green-600">{aiPerformance?.success_count || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Failed</span>
                <span className="font-semibold text-red-600">{aiPerformance?.failure_count || 0}</span>
              </div>
              {aiPerformance?.total_generations > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Success Rate</span>
                    <span>{((aiPerformance.success_count / aiPerformance.total_generations) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{
                        width: `${(aiPerformance.success_count / aiPerformance.total_generations) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* User Engagement */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Engagement</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Users (30 days)</span>
                <span className="font-semibold">{userEngagement?.total_active_users || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Avg. Lessons per User</span>
                <span className="font-semibold">{userEngagement?.avg_lessons_per_user || '0.0'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Most Active User</span>
                <span className="font-semibold">{userEngagement?.max_lessons_per_user || 0} lessons</span>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Activity Chart */}
        {dailyActivity && dailyActivity.length > 0 && (
          <div className="mt-8 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Activity (Last 30 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyActivity.slice(-30)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="total_activities" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Total Activities"
                />
                <Line 
                  type="monotone" 
                  dataKey="active_users" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Active Users"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </main>
    </div>
  );
};

export default AnalyticsDashboard;
