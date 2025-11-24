import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '../../hooks/useAuth';
import { Home, LogOut, BookOpen, Users, BarChart3, Settings, User, Trophy, Mail, Loader2 } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { getAnalytics } from '../../api/admin';
import { useAdminContests } from '../../hooks/useContest';
import { useModuleManagement } from '../../hooks/useModuleManagement';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const logout = useLogout();
  const [analytics, setAnalytics] = useState(null);
  const [analyticsError, setAnalyticsError] = useState(null);
  const { data: contests = [] } = useAdminContests() || {};
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const {
    languages,
    loading: languagesLoading,
    error: languagesError,
    fetchLanguages,
  } = useModuleManagement();

  // Prevent back navigation from admin dashboard
  useEffect(() => {
    // Add a dummy state to history
    globalThis.history?.pushState({ page: 'admin-dashboard' }, '', globalThis.location?.href ?? '');
    
    const handlePopState = (event) => {
      // Prevent going back by immediately pushing forward
      event.preventDefault();
      globalThis.history?.pushState({ page: 'admin-dashboard' }, '', globalThis.location?.href ?? '');
    };

    globalThis.addEventListener?.('popstate', handlePopState);

    return () => {
      globalThis.removeEventListener?.('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    fetchLanguages();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchAnalytics = async () => {
      try {
        const response = await getAnalytics();
        if (!isMounted) return;

        if (response?.success) {
          setAnalytics(response.data);
          setAnalyticsError(null);
        } else {
          setAnalyticsError('Failed to load analytics');
        }
      } catch (error) {
        if (isMounted) {
          setAnalyticsError('Failed to load analytics');
        }
      }
    };

    fetchAnalytics();

    return () => {
      isMounted = false;
    };
  }, []);

  const summary = analytics?.summary;
  const userEngagement = analytics?.userEngagement;
  const dailyActivity = analytics?.dailyActivity || [];
  const realTimeStats = analytics?.realTimeStats;
  const aiPerformance = analytics?.aiPerformance;

  const totalActiveUsers = summary?.totalActiveUsers ?? realTimeStats?.active_users ?? 0;
  const totalLessons = summary?.totalLessons ?? 0;
  const aiSuccessRate = summary?.aiSuccessRate ?? '0%';
  const avgLessonsPerUserRaw = summary?.avgLessonsPerUser ?? userEngagement?.avg_lessons_per_user ?? 0;
  const avgLessonsPerUser = Number.isFinite(Number(avgLessonsPerUserRaw))
    ? Number(avgLessonsPerUserRaw)
    : 0;
  const avgLessonsPerUserDisplay = avgLessonsPerUser.toFixed(1);

  const totalAIGenerations = aiPerformance?.total_generations ?? realTimeStats?.ai_courses_generated ?? 0;
  const popularLanguage = summary?.mostPopularLanguage ?? 'N/A';
  const activeUsers30 = userEngagement?.total_active_users ?? 0;

  const contestsArray = Array.isArray(contests) ? contests : [];
  const activeContests = contestsArray.filter((c) => c.status === 'ACTIVE').length;
  const upcomingContests = contestsArray.filter((c) => c.status === 'PUBLISHED').length;

  // Contest engagement time-series: participants per contest over start dates
  const contestsWithParticipants = contestsArray
    .map((c) => ({
      ...c,
      participant_count: Number(c.participant_count || 0),
    }))
    .filter((c) => c.participant_count > 0);

  const contestEngagementSeries = contestsWithParticipants
    .slice()
    .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
    .map((c) => ({
      date: c.start_time,
      participants: c.participant_count,
      title: c.title,
    }));

  const recentActivityItems = dailyActivity.slice(-4).reverse();

  const totalLanguages = Array.isArray(languages) ? languages.length : 0;
  const totalCoursesAcrossLanguages = Array.isArray(languages)
    ? languages.reduce((sum, lang) => sum + Number(lang.course_count || 0), 0)
    : 0;

  const sidebarItems = [
    { key: 'home', label: 'Home', icon: Home, onClick: () => navigate('/admin-dashboard') },
    { key: 'modules', label: 'Module Management', icon: BookOpen, onClick: () => navigate('/admin/modules') },
    { key: 'users', label: 'User Management', icon: Users, onClick: () => navigate('/admin/users') },
    { key: 'analytics', label: 'User Analytics', icon: BarChart3, onClick: () => navigate('/admin/analytics') },
    { key: 'contests', label: 'Contest Management', icon: Trophy, onClick: () => navigate('/admin/contests') },
    { key: 'email', label: 'Email Campaign', icon: Mail, onClick: () => navigate('/admin/email-campaign') },
    { key: 'profile', label: 'Profile', icon: User, onClick: () => navigate('/admin/profile') },
    { key: 'logout', label: 'Logout', icon: LogOut, onClick: logout },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-orange-900 to-slate-950 text-slate-50 relative overflow-x-hidden">
      {/* Floating background elements for layered depth */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute top-20 right-20 text-7xl opacity-20 animate-bounce"
          style={{ animationDuration: '3s' }}
        >
          📊
        </div>
        <div
          className="absolute top-40 left-16 text-6xl opacity-20 animate-bounce"
          style={{ animationDuration: '4s', animationDelay: '0.4s' }}
        >
          📚
        </div>
        <div
          className="absolute bottom-40 right-32 text-7xl opacity-20 animate-bounce"
          style={{ animationDuration: '3.5s', animationDelay: '0.9s' }}
        >
          ✨
        </div>
        <div
          className="absolute top-1/2 left-1/3 text-6xl opacity-10 animate-bounce"
          style={{ animationDuration: '4.5s', animationDelay: '1.3s' }}
        >
          🧠
        </div>
      </div>

      <div className="flex min-h-screen relative z-10">
        {/* Sidebar */}
        <aside
          className={`hidden md:flex flex-col bg-slate-950/95 border-r border-teal-500/30 shadow-[0_0_30px_rgba(45,212,191,0.25)] transition-all duration-300 ${
            sidebarCollapsed ? 'w-16' : 'w-60'
          }`}
        >
          <div className="flex items-center justify-between px-3 py-4">
            <button
              type="button"
              onClick={() => setSidebarCollapsed((prev) => !prev)}
              className="inline-flex flex-col items-center justify-center gap-0.5 rounded-xl border border-teal-500/50 bg-slate-900/80 px-2 py-1 text-teal-200 hover:bg-slate-800 hover:border-teal-300 transition-colors"
            >
              <span className="block h-0.5 w-4 rounded-full bg-teal-400" />
              <span className="block h-0.5 w-4 rounded-full bg-emerald-400" />
              <span className="block h-0.5 w-4 rounded-full bg-amber-400" />
            </button>
            {!sidebarCollapsed && (
              <div className="ml-2">
                <p className="text-[10px] uppercase tracking-[0.2em] text-teal-300/80">Admin</p>
                <p className="text-xs font-semibold text-slate-50">Control Center</p>
              </div>
            )}
          </div>
          <nav className="flex-1 px-2 space-y-1 pb-4">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isLogout = item.key === 'logout';
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={item.onClick}
                  className={`group flex w-full items-center ${
                    sidebarCollapsed ? 'justify-center px-0' : 'justify-start px-2'
                  } gap-3 rounded-2xl border bg-slate-950/85 py-2 text-xs font-medium transition-all ${
                    isLogout
                      ? 'border-rose-500/60 text-rose-100 hover:bg-rose-600/20 hover:border-rose-400'
                      : 'border-slate-700/60 text-slate-100 hover:border-teal-400 hover:bg-slate-900/95'
                  }`}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900/90 border border-slate-600/70 shadow-[0_0_16px_rgba(15,23,42,0.9)]">
                    <Icon
                      className={`h-4 w-4 ${
                        isLogout ? 'text-rose-300' : 'text-teal-300 group-hover:text-emerald-300'
                      } transition-colors`}
                    />
                  </span>
                  {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main column */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-gradient-to-r from-slate-950/95 via-slate-900/90 to-slate-950/95 border-b border-white/10 shadow-lg backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
              <div>
                <h1
                  className="text-2xl md:text-3xl font-bold text-slate-50 cursor-pointer tracking-tight"
                  onClick={() => navigate('/admin-dashboard')}
                >
                  Admin Dashboard
                </h1>
                <p className="text-xs md:text-sm text-slate-300 mt-1">
                  Analytic control center for your learning platform.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/admin/profile')}
                  className="flex items-center gap-2 px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-slate-100 bg-slate-900/70 hover:bg-slate-800/90 rounded-xl border border-white/10 shadow-sm transition-colors"
                >
                  <User className="w-4 h-4" />
                  Profile
                </button>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-slate-100 bg-slate-900/70 hover:bg-slate-800/90 rounded-xl border border-white/10 shadow-sm transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-teal-300/80 mb-1">
                  Overview
                </p>
                <h2 className="text-3xl md:text-4xl font-semibold text-slate-50 mb-1">
                  Welcome, Admin!
                </h2>
                <p className="text-sm text-slate-300">
                  Monitor users, courses, contests, and system health at a glance.
                </p>
              </div>
            </div>
            {analyticsError && (
              <div className="mb-4 rounded-2xl border border-rose-500/40 bg-rose-950/60 px-4 py-2 text-[11px] text-rose-100">
                {analyticsError}
              </div>
            )}

        {/* Top analytics row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Analytics panel */}
          <section className="relative overflow-hidden rounded-3xl lg:col-span-2 border border-white/10 bg-slate-900/85 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-gradient-to-br from-orange-500/20 via-teal-400/10 to-transparent rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-gradient-to-tr from-teal-500/25 via-purple-500/10 to-transparent rounded-full blur-3xl" />

            <div className="relative p-6 md:p-8 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-slate-50 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-teal-300" />
                    Analytics Dashboard
                  </h3>
                  <p className="text-xs md:text-sm text-slate-300 mt-1">
                    Analytic overview and engagement insights.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/admin/analytics')}
                  className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl border border-teal-400/60 bg-teal-500/15 text-teal-100 hover:bg-teal-500/25 hover:border-teal-300 transition-colors"
                >
                  <BarChart3 className="w-4 h-4" />
                  Open full analytics
                </button>
              </div>

              {/* Key stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl bg-slate-900/80 border border-white/10 px-4 py-3 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-slate-300">Active learners</p>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-orange-500/20 text-orange-200 border border-orange-400/40">
                      Analytics
                    </span>
                  </div>
                  <p className="text-2xl font-semibold text-slate-50">{totalActiveUsers}</p>
                  <p className="text-[11px] text-emerald-300 mt-1">
                    Avg {avgLessonsPerUserDisplay} lessons per user
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-900/80 border border-white/10 px-4 py-3 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-slate-300">Lessons completed</p>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-teal-500/20 text-teal-100 border border-teal-400/50">
                      Total
                    </span>
                  </div>
                  <p className="text-2xl font-semibold text-slate-50">{totalLessons}</p>
                  <p className="text-[11px] text-teal-200 mt-1">Most popular: {popularLanguage}</p>
                </div>

                <div className="rounded-2xl bg-slate-900/80 border border-white/10 px-4 py-3 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-slate-300">AI generations</p>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-500/20 text-purple-200 border border-purple-400/50">
                      Platform
                    </span>
                  </div>
                  <p className="text-2xl font-semibold text-slate-50">{totalAIGenerations}</p>
                  <p className="text-[11px] text-purple-200 mt-1">Success rate {aiSuccessRate}</p>
                </div>
              </div>

              {/* Contest engagement pseudo-chart */}
              <div className="mt-2">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-slate-100">Contest Engagement</p>
                  <span className="text-[11px] text-slate-300">Participants over time</span>
                </div>
                {contestEngagementSeries.length === 0 ? (
                  <div className="h-32 rounded-2xl bg-slate-950/80 border border-teal-500/20 flex items-center justify-center text-[11px] text-slate-400">
                    No contest participation data yet. Once learners join contests, engagement over time will appear here.
                  </div>
                ) : (
                  <div className="h-40 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-teal-500/20 overflow-hidden px-2 pt-2 pb-3">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={contestEngagementSeries} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                        <XAxis
                          dataKey="date"
                          tickFormatter={(value) => new Date(value).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                          })}
                          stroke="#CBD5F5"
                          tick={{ fontSize: 10 }}
                        />
                        <YAxis stroke="#CBD5F5" tick={{ fontSize: 10 }} allowDecimals={false} />
                        <Tooltip
                          labelFormatter={(value) => new Date(value).toLocaleString('en-IN')}
                          formatter={(val) => [`${val} participants`, 'Participants']}
                        />
                        <Line
                          type="monotone"
                          dataKey="participants"
                          stroke="#22C55E"
                          strokeWidth={2}
                          dot={{ r: 2, stroke: '#22C55E', fill: '#22C55E' }}
                          activeDot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Right side widgets */}
          <div className="space-y-6">
            {/* User management */}
            <section className="rounded-3xl border border-white/10 bg-slate-900/85 shadow-xl hover:shadow-2xl transition-all duration-300 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-300" />
                    User Management
                  </h3>
                  <p className="text-[11px] text-slate-300 mt-1">Quick overview of your learners.</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="rounded-2xl bg-slate-900/80 border border-white/10 px-3 py-2">
                  <p className="text-[11px] text-slate-300">Active users (30 days)</p>
                  <p className="text-lg font-semibold text-slate-50">{activeUsers30}</p>
                </div>
                <div className="rounded-2xl bg-slate-900/80 border border-white/10 px-3 py-2">
                  <p className="text-[11px] text-slate-300">Avg lessons per user</p>
                  <p className="text-lg font-semibold text-emerald-300">{avgLessonsPerUserDisplay}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/admin/users')}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-[11px] font-medium bg-slate-900/80 border border-emerald-400/50 text-emerald-100 hover:bg-emerald-500/15 hover:border-emerald-300 transition-colors"
                >
                  User Search
                </button>
                <button
                  onClick={() => navigate('/admin/users')}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-[11px] font-medium bg-emerald-500/20 border border-emerald-400/60 text-emerald-50 hover:bg-emerald-500/30 hover:border-emerald-300 transition-colors"
                >
                  User Table
                </button>
              </div>
            </section>

            {/* Contest management */}
            <section className="rounded-3xl border border-white/10 bg-slate-900/85 shadow-xl hover:shadow-2xl transition-all duration-300 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-orange-300" />
                    Contest Management
                  </h3>
                  <p className="text-[11px] text-slate-300 mt-1">Monitor active contests and launch new ones.</p>
                </div>
              </div>
              <div className="rounded-2xl bg-slate-900/80 border border-white/10 px-3 py-3 mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-slate-300">Active Contests</p>
                  <p className="text-xl font-semibold text-slate-50">{activeContests}</p>
                </div>
                <span className="text-[11px] text-slate-400">Upcoming (scheduled): {upcomingContests}</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/admin/contests')}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-[11px] font-medium bg-slate-900/80 border border-teal-400/60 text-teal-100 hover:bg-teal-500/20 hover:border-teal-300 transition-colors"
                >
                  + Create New
                </button>
                <button
                  onClick={() => navigate('/admin/contests')}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-[11px] font-medium bg-slate-900/80 border border-orange-400/60 text-orange-100 hover:bg-orange-500/25 hover:border-orange-300 transition-colors"
                >
                  Contest List
                </button>
              </div>
            </section>
          </div>
        </div>

        {/* Bottom row: module management & activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Module Management - language list */}
          <section className="relative overflow-hidden rounded-3xl lg:col-span-2 border border-white/10 bg-slate-900/85 shadow-xl hover:shadow-2xl transition-all duration-300 p-6 md:p-8">
            <div className="absolute -top-24 right-0 w-64 h-64 bg-gradient-to-bl from-emerald-500/25 via-teal-400/15 to-transparent blur-3xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-5 gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-50 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-emerald-300" />
                    Module Management
                  </h3>
                  <p className="text-xs md:text-sm text-slate-300 mt-1">
                    Curated language catalog for your courses.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-200/90">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900/80 border border-emerald-400/40 text-emerald-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      {totalLanguages} languages
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900/80 border border-teal-400/40 text-teal-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                      {totalCoursesAcrossLanguages} total courses
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/admin/modules/course/new')}
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 px-4 py-2 text-xs md:text-sm font-semibold text-slate-950 shadow-[0_0_22px_rgba(34,197,94,0.7)] hover:shadow-[0_0_28px_rgba(34,197,94,0.9)] transition-shadow"
                >
                  <BookOpen className="w-4 h-4" />
                  Create New Course
                </button>
              </div>

              <div className="space-y-4">
                {languagesLoading ? (
                  <div className="flex items-center gap-3 text-xs text-slate-200">
                    <Loader2 className="w-4 h-4 text-emerald-300 animate-spin" />
                    <span>Loading curated languages...</span>
                  </div>
                ) : languagesError ? (
                  <div className="rounded-2xl border border-rose-500/50 bg-rose-950/50 px-4 py-3 text-[11px] text-rose-100">
                    <p className="font-medium mb-1">Could not load languages.</p>
                    <p className="opacity-90">{languagesError}</p>
                  </div>
                ) : totalLanguages === 0 ? (
                  <div className="rounded-2xl border border-slate-700/70 bg-slate-950/80 px-4 py-6 text-center text-sm text-slate-200">
                    <p className="mb-2 font-medium">No languages configured yet.</p>
                    <p className="text-[11px] text-slate-400 mb-4">
                      Start by creating your first course. A language entry will appear here automatically.
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate('/admin/modules/course/new')}
                      className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/60 bg-emerald-500/20 px-4 py-2 text-xs font-semibold text-emerald-50 hover:bg-emerald-500/30 hover:border-emerald-300 transition-colors"
                    >
                      <BookOpen className="w-4 h-4" />
                      Create First Course
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {languages.map((lang) => (
                      <button
                        key={lang.language}
                        type="button"
                        onClick={() => navigate(`/admin/modules/${lang.language}`)}
                        className="group relative overflow-hidden rounded-2xl border border-emerald-400/40 bg-slate-950/85 px-4 py-3 text-left text-xs shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:border-emerald-300 hover:shadow-[0_0_26px_rgba(16,185,129,0.5)] transition-all"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-500/30 via-teal-400/20 to-sky-400/20 flex items-center justify-center">
                              <BookOpen className="w-4 h-4 text-emerald-100" />
                            </div>
                            <div>
                              <p className="text-[13px] font-semibold text-slate-50 truncate">{lang.language}</p>
                              <p className="text-[11px] text-slate-300">
                                {lang.course_count}{' '}
                                {String(lang.course_count) === '1' ? 'course' : 'courses'}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                          <span className="inline-flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 group-hover:bg-emerald-300" />
                            Manage courses
                          </span>
                          <span className="text-teal-300 group-hover:text-emerald-200">View details</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Recent Activity */}
          <section className="rounded-3xl border border-white/10 bg-slate-900/85 shadow-xl hover:shadow-2xl transition-all duration-300 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-100">Recent Activity</h3>
                <p className="text-[11px] text-slate-300 mt-1">Daily learner activity based on learning logs.</p>
              </div>
            </div>
            {recentActivityItems.length === 0 ? (
              <div className="text-[11px] text-slate-400">
                No recent analytics activity yet.
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto pr-1 max-h-64 custom-scrollbar">
                {recentActivityItems.map((entry, index) => (
                  <div
                    key={entry.date || index}
                    className="flex items-start gap-3 rounded-2xl bg-slate-900/85 border border-white/10 px-3 py-2"
                  >
                    <div className="mt-1 h-6 w-6 rounded-full bg-gradient-to-br from-orange-500/70 via-amber-400/70 to-teal-400/70 flex items-center justify-center text-[10px] text-slate-950 font-bold">
                      ⚙
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-slate-100">Learning activity snapshot</p>
                      <p className="text-[11px] text-slate-300">
                        {`Learning events logged: ${entry.total_activities || 0}, unique active learners: ${entry.active_users || 0}.`}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {entry.date
                          ? new Date(entry.date).toLocaleString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;