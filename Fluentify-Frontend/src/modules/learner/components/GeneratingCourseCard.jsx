import React from 'react';
import { Loader, BookOpen } from 'lucide-react';

const GeneratingCourseCard = ({ state, onClick }) => {
  const { language, progress, units, totalUnits } = state;
  const generatedUnits = units.filter(u => u !== null).length;

  return (
    <div 
      onClick={onClick}
      className="bg-slate-900/90 rounded-2xl shadow-xl border border-teal-400/60 overflow-hidden hover:shadow-2xl hover:border-orange-400/70 transition-all cursor-pointer relative"
    >
      {/* Generating Badge */}
      <div className="absolute top-3 right-3 bg-gradient-to-r from-teal-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 animate-pulse">
        <Loader className="w-3 h-3 animate-spin" />
        Generating
      </div>

      {/* Card Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-50 mb-1">
              {language} Course
            </h3>
            <p className="text-xs text-slate-300">
              Creating your personalized learning path...
            </p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300">Progress</span>
            <span className="font-semibold text-teal-300">{progress}</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-teal-400 via-emerald-400 to-orange-400 h-full transition-all duration-500"
              style={{ width: `${(generatedUnits / totalUnits) * 100}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs">
          <div className="text-center">
            <div className="text-lg font-bold text-emerald-300">{generatedUnits}</div>
            <div className="text-[11px] text-slate-300">Generated</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-teal-300">
              {totalUnits - generatedUnits}
            </div>
            <div className="text-[11px] text-slate-300">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-slate-400">{totalUnits}</div>
            <div className="text-[11px] text-slate-400">Total Units</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-950/80 border-t border-white/10 px-6 py-3">
        <div className="text-xs text-teal-200 font-medium">
          {generatedUnits > 0 ? (
            <span>✨ Click to view generated units</span>
          ) : (
            <span>⏳ Preparing your first unit...</span>
          )}
        </div>
      </div>
    </div>
  );
}
;

export default GeneratingCourseCard;
