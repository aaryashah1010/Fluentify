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
        <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
          Lessons
        </h4>
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
        <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-4 text-center text-slate-200">
          <p className="text-sm text-slate-300 mb-2">No lessons yet</p>
          <button
            onClick={onAddLesson}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-teal-500 to-orange-500 text-white rounded-xl hover:from-teal-600 hover:to-orange-600 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Add First Lesson
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {lessons.map((lesson, index) => (
            <div
              key={lesson.id}
              className="bg-slate-900/80 border border-white/10 rounded-2xl p-4 shadow-md hover:shadow-lg hover:scale-[1.01] transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-8 h-8 bg-gradient-to-br from-teal-500/20 to-sky-500/20 rounded-lg flex items-center justify-center text-teal-300 flex-shrink-0">
                    {getContentIcon(lesson.content_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-slate-50 text-sm">
                      Lesson {index + 1}: {lesson.title}
                    </h5>
                    {lesson.description && (
                      <p className="text-xs text-slate-300 mt-1 line-clamp-2">{lesson.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                      <span className="px-2 py-0.5 bg-slate-800/80 border border-white/10 rounded capitalize">
                        {lesson.content_type}
                      </span>
                      {lesson.xp_reward > 0 && (
                        <span className="text-amber-300">+{lesson.xp_reward} XP</span>
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
                    className="p-1.5 text-teal-300 hover:bg-slate-800 rounded transition-colors"
                    title="Edit lesson"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteLesson(lesson.id)}
                    className="p-1.5 text-rose-400 hover:bg-slate-800 rounded transition-colors"
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
