// import React from 'react';
// import { Mail, Calendar } from 'lucide-react';

// export const UserCard = ({ user, onClick }) => {

//   const xp = user?.xp ?? 0;
//   const currentCourse = user?.current_course || 'Not enrolled in a course yet';
//   const lessonsCompleted = user?.lessons_completed ?? 0;
//   const lastActive = user?.last_active_at
//     ? new Date(user.last_active_at).toLocaleString()
//     : 'No activity yet';
//   const progress = Math.max(0, Math.min(100, user?.progress_percent ?? 0));

//   return (
//     <div
//       onClick={onClick}
//       className="group relative overflow-hidden rounded-3xl bg-[#FCECCC] border border-[#F3DFC0] shadow-sm hover:shadow-md transition-all cursor-pointer"
//     >
//       {/* Gradient header */}
//       <div className="bg-gradient-to-br from-[#F29A36] via-[#A8C79B] to-[#56D7C5] h-20 sm:h-24 flex items-center px-4 sm:px-5">
//         <div>
//           <h3 className="font-semibold text-lg sm:text-xl text-white mb-0.5 truncate">{user.name}</h3>
//           <p className="text-[11px] text-white/80 flex items-center gap-1 truncate">
//             <Mail className="w-3 h-3" />
//             <span>{user.email}</span>
//           </p>
//         </div>
//       </div>

//       {/* Body */}
//       <div className="px-4 py-3 sm:px-5 sm:py-4 space-y-3 text-sm text-slate-800">
//         <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
//           <Calendar className="w-3 h-3" />
//           <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
//         </div>

//         <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
//           <div>
//             <p className="text-[11px] uppercase tracking-wide text-slate-500">XP</p>
//             <p className="font-semibold text-slate-900">{xp}</p>
//           </div>
//           <div>
//             <p className="text-[11px] uppercase tracking-wide text-slate-500">Lessons Completed</p>
//             <p className="font-semibold text-slate-900">{lessonsCompleted}</p>
//           </div>
//           <div className="col-span-2">
//             <p className="text-[11px] uppercase tracking-wide text-slate-500 mb-0.5">Current Course</p>
//             <p className="font-semibold text-slate-900 truncate">{currentCourse}</p>
//           </div>
//           <div className="col-span-2">
//             <p className="text-[11px] uppercase tracking-wide text-slate-500 mb-0.5">Last Active</p>
//             <p className="font-semibold text-slate-900 truncate">{lastActive}</p>
//           </div>
//         </div>

//         {/* Progress bar */}
//         <div className="mt-1">
//           <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
//             <span>Progress</span>
//             <span className="font-semibold text-slate-800">{progress}%</span>
//           </div>
//           <div className="h-1.5 rounded-full bg-white/60 overflow-hidden">
//             <div
//               className="h-full rounded-full bg-gradient-to-r from-[#F29A36] via-[#A8C79B] to-[#56D7C5] transition-all"
//               style={{ width: `${progress}%` }}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

import React from 'react';
import { Mail, Calendar } from 'lucide-react';

export const UserCard = ({ user, onClick }) => {

  const xp = user?.xp ?? 0;
  const currentCourse = user?.current_course || 'Not enrolled in a course yet';
  const lessonsCompleted = user?.lessons_completed ?? 0;
  const lastActive = user?.last_active_at
    ? new Date(user.last_active_at).toLocaleString()
    : 'No activity yet';
  const progress = Math.max(0, Math.min(100, user?.progress_percent ?? 0));

  return (
    <div
      onClick={onClick}
      className="group relative overflow-hidden rounded-3xl bg-white border border-[#F3DFC0] shadow-sm hover:shadow-md transition-all cursor-pointer"
    >
      {/* Keep gradient header */}
      <div className="bg-gradient-to-br from-[#F29A36] via-[#A8C79B] to-[#56D7C5] h-20 sm:h-24 flex items-center px-4 sm:px-5">
        <div>
          <h3 className="font-semibold text-lg sm:text-xl text-white mb-0.5 truncate">
            {user.name}
          </h3>

          {/* Email */}
          <p className="text-[11px] text-white/90 flex items-center gap-1 truncate">
            <Mail className="w-3 h-3" />
            <span>{user.email}</span>
          </p>

          {/* Joined date inside gradient */}
          <p className="text-[10px] text-white/80 flex items-center gap-1 mt-0.5 truncate">
            <Calendar className="w-3 h-3" />
            Joined {new Date(user.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Body - NOW FULL WHITE (peach removed) */}
      <div className="px-4 py-3 sm:px-5 sm:py-4 space-y-3 text-sm text-slate-800 bg-white">
        <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-slate-500">XP</p>
            <p className="font-semibold text-slate-900">{xp}</p>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-wide text-slate-500">Lessons Completed</p>
            <p className="font-semibold text-slate-900">{lessonsCompleted}</p>
          </div>

          <div className="col-span-2">
            <p className="text-[11px] uppercase tracking-wide text-slate-500 mb-0.5">Current Course</p>
            <p className="font-semibold text-slate-900 truncate">{currentCourse}</p>
          </div>

          <div className="col-span-2">
            <p className="text-[11px] uppercase tracking-wide text-slate-500 mb-0.5">Last Active</p>
            <p className="font-semibold text-slate-900 truncate">{lastActive}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-1">
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span>Progress</span>
            <span className="font-semibold text-slate-800">{progress}%</span>
          </div>

          <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#A8C79B] via-[#8FCAB4] to-[#56D7C5] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
