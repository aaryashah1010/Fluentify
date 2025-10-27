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
        <h3 className="text-lg font-semibold text-gray-900">Units</h3>
        <button
          onClick={onAddUnit}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Unit
        </button>
      </div>

      {units.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <p className="text-gray-600 mb-3">No units yet</p>
          <button
            onClick={onAddUnit}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Add First Unit
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {units.map((unit, index) => (
            <div key={unit.id} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Unit Header */}
              <div className="bg-white p-4">
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
                      <h4 className="font-medium text-gray-900">
                        Unit {index + 1}: {unit.title}
                      </h4>
                      {unit.description && (
                        <p className="text-sm text-gray-600 mt-1">{unit.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span className="px-2 py-1 bg-gray-100 rounded">{unit.difficulty}</span>
                        <span>{unit.estimated_time || 0} min</span>
                        <span>{unit.lessons?.length || 0} lessons</span>
                      </div>
                    </div>
                  </button>
                  <div className="flex gap-2 ml-3">
                    <button
                      onClick={() => onEditUnit(unit)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit unit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteUnit(unit.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete unit"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Lessons (Expanded) */}
              {expandedUnits.has(unit.id) && (
                <div className="bg-gray-50 border-t border-gray-200 p-4">
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
