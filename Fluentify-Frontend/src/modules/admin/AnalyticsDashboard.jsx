import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Users, BookOpen, Brain, Activity, Calendar } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';
import { getAnalytics } from '../../api/admin';

// Neon-inspired palette (teal / orange / purple + supporting tones)
const COLORS = ['#22C55E', '#F97316', '#A855F7', '#06B6D4', '#FACC15', '#EC4899'];

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
      <div className="min-h-screen bg-gradient-to-br from-teal-900 via-orange-900 to-slate-950 flex items-center justify-center text-slate-50">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-500/30 border-t-orange-400"></div>
          </div>
          <p className="text-sm text-slate-200">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-900 via-orange-900 to-slate-950 flex items-center justify-center text-slate-50 px-4">
        <div className="bg-slate-950/90 border border-rose-500/40 rounded-3xl shadow-xl px-6 py-8 max-w-md w-full text-center">
          <div className="text-rose-300 mb-4 flex justify-center">
            <Activity className="w-10 h-10" />
          </div>
          <p className="text-sm text-slate-200 mb-4">{error}</p>
          <button
            onClick={() => navigate('/admin-dashboard')}
            className="mt-2 inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-xl bg-gradient-to-r from-teal-500 to-orange-500 text-white shadow-md hover:shadow-lg transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const { summary, languageDistribution, moduleUsage, aiPerformance, userEngagement, dailyActivity } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-orange-900 to-slate-950 text-slate-50 relative overflow-x-hidden">
      {/* Floating background accents */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-24 right-24 text-7xl opacity-20 animate-bounce" style={{ animationDuration: '3.2s' }}>📈</div>
        <div className="absolute top-40 left-16 text-6xl opacity-20 animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.6s' }}>📊</div>
        <div className="absolute bottom-40 right-32 text-7xl opacity-20 animate-bounce" style={{ animationDuration: '3.6s', animationDelay: '1s' }}>✨</div>
      </div>

      {/* Header */}
      <header className="bg-gradient-to-r from-slate-950/95 via-slate-900/90 to-slate-950/95 border-b border-white/10 shadow-lg backdrop-blur-xl relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin-dashboard')}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-200" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-50">Platform Analytics</h1>
              <p className="text-xs md:text-sm text-slate-300 mt-1">Deep insights into learner and AI performance.</p>
            </div>
          </div>
          <div className="text-xs md:text-sm text-slate-300">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 relative z-10">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Lessons */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/85 shadow-xl hover:shadow-2xl transition-all p-6">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-orange-500/20 to-teal-400/20 rounded-full blur-2xl" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-300">Total Lessons</p>
                <p className="text-2xl font-bold text-slate-50 mt-1">{summary?.totalLessons || 0}</p>
              </div>
              <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500/40 to-purple-500/40 border border-white/15 shadow-md">
                <BookOpen className="w-6 h-6 text-orange-200" />
              </div>
            </div>
          </div>

          {/* Active Users */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/85 shadow-xl hover:shadow-2xl transition-all p-6">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-emerald-500/25 to-teal-400/25 rounded-full blur-2xl" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-300">Active Users</p>
                <p className="text-2xl font-bold text-slate-50 mt-1">{summary?.totalActiveUsers || 0}</p>
              </div>
              <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/40 to-teal-500/40 border border-white/15 shadow-md">
                <Users className="w-6 h-6 text-emerald-100" />
              </div>
            </div>
          </div>

          {/* Popular Language */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/85 shadow-xl hover:shadow-2xl transition-all p-6">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-purple-500/25 to-pink-500/25 rounded-full blur-2xl" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-300">Popular Language</p>
                <p className="text-2xl font-bold text-slate-50 mt-1">{summary?.mostPopularLanguage || 'N/A'}</p>
              </div>
              <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/40 to-pink-500/40 border border-white/15 shadow-md">
                <TrendingUp className="w-6 h-6 text-purple-100" />
              </div>
            </div>
          </div>

          {/* AI Success Rate */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/85 shadow-xl hover:shadow-2xl transition-all p-6">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-teal-400/25 to-amber-400/25 rounded-full blur-2xl" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-300">AI Success Rate</p>
                <p className="text-2xl font-bold text-slate-50 mt-1">{summary?.aiSuccessRate || '0%'}</p>
              </div>
              <div className="p-3 rounded-2xl bg-gradient-to-br from-teal-400/40 to-amber-400/40 border border-white/15 shadow-md">
                <Brain className="w-6 h-6 text-teal-100" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Language Distribution */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/85 shadow-xl hover:shadow-2xl transition-all p-6">
            <h3 className="text-lg font-semibold text-slate-50 mb-4 flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-purple-500/30">
                <TrendingUp className="w-4 h-4 text-purple-200" />
              </span>
              Popular Languages
            </h3>
            {languageDistribution && languageDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={languageDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ language_name, percent }) => `${language_name} ${Math.round(percent * 100)}%`}
                    outerRadius={100}
                    fill="#22C55E"
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
              <div className="flex items-center justify-center h-64 text-slate-400">
                <div className="text-center">
                  <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No language data available</p>
                </div>
              </div>
            )}
          </div>

          {/* Module Usage */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/85 shadow-xl hover:shadow-2xl transition-all p-6">
            <h3 className="text-lg font-semibold text-slate-50 mb-4 flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-teal-500/30">
                <BookOpen className="w-4 h-4 text-teal-200" />
              </span>
              Module Usage (Admin vs AI)
            </h3>
            {moduleUsage && moduleUsage.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={moduleUsage}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="module_type" />
                  <YAxis stroke="#CBD5F5" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#F97316" />
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
          <div className="rounded-3xl border border-white/10 bg-slate-900/85 shadow-xl hover:shadow-2xl transition-all p-6">
            <h3 className="text-lg font-semibold text-slate-50 mb-4 flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/30">
                <Brain className="w-4 h-4 text-emerald-200" />
              </span>
              AI Generation Performance
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Total Generations</span>
                <span className="font-semibold text-slate-50">{aiPerformance?.total_generations || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Successful</span>
                <span className="font-semibold text-emerald-300">{aiPerformance?.success_count || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Failed</span>
                <span className="font-semibold text-rose-300">{aiPerformance?.failure_count || 0}</span>
              </div>
              {aiPerformance?.total_generations > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Success Rate</span>
                    <span>{((aiPerformance.success_count / aiPerformance.total_generations) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400 h-2 rounded-full"
                      style={{
                        width: `${Math.round((aiPerformance.success_count / aiPerformance.total_generations) * 100)}%`
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* User Engagement */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/85 shadow-xl hover:shadow-2xl transition-all p-6">
            <h3 className="text-lg font-semibold text-slate-50 mb-4 flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-teal-500/30">
                <Users className="w-4 h-4 text-teal-200" />
              </span>
              User Engagement
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Active Users (30 days)</span>
                <span className="font-semibold text-slate-50">{userEngagement?.total_active_users || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Avg. Lessons per User</span>
                <span className="font-semibold text-emerald-300">{userEngagement?.avg_lessons_per_user || '0.0'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Most Active User Lessons</span>
                <span className="font-semibold text-orange-300">{userEngagement?.max_lessons_per_user || 0} lessons</span>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Activity Chart */}
        {dailyActivity && dailyActivity.length > 0 && (
          <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900/85 shadow-xl hover:shadow-2xl transition-all p-6">
            <h3 className="text-lg font-semibold text-slate-50 mb-4 flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-orange-500/30">
                <Activity className="w-4 h-4 text-orange-200" />
              </span>
              Daily Activity (Last 30 Days)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyActivity.slice(-30)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  stroke="#CBD5F5"
                />
                <YAxis stroke="#CBD5F5" />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="total_activities" 
                  stroke="#F97316" 
                  strokeWidth={2}
                  name="Total Activities"
                />
                <Line 
                  type="monotone" 
                  dataKey="active_users" 
                  stroke="#22C55E" 
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