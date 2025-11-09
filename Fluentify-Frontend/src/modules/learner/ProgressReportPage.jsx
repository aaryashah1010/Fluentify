import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';
import { useProgressReport } from '../../hooks/useProgressReport';
import { PageHeader, LoadingSpinner } from '../../components';
import {
  TimeRangeSelector,
  OverviewStats,
  VocabularyGrowthChart,
  FluencyScoresChart,
  ActivityTimelineChart,
  TopicsProgressList,
  WeakAreasList,
  AchievementsList,
} from './components';

const ProgressReportPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('30days');

  const { data, isLoading, error } = useProgressReport(courseId, timeRange);

  const reportData = data?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-green-50">
        <PageHeader
          title="Progress Report"
          showBack
          onBack={() => navigate(`/course/${courseId}`)}
        />
        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="large" />
          </div>
        </main>
      </div>
    );
  }

  if (error || !reportData) {
    return (
      <div className="min-h-screen bg-green-50">
        <PageHeader
          title="Progress Report"
          showBack
          onBack={() => navigate(`/course/${courseId}`)}
        />
        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <p className="text-red-600 mb-4">
              {error?.message || 'Failed to load progress report'}
            </p>
            <button
              onClick={() => navigate(`/course/${courseId}`)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Back to Course
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <PageHeader
        title="Progress Report"
        showBack
        onBack={() => navigate(`/course/${courseId}`)}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Time Range Selector */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your Learning Progress</h2>
              <p className="text-sm text-gray-600">Track your vocabulary growth and fluency scores</p>
            </div>
          </div>
          <TimeRangeSelector selectedRange={timeRange} onRangeChange={setTimeRange} />
        </div>

        {/* Overview Stats */}
        <div className="mb-8">
          <OverviewStats overview={reportData.overview} />
        </div>

        {/* Charts Row 1: Vocabulary & Fluency */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <VocabularyGrowthChart vocabularyGrowth={reportData.vocabularyGrowth} />
          <FluencyScoresChart fluencyScores={reportData.fluencyScores} />
        </div>

        {/* Activity Timeline */}
        <div className="mb-8">
          <ActivityTimelineChart activityTimeline={reportData.activityTimeline} />
        </div>

        {/* Topics Progress & Weak Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <TopicsProgressList topicsProgress={reportData.topicsProgress} />
          <WeakAreasList weakAreas={reportData.weakAreas} />
        </div>

        {/* Achievements */}
        <div className="mb-8">
          <AchievementsList achievements={reportData.achievements} />
        </div>

        {/* Exercise Statistics Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Exercise Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                {reportData.exerciseStatistics.totalAttempts}
              </p>
              <p className="text-sm text-gray-600">Total Attempts</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {reportData.exerciseStatistics.correctAttempts}
              </p>
              <p className="text-sm text-gray-600">Correct Answers</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">
                {reportData.exerciseStatistics.accuracy.toFixed(1)}%
              </p>
              <p className="text-sm text-gray-600">Overall Accuracy</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProgressReportPage;
