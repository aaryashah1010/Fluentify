import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Award,
  BookOpen,
  Flame,
  Target,
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-teal-50/30 flex items-center justify-center">
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
            className="px-6 py-3 bg-gradient-to-r from-orange-400 to-teal-400 text-white rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg cursor-pointer"
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-teal-50/30">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-orange-500 hover:text-teal-500 mb-6 font-medium transition-colors cursor-pointer"
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
              onClick={() => navigate('/learner/modules')}
              className="px-8 py-4 bg-gradient-to-r from-orange-400 to-teal-400 text-white rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
            >
              Start Learning Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-teal-50/30">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-orange-500 hover:text-teal-500 mb-6 font-medium transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-teal-400 rounded-full flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-teal-400 bg-clip-text text-transparent">Your Progress Report</h1>
              </div>
              <p className="text-gray-600 text-lg ml-15">Track your learning journey and celebrate achievements</p>
            </div>

            {/* Course Filter, Time Range Filter & Refresh */}
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Course Selector */}
<div className="relative rounded-full bg-white border-2 border-orange-300 shadow-sm">
  <select
    className="
  w-full appearance-none 
  px-0 py-4 pl-6 pr-14
  bg-transparent
  text-gray-800 text-sm font-medium
  rounded-full
  focus:outline-none focus:ring-0 border-none
  leading-tight
  cursor-pointer
"

  >

    <option value="">All Courses</option>
    {courses.map((course) => (
      <option key={course.id} value={course.id}>
        {course.language} - {course.title}
      </option>
    ))}
  </select>

  {/* Icon */}
  <Globe
  className="
    absolute right-3 top-1/2 -translate-y-[60%]
    w-4 h-4 text-orange-500 pointer-events-none
  "
/>
</div>


              {/* Time Range Buttons */}
              {timeRangeButtons.map((btn) => (
                <button
                  key={btn.value}
                  onClick={() => setTimeRange(btn.value)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all cursor-pointer ${
                    timeRange === btn.value
                      ? 'bg-gradient-to-r from-orange-400 to-teal-400 text-white shadow-lg'
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
  className={`
    px-4 py-2 text-sm font-medium rounded-full transition-all
    flex items-center gap-2
    border border-gray-200 bg-white text-gray-700
    hover:shadow-md hover:scale-105
    cursor-pointer
    ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
    hover:bg-gradient-to-r hover:from-orange-400 hover:to-teal-400 hover:text-white hover:border-transparent
  `}
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
          <div className="bg-gradient-to-br from-orange-50 to-teal-50 rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border border-orange-100">
  <div className="flex items-center justify-between mb-4">
    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-teal-400 rounded-full flex items-center justify-center shadow-md">
      <Trophy className="w-6 h-6 text-white" />
    </div>
    <Zap className="w-5 h-5 text-orange-500" />
  </div>
  
  <p className="text-sm font-medium text-gray-600 mb-1">Total XP</p>
  <p className="text-3xl font-bold text-gray-900">{summary.total_xp || 0}</p>
</div>


          {/* Lessons Completed Card */}
          <div className="bg-gradient-to-br from-teal-50 to-orange-50 rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border border-teal-100">
  <div className="flex items-center justify-between mb-4">
    <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-orange-400 rounded-full flex items-center justify-center shadow-md">
      <BookOpen className="w-6 h-6 text-white" />
    </div>
    <Star className="w-5 h-5 text-teal-500" />
  </div>

  <p className="text-sm font-medium text-gray-600 mb-1">Lessons Completed</p>
  <p className="text-3xl font-bold text-gray-900">{summary.lessons_completed || 0}</p>
</div>


          {/* Current Streak Card */}
          <div className="bg-gradient-to-br from-orange-50 to-teal-50 rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border border-orange-100">
  <div className="flex items-center justify-between mb-4">
    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-teal-400 rounded-full flex items-center justify-center shadow-md">
      <Flame className="w-6 h-6 text-white" />
    </div>
    <Award className="w-5 h-5 text-orange-500" />
  </div>

  <p className="text-sm font-medium text-gray-600 mb-1">Current Streak</p>
  <p className="text-3xl font-bold text-gray-900">
    {summary.current_streak || 0} <span className="text-lg text-gray-600">days</span>
  </p>
</div>

        </div>

        {/* Charts Section */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

  {/* Lessons Completed Over Time */}
  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-teal-400 rounded-lg flex items-center justify-center">
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
          
          {/* Gradient Fill */}
          <defs>
            <linearGradient id="colorLessons" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.9} />   {/* teal */}
              <stop offset="95%" stopColor="#f97316" stopOpacity={0.3} />  {/* orange */}
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#ececec" />
          <XAxis dataKey="date" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />

          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #f97316', // orange border
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.08)'
            }}
          />

          <Area
            type="monotone"
            dataKey="lessons_count"
            stroke="#14b8a6"  // teal line
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
      <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-orange-400 rounded-lg flex items-center justify-center">
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

          {/* Gradient for points/area effect */}
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.9} />  {/* teal */}
              <stop offset="95%" stopColor="#f97316" stopOpacity={0.3} /> {/* orange */}
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#ececec" />
          <XAxis dataKey="date" stroke="#94a3b8" />
          <YAxis domain={[0, 100]} stroke="#94a3b8" />

          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #14b8a6', // teal border
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.08)'
            }}
          />

          <Line
            type="monotone"
            dataKey="avg_score"
            stroke="#14b8a6"   // teal
            strokeWidth={3}
            dot={{ fill: '#14b8a6', r: 4 }}
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
  <div className="bg-white rounded-2xl shadow-lg p-6 border border-teal-100">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-teal-400 rounded-lg flex items-center justify-center shadow-md">
        <Calendar className="w-5 h-5 text-white" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
        <p className="text-sm text-gray-500">Your latest completed lessons</p>
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="min-w-full">
        
        {/* Table Header */}
        <thead>
          <tr className="border-b border-orange-100 bg-gradient-to-r from-orange-50 to-teal-50">
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Lesson
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Course
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Score
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              XP
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Date
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-gray-100">
          {recentActivity.map((activity, index) => (
            <tr
              key={index}
              className="transition-all hover:bg-gradient-to-r hover:from-orange-50 hover:to-teal-50"
            >
              {/* Lesson Title */}
              <td className="px-4 py-4 text-sm font-medium text-gray-900">
                {activity.lesson_title}
              </td>

              {/* Course */}
              <td className="px-4 py-4 text-sm text-gray-600">
                <div className="flex flex-col">
                  <span className="font-medium text-gray-800">{activity.course_title}</span>
                  <span className="text-xs text-teal-600">{activity.language}</span>
                </div>
              </td>

              {/* Score Badge */}
              <td className="px-4 py-4 text-sm">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    activity.score >= 80
                      ? 'bg-gradient-to-r from-teal-100 to-orange-100 text-teal-700'
                      : activity.score >= 60
                        ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700'
                        : 'bg-gradient-to-r from-red-100 to-orange-100 text-red-700'
                  }`}
                >
                  {activity.score}%
                </span>
              </td>

              {/* XP Earned */}
              <td className="px-4 py-4 text-sm">
                <span className="inline-flex items-center gap-1 text-orange-600 font-semibold">
                  <Trophy className="w-4 h-4" />
                  {activity.xp_earned}
                </span>
              </td>

              {/* Date */}
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
