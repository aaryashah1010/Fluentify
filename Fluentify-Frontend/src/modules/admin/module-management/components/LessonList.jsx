// import React from 'react';
// import { Plus, Edit, Trash2, BookOpen, Video, Headphones, FileText, MessageSquare } from 'lucide-react';

// const LessonList = ({ lessons = [], unitId, onAddLesson, onEditLesson, onDeleteLesson }) => {
//   const getContentIcon = (contentType) => {
//     switch (contentType) {
//       case 'video':
//         return <Video className="w-4 h-4" />;
//       case 'listening':
//         return <Headphones className="w-4 h-4" />;
//       case 'reading':
//         return <FileText className="w-4 h-4" />;
//       case 'conversation':
//         return <MessageSquare className="w-4 h-4" />;
//       default:
//         return <BookOpen className="w-4 h-4" />;
//     }
//   };

//   return (
//     <div className="space-y-3">
//       <div className="flex items-center justify-between">
//         <h4 className="text-sm font-semibold text-gray-700">Lessons</h4>
//         <button
//           onClick={onAddLesson}
//           className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
//         >
//           <Plus className="w-4 h-4" />
//           Add Lesson
//         </button>
//       </div>

//       {lessons.length === 0 ? (
//         <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
//           <p className="text-sm text-gray-600 mb-2">No lessons yet</p>
//           <button
//             onClick={onAddLesson}
//             className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
//           >
//             <Plus className="w-4 h-4" />
//             Add First Lesson
//           </button>
//         </div>
//       ) : (
//         <div className="space-y-2">
//           {lessons.map((lesson, index) => (
//             <div
//               key={lesson.id}
//               className="bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors"
//             >
//               <div className="flex items-start justify-between">
//                 <div className="flex items-start gap-3 flex-1">
//                   <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
//                     {getContentIcon(lesson.content_type)}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <h5 className="font-medium text-gray-900 text-sm">
//                       Lesson {index + 1}: {lesson.title}
//                     </h5>
//                     {lesson.description && (
//                       <p className="text-xs text-gray-600 mt-1 line-clamp-2">{lesson.description}</p>
//                     )}
//                     <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
//                       <span className="px-2 py-0.5 bg-gray-100 rounded capitalize">
//                         {lesson.content_type}
//                       </span>
//                       {lesson.xp_reward > 0 && (
//                         <span className="text-yellow-600">+{lesson.xp_reward} XP</span>
//                       )}
//                       {lesson.key_phrases && lesson.key_phrases.length > 0 && (
//                         <span>{lesson.key_phrases.length} phrases</span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex gap-1 ml-3">
//                   <button
//                     onClick={() => onEditLesson(lesson)}
//                     className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
//                     title="Edit lesson"
//                   >
//                     <Edit className="w-4 h-4" />
//                   </button>
//                   <button
//                     onClick={() => onDeleteLesson(lesson.id)}
//                     className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
//                     title="Delete lesson"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default LessonList;

import React from 'react';
import {
  Plus,
  Edit,
  Trash2,
  BookOpen,
  Video,
  Headphones,
  FileText,
  MessageSquare,
} from 'lucide-react';

const LessonList = ({ lessons = [], unitId, onAddLesson, onEditLesson, onDeleteLesson }) => {
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
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-800">Lessons</h4>

        <button
          onClick={onAddLesson}
          className="flex items-center gap-1 px-3 py-1.5 bg-teal-500 text-white 
                     rounded-xl hover:bg-teal-600 transition-all text-sm shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Lesson
        </button>
      </div>

      {/* Empty State */}
      {lessons.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-sm border border-orange-200 rounded-2xl p-6 text-center shadow-sm">
          <p className="text-sm text-gray-600 mb-3">No lessons yet</p>

          <button
            onClick={onAddLesson}
            className="inline-flex items-center gap-1 px-4 py-2 bg-orange-500 
                       text-white rounded-xl hover:bg-orange-600 transition text-sm"
          >
            <Plus className="w-4 h-4" />
            Add First Lesson
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {lessons.map((lesson, index) => (
            <div
              key={lesson.id}
              className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-2xl p-4
                         hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">

                {/* Lesson Content */}
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center text-teal-600">
                    {getContentIcon(lesson.content_type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-gray-900 text-sm">
                      Lesson {index + 1}: {lesson.title}
                    </h5>

                    {lesson.description && (
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{lesson.description}</p>
                    )}

                    {/* Badges */}
                    <div className="flex items-center gap-3 mt-2 text-xs">
                      <span className="px-2 py-0.5 bg-teal-100 text-teal-700 rounded-lg capitalize">
                        {lesson.content_type}
                      </span>

                      {lesson.xp_reward > 0 && (
                        <span className="text-orange-600 font-medium">
                          +{lesson.xp_reward} XP
                        </span>
                      )}

                      {lesson.key_phrases?.length > 0 && (
                        <span className="text-gray-600">{lesson.key_phrases.length} phrases</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 ml-3">
                  <button
                    onClick={() => onEditLesson(lesson)}
                    className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
                    title="Edit lesson"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDeleteLesson(lesson.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
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
