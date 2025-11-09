import React from 'react';
import { BookOpen, CheckCircle } from 'lucide-react';

const TopicsProgressList = ({ topicsProgress }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-indigo-100 p-2 rounded-lg">
          <BookOpen className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Topics Progress</h3>
          <p className="text-sm text-gray-600">Progress by unit</p>
        </div>
      </div>

      {topicsProgress && topicsProgress.length > 0 ? (
        <div className="space-y-4">
          {topicsProgress.map((topic) => (
            <div key={topic.unitId} className="border-b border-gray-100 pb-4 last:border-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {topic.progress === 100 && (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                  <h4 className="font-medium text-gray-900">{topic.topic}</h4>
                </div>
                <span className="text-sm text-gray-600">
                  {topic.lessonsCompleted} lessons • {topic.totalXP} XP
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mb-2">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{topic.progress.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${topic.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Accuracy Bar */}
              <div>
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>Accuracy</span>
                  <span>{topic.accuracy.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      topic.accuracy >= 80
                        ? 'bg-green-600'
                        : topic.accuracy >= 60
                        ? 'bg-yellow-600'
                        : 'bg-red-600'
                    }`}
                    style={{ width: `${topic.accuracy}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No topic progress data available
        </div>
      )}
    </div>
  );
};

export default TopicsProgressList;
