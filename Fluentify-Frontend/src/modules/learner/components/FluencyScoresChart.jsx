import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import { Target } from 'lucide-react';

const FluencyScoresChart = ({ fluencyScores }) => {
  const { overall, listening, reading, writing, speaking, breakdown } = fluencyScores;

  const radarData = [
    { category: 'Listening', score: listening },
    { category: 'Reading', score: reading },
    { category: 'Writing', score: writing },
    { category: 'Speaking', score: speaking },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-purple-100 p-2 rounded-lg">
            <Target className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Fluency Scores</h3>
            <p className="text-sm text-gray-600">Overall Score: {overall}/100</p>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={radarData}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis
            dataKey="category"
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#9ca3af', fontSize: 10 }} />
          <Radar
            name="Fluency"
            dataKey="score"
            stroke="#8b5cf6"
            fill="#8b5cf6"
            fillOpacity={0.6}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px 12px',
            }}
          />
        </RadarChart>
      </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-600">Completion Rate</p>
          <p className="text-lg font-semibold text-gray-900">{breakdown.completionRate}%</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-600">Accuracy</p>
          <p className="text-lg font-semibold text-gray-900">{breakdown.accuracy}%</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-600">Consistency</p>
          <p className="text-lg font-semibold text-gray-900">{breakdown.consistency}%</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-600">Time Investment</p>
          <p className="text-lg font-semibold text-gray-900">{breakdown.timeInvestment}%</p>
        </div>
      </div>
    </div>
  );
};

export default FluencyScoresChart;
