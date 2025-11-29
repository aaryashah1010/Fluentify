// @ts-nocheck
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Award,
  BookOpen,
  Flame,
  ArrowLeft,
  Calendar,
  RefreshCw,
  Zap,
  Trophy,
  Star,
  Activity,
  Globe
} from 'lucide-react';

import { useProgressReport } from '../../hooks/useProgress';
import { useCourses } from '../../hooks/useCourses';

import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const ProgressPage = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState(null);

  const { data: courses = [] } = useCourses();
  const { data, isLoading, error, refetch } = useProgressReport(timeRange, selectedCourse);
  const { summary = {}, timeline = [], recentActivity = [] } = data || {};
  const rawStreak = typeof summary.current_streak === 'number' ? summary.current_streak : 0;
  const currentStreak = Math.max(rawStreak, 1);

  const handleRefresh = () => refetch();

  const timeRangeButtons = [
    { label: 'Last 7 Days', value: '7d' },
    { label: 'Last 30 Days', value: '30d' },
    { label: 'All Time', value: 'all' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-900 via-orange-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-teal-400 mx-auto"></div>
            <TrendingUp className="w-8 h-8 text-orange-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="mt-6 text-lg font-medium text-gray-700">Loading your progress...</p>
          <p className="mt-2 text-sm text-gray-500">Preparing your learning insights</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-900 via-orange-900 to-slate-950 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-50 mb-2">Unable to Load Progress</h2>
          <p className="text-slate-300 mb-6">We couldn't fetch your progress. Please try again.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-gradient-to-r from-orange-400 to-teal-400 text-white rounded-xl hover:opacity-90 transition-all shadow-lg"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (summary.lessons_completed === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-900 via-orange-900 to-slate-950">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-6 font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>

          <div className="bg-slate-900/90 rounded-3xl shadow-2xl p-12 text-center border border-white/10">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-50 mb-3">Your Journey Begins Here</h2>
            <p className="text-lg text-slate-300 mb-8 max-w-md mx-auto">
              Complete your first lesson to unlock your personalized progress dashboard!
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-8 py-4 bg-gradient-to-r from-orange-400 to-teal-400 text-white rounded-xl hover:opacity-90 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Start Learning Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-orange-900 to-slate-950 relative overflow-hidden">
    
      <div className="absolute top-20 right-20 text-7xl opacity-30 pointer-events-none animate-bounce" style={{ animationDuration: '3s' }}>
        ⭐
      </div>
      <div className="absolute top-40 left-20 text-6xl opacity-30 pointer-events-none animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }}>
        🏆
      </div>
      <div className="absolute bottom-40 right-40 text-7xl opacity-30 pointer-events-none animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '1s' }}>
        📈
      </div>
      <div className="absolute top-1/2 left-1/4 text-6xl opacity-20 pointer-events-none animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '1.5s' }}>
        ✨
      </div>
      <div className="absolute bottom-20 left-1/3 text-6xl opacity-25 pointer-events-none animate-bounce" style={{ animationDuration: '3.8s', animationDelay: '0.8s' }}>
        🎯
      </div>
      <div className="absolute top-32 right-1/3 text-5xl opacity-25 pointer-events-none animate-bounce" style={{ animationDuration: '4.2s', animationDelay: '1.2s' }}>
        💪
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">

        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-8 font-medium transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        <div className="mb-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-50 drop-shadow-md">Your Progress Report</h1>
          </div>

          <p className="text-slate-200 text-lg ml-1">
            Track your learning journey and celebrate achievements
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div className="hidden sm:block">
            <p className="text-sm text-slate-200/90">
              Use filters to view your progress for specific courses and time ranges.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <select
                value={selectedCourse || ''}
                onChange={(e) => setSelectedCourse(e.target.value || null)}
                className="appearance-none px-4 py-2 pr-10 text-sm font-medium rounded-xl bg-white/90 backdrop-blur-sm text-gray-700 border-2 border-gray-200 hover:border-teal-300 focus:border-teal-500 focus:outline-none transition-all shadow-sm hover:shadow-md"
              >
                <option value="">All Courses</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.language} - {course.title}
                  </option>
                ))}
              </select>
              <Globe className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Time Range Buttons */}
            {timeRangeButtons.map((btn) => (
              <button
                key={btn.value}
                onClick={() => setTimeRange(btn.value)}
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                  timeRange === btn.value
                    ? 'bg-gradient-to-r from-orange-400 to-teal-400 text-white shadow-lg'
                    : 'bg-white/90 backdrop-blur-sm text-gray-700 border border-gray-200 hover:border-teal-300 hover:shadow-md'
                }`}
              >
                {btn.label}
              </button>
            ))}

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium rounded-xl transition-all bg-white/90 backdrop-blur-sm text-gray-700 border border-gray-200 hover:border-teal-300 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              title="Refresh data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-5xl">
          <div className="relative p-8 bg-slate-900/90 border border-amber-400/60 rounded-2xl shadow-xl overflow-hidden">
            <div className="absolute top-4 right-4 text-2xl opacity-20">⚡</div>
            <div className="flex items-center justify-between mb-5">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-md">
                <Award className="w-7 h-7 text-white" />
              </div>
              <Star className="w-6 h-6 text-amber-300 opacity-80" />
            </div>
            <p className="text-sm text-slate-300 mb-2">Total XP</p>
            <p className="text-4xl font-semibold text-slate-50 mb-1">
              {summary.total_xp || 0}
            </p>
          </div>

          <div className="relative p-8 bg-slate-900/90 border border-teal-400/60 rounded-2xl shadow-xl overflow-hidden">
            <div className="absolute top-4 right-4 text-2xl opacity-10">📚</div>
            <div className="flex items-center justify-between mb-5">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-md">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <BookOpen className="w-6 h-6 text-teal-400 opacity-70" />
            </div>
            <p className="text-sm text-slate-300 mb-2">Lessons Completed</p>
            <p className="text-4xl font-semibold text-slate-50 mb-1">
              {summary.lessons_completed || 0}
            </p>
          </div>

          <div className="relative p-8 bg-slate-900/90 border border-pink-400/60 rounded-2xl shadow-xl overflow-hidden">
            <div className="absolute top-4 right-4 text-2xl opacity-10">🔥</div>
            <div className="flex items-center justify-between mb-5">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-red-500 rounded-2xl flex items-center justify-center shadow-md">
                <Flame className="w-7 h-7 text-white" />
              </div>
              <Flame className="w-6 h-6 text-pink-400 opacity-70" />
            </div>
            <p className="text-sm text-slate-300 mb-2">Current Streak</p>
            <p className="text-4xl font-semibold text-slate-50 mb-1">
              {currentStreak}{' '}
              <span className="text-xl text-slate-300">days</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <div className="bg-slate-900/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-md">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-50">Learning Activity</h3>
                <p className="text-sm text-slate-300">Lessons completed over time</p>
              </div>
            </div>

            {timeline.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={timeline.map((item) => ({
                    ...item,
                    date: new Date(item.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })
                  }))}
                >
                  <defs>
                    <linearGradient id="colorLessons" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.9} />
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2933" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#020617',
                      border: '1px solid rgba(148,163,184,0.4)',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px -5px rgba(15,23,42,0.8)',
                      padding: '10px 12px',
                      color: '#e5e7eb'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="lessons_count"
                    stroke="#14b8a6"
                    strokeWidth={3}
                    fill="url(#colorLessons)"
                    name="Lessons Completed"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">
                <p>No activity data yet</p>
              </div>
            )}
          </div>

          <div className="bg-slate-900/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-md">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-50">Fluency Score Trend</h3>
                <p className="text-sm text-slate-300">Average lesson scores over time</p>
              </div>
            </div>

            {timeline.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={timeline.map((item) => ({
                    ...item,
                    date: new Date(item.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })
                  }))}
                >
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.9} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2933" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis domain={[0, 100]} stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#020617',
                      border: '1px solid rgba(148,163,184,0.4)',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px -5px rgba(15,23,42,0.8)',
                      padding: '10px 12px',
                      color: '#e5e7eb'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="avg_score"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ fill: '#6366f1', r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Average Score"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">
                <p>No score data yet</p>
              </div>
            )}
          </div>
        </div>

        {recentActivity.length > 0 && (
          <div className="bg-slate-900/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/10 mt-4 mb-20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-50">Recent Activity</h3>
                <p className="text-sm text-slate-300">Your latest completed lessons</p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl">
              <table className="min-w-full rounded-xl overflow-hidden">
                <thead>
                  <tr className="border-b border-white/10 bg-slate-900/80">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Lesson
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      XP
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {recentActivity.map((activity, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gradient-to-r hover:from-slate-900 hover:to-slate-800 transition-all"
                    >
                      <td className="px-4 py-4 text-sm font-medium text-slate-50">
                        {activity.lesson_title}
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-200">
                        <div className="flex flex-col">
                          <span className="font-medium">{activity.course_title}</span>
                          <span className="text-xs text-gray-500">{activity.language}</span>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            activity.score >= 80
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/60'
                              : activity.score >= 60
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-400/60'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-400/60'
                          }`}
                        >
                          {activity.score}%
                        </span>
                      </td>

                      <td className="px-4 py-4 text-sm">
                        <span className="inline-flex items-center gap-1 text-amber-300 font-semibold">
                          <Trophy className="w-4 h-4" />
                          {activity.xp_earned}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-600">
                        {new Date(activity.completion_time).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressPage;
