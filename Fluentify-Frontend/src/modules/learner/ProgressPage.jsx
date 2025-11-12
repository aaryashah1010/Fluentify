import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Award, BookOpen, Flame, Target, ArrowLeft, Calendar, RefreshCw, Zap, Trophy, Star, Activity, Globe } from 'lucide-react';
import { useProgressReport } from '../../hooks/useProgress';
import { useCourses } from '../../hooks/useCourses';
import { StatCard } from './components';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const ProgressPage = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState(null);
  
  const { data: courses = [] } = useCourses();
  const { data, isLoading, error, refetch } = useProgressReport(timeRange, selectedCourse);
  const { summary = {}, timeline = [], recentActivity = [] } = data || {};

  const handleRefresh = () => {
    refetch();
  };

  // Calculate cumulative vocabulary for the area chart
  const cumulativeTimeline = timeline.reduce((acc, item, index) => {
    const cumulative = index === 0 
      ? item.vocabulary_learned 
      : acc[index - 1].cumulative_vocabulary + item.vocabulary_learned;
    
    acc.push({
      ...item,
      cumulative_vocabulary: cumulative,
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    });
    return acc;
  }, []);

  const timeRangeButtons = [
    { label: 'Last 7 Days', value: '7d' },
    { label: 'Last 30 Days', value: '30d' },
    { label: 'All Time', value: 'all' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto"></div>
            <TrendingUp className="w-8 h-8 text-indigo-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="mt-6 text-lg font-medium text-gray-700">Loading your progress...</p>
          <p className="mt-2 text-sm text-gray-500">Preparing your learning insights</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Progress</h2>
          <p className="text-gray-600 mb-6">We couldn't fetch your progress data. Please try again.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (summary.lessons_completed === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-6 font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>

          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center border border-indigo-100">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-12 h-12 text-indigo-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Your Journey Begins Here</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Complete your first lesson to unlock your personalized progress dashboard and track your learning journey!
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
            >
              Start Learning Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-6 font-medium transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Your Progress Report</h1>
              </div>
              <p className="text-gray-600 text-lg ml-15">Track your learning journey and celebrate achievements</p>
            </div>

            {/* Course Filter, Time Range Filter & Refresh */}
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Course Selector */}
              <div className="relative">
                <select
                  value={selectedCourse || ''}
                  onChange={(e) => setSelectedCourse(e.target.value || null)}
                  className="appearance-none px-4 py-2 pr-10 text-sm font-medium rounded-xl bg-white text-gray-700 border-2 border-gray-200 hover:border-indigo-300 focus:border-indigo-500 focus:outline-none transition-all shadow-sm hover:shadow-md"
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
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-indigo-300 hover:shadow-md'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
              
              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium rounded-xl transition-all bg-white text-gray-700 border border-gray-200 hover:border-indigo-300 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                title="Refresh data"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Summary KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total XP Card */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border border-yellow-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <Zap className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Total XP</p>
            <p className="text-3xl font-bold text-gray-900">{summary.total_xp || 0}</p>
          </div>

          {/* Lessons Completed Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-md">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <Star className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Lessons Completed</p>
            <p className="text-3xl font-bold text-gray-900">{summary.lessons_completed || 0}</p>
          </div>

          {/* Current Streak Card */}
          <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border border-red-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <Award className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Current Streak</p>
            <p className="text-3xl font-bold text-gray-900">{summary.current_streak || 0} <span className="text-lg text-gray-600">days</span></p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Lessons Completed Over Time Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Learning Activity</h3>
                <p className="text-sm text-gray-500">Lessons completed over time</p>
              </div>
            </div>
            {timeline.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={timeline.map(item => ({
                  ...item,
                  date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                }))}>
                  <defs>
                    <linearGradient id="colorLessons" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="lessons_count"
                    stroke="#10b981"
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

          {/* Fluency Score Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Fluency Score Trend</h3>
                <p className="text-sm text-gray-500">Average lesson scores over time</p>
              </div>
            </div>
            {timeline.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timeline.map(item => ({
                  ...item,
                  date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                }))}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis domain={[0, 100]} stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
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

        {/* Recent Activity */}
        {recentActivity.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                <p className="text-sm text-gray-500">Your latest completed lessons</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
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
                    <tr key={index} className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-colors">
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">{activity.lesson_title}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        <div className="flex flex-col">
                          <span className="font-medium">{activity.course_title}</span>
                          <span className="text-xs text-gray-500">{activity.language}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          activity.score >= 80 ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700' :
                          activity.score >= 60 ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700' :
                          'bg-gradient-to-r from-red-100 to-pink-100 text-red-700'
                        }`}>
                          {activity.score}%
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <span className="inline-flex items-center gap-1 text-yellow-600 font-semibold">
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
