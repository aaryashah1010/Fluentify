import React from 'react';
import { Plus, Edit, Trash2, BookOpen, Video, Headphones, FileText, MessageSquare } from 'lucide-react';

const LessonList = ({ lessons = [], onAddLesson, onEditLesson, onDeleteLesson }) => {
  const getContentIcon = (contentType) => {
    switch (contentType) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'listening':
        return <Headphones className="w-4 h-4" />;
      case 'reading':
        return <FileText className="w-4 h-4" />;
      case 'conversation':
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-700">Lessons</h4>
        {lessons.length > 0 && (
          <button
            onClick={onAddLesson}
            className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Lesson
          </button>
        )}
      </div>

      {lessons.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600 mb-2">No lessons yet</p>
          <button
            onClick={onAddLesson}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Add First Lesson
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {lessons.map((lesson, index) => (
            <div
              key={lesson.id}
              className="bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                    {getContentIcon(lesson.content_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-gray-900 text-sm">
                      Lesson {index + 1}: {lesson.title}
                    </h5>
                    {lesson.description && (
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{lesson.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span className="px-2 py-0.5 bg-gray-100 rounded capitalize">
                        {lesson.content_type}
                      </span>
                      {lesson.xp_reward > 0 && (
                        <span className="text-yellow-600">+{lesson.xp_reward} XP</span>
                      )}
                      {lesson.key_phrases && lesson.key_phrases.length > 0 && (
                        <span>{lesson.key_phrases.length} phrases</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 ml-3">
                  <button
                    onClick={() => onEditLesson(lesson)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Edit lesson"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteLesson(lesson.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete lesson"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LessonList;
