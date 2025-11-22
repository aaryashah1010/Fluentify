import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  TrendingUp,
  Users,
  BookOpen,
  Brain,
  Activity,
  Calendar,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from 'recharts';
import { getAnalytics } from '../../api/admin';
import { useTheme } from '../../contexts/ThemeContext';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

const AnalyticsDashboard = () => {
  const navigate = useNavigate();
  const { isDarkMode, darkModeStyles, darkModeClasses } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('monthly'); // weekly | monthly | yearly | 

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
      <div className={`min-h-screen flex items-center justify-center ${darkModeClasses}`} style={darkModeStyles}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4" />
          <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
    return (
      <div className={`min-h-screen flex items-center justify-center px-4 ${darkModeClasses}`} style={darkModeStyles}>
        <div className={`rounded-2xl border shadow-sm p-6 max-w-md w-full text-center space-y-4 ${isDarkMode ? 'bg-slate-900/80 border-slate-700/50' : 'bg-white border-slate-200'
          }`}>
          <div className="text-red-500">
            <Activity className="w-10 h-10 mx-auto" />
          </div>
          <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{error}</p>
          <button
            onClick={() => navigate('/admin-dashboard')}
            className="inline-flex items-center justify-center w-full rounded-xl bg-slate-900 text-white text-sm font-medium px-4 py-2.5 hover:bg-black transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
    );
  }

if (!data) return null;

const { summary, languageDistribution, moduleUsage, aiPerformance, userEngagement, dailyActivity } = data;

const summarySafe = summary || {};

const baseSparkline =
  dailyActivity && dailyActivity.length > 0
    ? dailyActivity.slice(-7).map((d, idx) => ({ name: idx, value: d.total_activities || 0 }))
    : [
      { name: 1, value: 0 },
      { name: 2, value: 0 },
      { name: 3, value: 0 },
      { name: 4, value: 0 },
      { name: 5, value: 0 },
    ];

const rangeLabel =
  timeRange === 'weekly'
    ? 'this week'
    : timeRange === 'yearly'
      ? 'this year'
      : 'this month';

