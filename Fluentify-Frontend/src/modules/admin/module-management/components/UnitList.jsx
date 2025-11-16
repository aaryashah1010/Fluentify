import React, { useState } from 'react';
import { Plus, Edit, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import LessonList from './LessonList';

const UnitList = ({ units = [], onAddUnit, onEditUnit, onDeleteUnit, onAddLesson, onEditLesson, onDeleteLesson }) => {
  const [expandedUnits, setExpandedUnits] = useState(new Set());

  const toggleUnit = (unitId) => {
    const newExpanded = new Set(expandedUnits);
    if (newExpanded.has(unitId)) newExpanded.delete(unitId);
    else newExpanded.add(unitId);
    setExpandedUnits(newExpanded);
  };

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Units</h3>
        <button
          onClick={onAddUnit}
          className="flex items-center gap-2 px-3 py-2 bg-teal-500 text-white rounded-lg 
                     hover:bg-teal-600 transition-colors text-sm shadow-md"
        >
          <Plus className="w-4 h-4" />
          Add Unit
        </button>
      </div>

      {/* Empty State */}
      {units.length === 0 ? (
        <div className="bg-white/70 backdrop-blur-sm border border-orange-200 rounded-xl p-6 text-center shadow-sm">
          <p className="text-gray-700 mb-3">No units yet</p>
          <button
            onClick={onAddUnit}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg 
                       hover:bg-teal-600 transition-colors text-sm shadow-md"
          >
            <Plus className="w-4 h-4" />
            Add First Unit
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {units.map((unit, index) => (
            <div
              key={unit.id}
              className="border border-orange-200 rounded-xl overflow-hidden bg-white/70 backdrop-blur-sm shadow-sm"
            >
              {/* Unit Header */}
              <div className="p-4">
                <div className="flex items-start justify-between">

                  <button
                    onClick={() => toggleUnit(unit.id)}
                    className="flex items-start gap-3 flex-1 text-left"
                  >
                    {expandedUnits.has(unit.id) ? (
                      <ChevronDown className="w-5 h-5 text-teal-500 mt-0.5" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-teal-500 mt-0.5" />
                    )}

                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        Unit {index + 1}: {unit.title}
                      </h4>

                      {unit.description && (
                        <p className="text-sm text-gray-700 mt-1">{unit.description}</p>
                      )}

                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-lg">
                          {unit.difficulty}
                        </span>
                        <span>{unit.estimated_time || 0} min</span>
                        <span>{unit.lessons?.length || 0} lessons</span>
                      </div>
                    </div>
                  </button>

                  {/* Actions */}
                  <div className="flex gap-2 ml-3">
                    <button
                      onClick={() => onEditUnit(unit)}
                      className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onDeleteUnit(unit.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Lessons */}
              {expandedUnits.has(unit.id) && (
                <div className="bg-gray-50 border-t border-orange-200 p-4">
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
