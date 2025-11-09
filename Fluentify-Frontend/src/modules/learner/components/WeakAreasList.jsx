import React from 'react';
import { AlertCircle, TrendingDown } from 'lucide-react';

const WeakAreasList = ({ weakAreas }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-red-100 p-2 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Areas for Improvement</h3>
          <p className="text-sm text-gray-600">Topics needing more practice</p>
        </div>
      </div>

      {weakAreas && weakAreas.length > 0 ? (
        <div className="space-y-4">
          {weakAreas.map((area) => (
            <div
              key={area.unitId}
              className="bg-red-50 border border-red-200 rounded-lg p-4"
            >
              <div className="flex items-start gap-3">
                <TrendingDown className="w-5 h-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">{area.topic}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <span>Accuracy: {area.accuracy.toFixed(0)}%</span>
                    <span>
                      {area.correctAttempts}/{area.totalAttempts} correct
                    </span>
                  </div>
                  <div className="w-full bg-red-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-red-600 h-2 rounded-full"
                      style={{ width: `${area.accuracy}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-700 bg-white rounded px-2 py-1 inline-block">
                    💡 Tip: Review this topic and practice more exercises to improve
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-green-600 mb-2">🎉</div>
          <p className="text-gray-600">Great job! No weak areas detected.</p>
          <p className="text-sm text-gray-500">Keep up the excellent work!</p>
        </div>
      )}
    </div>
  );
};

export default WeakAreasList;
