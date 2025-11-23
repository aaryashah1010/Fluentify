import React, { useState } from 'react';
import { Plus, Edit, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import LessonList from './LessonList';

const UnitList = ({ units = [], onAddUnit, onEditUnit, onDeleteUnit, onAddLesson, onEditLesson, onDeleteLesson }) => {
  const [expandedUnits, setExpandedUnits] = useState(new Set());

  const toggleUnit = (unitId) => {
    const newExpanded = new Set(expandedUnits);
    if (newExpanded.has(unitId)) {
      newExpanded.delete(unitId);
    } else {
      newExpanded.add(unitId);
    }
    setExpandedUnits(newExpanded);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-100">Units</h3>
        {units.length > 0 && (
          <button
            onClick={onAddUnit}
            className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-teal-500 to-orange-500 text-slate-950 rounded-xl hover:from-teal-600 hover:to-orange-600 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Unit
          </button>
        )}
      </div>

      {units.length === 0 ? (
        <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 text-center">
          <p className="text-slate-300 mb-3">No units yet</p>
          <button
            onClick={onAddUnit}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-orange-500 text-slate-950 rounded-xl hover:from-teal-600 hover:to-orange-600 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Add First Unit
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {units.map((unit, index) => (
            <div key={unit.id} className="border border-white/10 bg-slate-900/80 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all">
              {/* Unit Header */}
              <div className="bg-slate-950/80 p-4">
                <div className="flex items-start justify-between">
                  <button
                    onClick={() => toggleUnit(unit.id)}
                    className="flex items-start gap-3 flex-1 text-left"
                  >
                    {expandedUnits.has(unit.id) ? (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-50">
                        Unit {index + 1}: {unit.title}
                      </h4>
                      {unit.description && (
                        <p className="text-sm text-slate-300 mt-1">{unit.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                        <span className="px-2 py-1 bg-slate-800/80 rounded border border-white/10">{unit.difficulty}</span>
                        <span>{unit.estimated_time || 0} min</span>
                        <span>{unit.lessons?.length || 0} lessons</span>
                      </div>
                    </div>
                  </button>
                  <div className="flex gap-2 ml-3">
                    <button
                      onClick={() => onEditUnit(unit)}
                      className="p-2 text-teal-300 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Edit unit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteUnit(unit.id)}
                      className="p-2 text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Delete unit"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Lessons (Expanded) */}
              {expandedUnits.has(unit.id) && (
                <div className="bg-slate-950/80 border-t border-white/10 p-4">
                  <LessonList
                    lessons={unit.lessons || []}
                    unitId={unit.id}
                    onAddLesson={() => onAddLesson(unit.id)}
                    onEditLesson={onEditLesson}
                    onDeleteLesson={onDeleteLesson}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UnitList;
