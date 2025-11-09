import React from 'react';
import { BookOpen, Award, Flame, TrendingUp } from 'lucide-react';

const OverviewStats = ({ overview }) => {
  const stats = [
    {
      icon: BookOpen,
      label: 'Lessons Completed',
      value: `${overview.totalLessonsCompleted} / ${overview.totalLessons}`,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      icon: Award,
      label: 'Total XP',
      value: overview.totalXP,
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
    },
    {
      icon: Flame,
      label: 'Current Streak',
      value: `${overview.currentStreak} days`,
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
    {
      icon: TrendingUp,
      label: 'Overall Progress',
      value: `${overview.overallProgress.toFixed(1)}%`,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center gap-4">
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <Icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OverviewStats;