return (
  <div className={`min-h-screen ${darkModeClasses}`} style={darkModeStyles}>
    {/* Header */}
    <header className={`border-b backdrop-blur sticky top-0 z-20 ${isDarkMode ? 'bg-slate-900/80 border-slate-700/50' : 'bg-white/80 border-slate-200'
      }`}>
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin-dashboard')}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-[#F29A36] via-[#A8C79B] to-[#56D7C5] text-white shadow-sm hover:opacity-90 transition"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <div>
            <h1 className={`text-lg sm:text-xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Analytics
              <BarChart3 className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`} />
            </h1>
            <p className={`text-[11px] uppercase tracking-[0.16em] font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>Platform Insights</p>
          </div>
        </div>

        <div className="text-[11px] sm:text-xs text-slate-500 text-right">
          <p>Last updated</p>
          <p className="font-medium text-slate-700">{new Date().toLocaleString()}</p>
        </div>
      </div>
    </header>

    {/* Main Content */}
    <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      {/* Range tabs and intro */}
      <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className={`text-base sm:text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Overview</h2>
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            High-level stats about lessons, users, languages and AI performance.
          </p>
        </div>

        <div className="inline-flex items-center self-start rounded-full bg-white/80 border border-transparent p-1 text-[11px] shadow-sm">
          {[
            { id: 'weekly', label: 'Weekly' },
            { id: 'monthly', label: 'Monthly' },
            { id: 'yearly', label: 'Yearly' },
          ].map((range) => (
            <button
              key={range.id}
              onClick={() => setTimeRange(range.id)}
              className={`px-3 py-1 rounded-full font-semibold transition-all
                  ${timeRange === range.id
                  ? 'bg-gradient-to-r from-[#F29A36] via-[#A8C79B] to-[#56D7C5] text-white shadow'
                  : 'text-transparent bg-clip-text bg-gradient-to-r from-[#F29A36] via-[#A8C79B] to-[#56D7C5] hover:bg-white/70'
                }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </section>

      {/* Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Lessons */}
        <div className="bg-gradient-to-br from-[#F29A36] via-[#A8C79B] to-[#56D7C5] text-white rounded-2xl border border-transparent shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-150 p-4 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/80">Total Lessons</p>
              <p className="mt-1 text-2xl font-bold text-white">{summarySafe.totalLessons || 0}</p>
              <p className="mt-1 text-[11px] text-white flex items-center gap-1">
                <span className="bg-gradient-to-r from-[#F29A36] via-[#A8C79B] to-[#56D7C5] bg-clip-text text-transparent">↑</span>
                <span className="text-white/80">+0% {rangeLabel}</span>
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
          </div>
          {/* Sparkline */}
          <div className="h-10 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={baseSparkline}>
                <CartesianGrid strokeDasharray="2 4" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <Tooltip cursor={false} contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={1.6} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-gradient-to-br from-[#F29A36] via-[#A8C79B] to-[#56D7C5] text-white rounded-2xl border border-transparent shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-150 p-4 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/80">Active Users</p>
              <p className="mt-1 text-2xl font-bold text-white">{summarySafe.totalActiveUsers || 0}</p>
              <p className="mt-1 text-[11px] text-white flex items-center gap-1">
                <span className="bg-gradient-to-r from-[#F29A36] via-[#A8C79B] to-[#56D7C5] bg-clip-text text-transparent">↑</span>
                <span className="text-white/80">Engagement trend {rangeLabel}</span>
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="h-10 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={baseSparkline}>
                <CartesianGrid strokeDasharray="2 4" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <Tooltip cursor={false} contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={1.6} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Language */}
        <div className="bg-gradient-to-br from-[#F29A36] via-[#A8C79B] to-[#56D7C5] text-white rounded-2xl border border-transparent shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-150 p-4 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/80">Popular Language</p>
              <p className="mt-1 text-xl font-semibold text-white truncate">{summarySafe.mostPopularLanguage || 'N/A'}</p>
              <p className="mt-1 text-[11px] text-white flex items-center gap-1">
                <span className="bg-gradient-to-r from-[#F29A36] via-[#A8C79B] to-[#56D7C5] bg-clip-text text-transparent">↗</span>
                <span className="text-white/80">Language trend {rangeLabel}</span>
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
          </div>
          {/* No extra sparkline for this stat card */}
        </div>

        {/* AI Success Rate */}
        <div className="bg-gradient-to-br from-[#F29A36] via-[#A8C79B] to-[#56D7C5] text-white rounded-2xl border border-transparent shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-150 p-4 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/80">AI Success Rate</p>
              <p className="mt-1 text-2xl font-bold text-white">{summarySafe.aiSuccessRate || '0%'}</p>
              <p className="mt-1 text-[11px] text-white/80">AI evaluations {rangeLabel}</p>
            </div>
            <div className="relative h-14 w-14 flex items-center justify-center opacity-80">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    'conic-gradient(#facc15 0deg, #facc15 0deg, #e5e7eb 0deg, #e5e7eb 360deg)',
                }}
              />
              <div className="absolute inset-2 rounded-full bg-white/90" />
              <Brain className="relative w-6 h-6 text-amber-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Charts Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Language Distribution */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Language Distribution */}
          <div className={`rounded-2xl p-5 shadow-sm border border-dashed ${isDarkMode ? 'bg-slate-900/80 border-slate-700/50' : 'bg-[#F6FFFA] border-[#E0F2EC]'
            }`}>
            <h3 className={`text-sm font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-[#4F2E0D]'}`}>Popular Languages</h3>
            <p className={`text-[11px] mb-4 ${isDarkMode ? 'text-slate-400' : 'text-[#805428]'}`}>Share of learners by language.</p>
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
              <div className="flex items-center justify-center h-56 text-slate-500">
                <div className="text-center space-y-2">
                  <Calendar className="w-10 h-10 mx-auto mb-1 opacity-40" />
                  <p className="text-sm">No language data available</p>
                  <div className="mt-2 flex justify-center gap-1 text-[10px] text-slate-400">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-8 w-4 rounded bg-slate-100 border border-dashed border-slate-200" />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Daily Activity */}
          <div className={`rounded-2xl p-5 shadow-sm border ${isDarkMode ? 'bg-slate-900/80 border-slate-700/50' : 'bg-[#F6FFFA] border-[#E0F2EC]'
            }`}>
            <h3 className={`text-sm font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-[#4F2E0D]'}`}>Daily Activity</h3>
            <p className={`text-[11px] mb-4 ${isDarkMode ? 'text-slate-400' : 'text-[#805428]'}`}>Last 30 days of platform activity.</p>
            {dailyActivity && dailyActivity.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={dailyActivity.slice(-30)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
                  <Tooltip labelFormatter={(value) => new Date(value).toLocaleDateString()} />
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
            ) : (
              <div className="flex items-center justify-center h-56 text-[#805428]">
                <div className="text-center space-y-2">
                  <Activity className="w-10 h-10 mx-auto mb-1 opacity-40" />
                  <p className="text-sm">No daily activity data available</p>
                </div>
              </div>
            )}
          </div>

          {/* AI Performance */}
          <div className={`rounded-2xl p-5 shadow-sm border ${isDarkMode ? 'bg-slate-900/80 border-slate-700/50' : 'bg-[#F6FFFA] border-[#E0F2EC]'
            }`}>
            <h3 className={`text-sm font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-[#4F2E0D]'}`}>AI Generation Performance</h3>
            <p className={`text-[11px] mb-4 ${isDarkMode ? 'text-slate-400' : 'text-[#805428]'}`}>Success vs failed generations.</p>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-600">
                  <Brain className="w-4 h-4 text-amber-500" /> Total Generations
                </span>
                <span className="font-semibold">{aiPerformance?.total_generations || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Successful
                </span>
                <span className="font-semibold text-emerald-600">{aiPerformance?.success_count || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-600">
                  <XCircle className="w-4 h-4 text-rose-500" /> Failed
                </span>
                <span className="font-semibold text-rose-600">{aiPerformance?.failure_count || 0}</span>
              </div>

              {aiPerformance?.total_generations > 0 && (
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-[11px] text-[#805428]">
                    <span>Success Rate</span>
                    <span>
                      {(
                        (aiPerformance.success_count / aiPerformance.total_generations) * 100 || 0
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/60 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#F29A36] via-[#A8C79B] to-[#56D7C5]"
                      style={{
                        width: `${(aiPerformance.success_count / aiPerformance.total_generations) * 100 || 0
                          }%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* User Engagement */}
          <div className={`rounded-2xl p-5 shadow-sm border ${isDarkMode ? 'bg-slate-900/80 border-slate-700/50' : 'bg-[#F6FFFA] border-[#E0F2EC]'
            }`}>
            <h3 className={`text-sm font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-[#4F2E0D]'}`}>User Engagement</h3>
            <p className={`text-[11px] mb-4 ${isDarkMode ? 'text-slate-400' : 'text-[#805428]'}`}>Who is most active and how they learn.</p>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Active Users (30 days)</span>
                <span className="font-semibold">{userEngagement?.total_active_users || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Avg. Lessons per User</span>
                <span className="font-semibold">{userEngagement?.avg_lessons_per_user || '0.0'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Most Active User</span>
                <span className="font-semibold">{userEngagement?.max_lessons_per_user || 0} lessons</span>
              </div>

              {/* Mini avatars row */}
              <div className="mt-3 flex items-center gap-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-7 w-7 rounded-full border border-slate-200 bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 -ml-1 first:ml-0"
                  >
                    U{i}
                  </div>
                ))}
                <span className="text-[11px] text-slate-400">Most active learners (placeholder)</span>
              </div>

              {/* Small progress bar */}
              <div className="mt-2">
                <div className="flex justify-between text-[11px] text-[#805428] mb-1">
                  <span>Engagement progress</span>
                  <span>+0% {rangeLabel}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/60 overflow-hidden">
                  <div className="h-full w-1/3 bg-gradient-to-r from-[#F29A36] via-[#A8C79B] to-[#56D7C5]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Module Usage - moved below as full-width section */}
        {moduleUsage && moduleUsage.length > 0 && (
          <section className={`rounded-2xl p-5 shadow-sm border ${isDarkMode ? 'bg-slate-900/80 border-slate-700/50' : 'bg-[#F6FFFA] border-[#E0F2EC]'
            }`}>
            <h3 className={`text-sm font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-[#4F2E0D]'}`}>Module Usage (Admin vs AI)</h3>
            <p className={`text-[11px] mb-4 ${isDarkMode ? 'text-slate-400' : 'text-[#805428]'}`}>Relative activity by module type.</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={moduleUsage}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="module_type" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend formatter={(v) => <span className="text-[11px] text-slate-500">{v}</span>} />
                <Bar dataKey="admin_count" name="Admin" stackId="a" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="ai_count" name="AI" stackId="a" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </section>
        )}
    </main>
  </div>
);
};

export default AnalyticsDashboard;
