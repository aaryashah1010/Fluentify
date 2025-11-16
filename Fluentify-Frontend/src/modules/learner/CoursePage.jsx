// import React from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   ArrowLeft,
//   Flame,
//   BookOpen,
//   Award,
//   Target,
//   CheckCircle2,
//   Lock,
//   Clock,
//   PlayCircle,
// } from "lucide-react";
// import { useQuery } from "@tanstack/react-query";
// import { fetchCourseDetails } from "../../api/courses";

// const StatCard = ({ icon: Icon, label, value, accent }) => (
//   <div className="flex flex-col rounded-2xl bg-white border border-gray-100 shadow-sm px-5 py-4">
//     <div className="flex items-center gap-3 mb-3">
//       <div
//         className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md bg-gradient-to-br ${accent}`}
//       >
//         <Icon className="w-5 h-5 text-white" />
//       </div>
//       <div className="flex flex-col">
//         <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
//           {label}
//         </span>
//         <span className="text-lg font-semibold text-gray-900">{value}</span>
//       </div>
//     </div>
//   </div>
// );

// const LessonStatusBadge = ({ status }) => {
//   if (status === "completed") {
//     return (
//       <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold border border-green-100">
//         <CheckCircle2 className="w-3.5 h-3.5" />
//         Completed
//       </span>
//     );
//   }
//   if (status === "active") {
//     return (
//       <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
//         <Target className="w-3.5 h-3.5" />
//         In Progress
//       </span>
//     );
//   }
//   return (
//     <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-50 text-gray-500 text-xs font-semibold border border-gray-100">
//       <Lock className="w-3.5 h-3.5" />
//       Locked
//     </span>
//   );
// };

// const getLessonStatus = (lesson) => {
//   if (lesson.status) return lesson.status;
//   if (lesson.is_locked) return "locked";
//   if (lesson.is_completed) return "completed";
//   return "active";
// };

// const CoursePage = () => {
//   const navigate = useNavigate();
//   const { courseId } = useParams();

//   const {
//     data,
//     isLoading,
//     error,
//   } = useQuery({
//     queryKey: ["course", courseId],
//     queryFn: () => fetchCourseDetails(courseId),
//     enabled: !!courseId,
//   });

//   // Your API uses handleResponse, so it returns { success, data }
//   const payload = data?.data || data || {};
//   const course = payload.course || payload;
//   const stats = payload.stats || {};

//   const units = course.units || course.course_units || [];

//   const flatLessons = [];
//   units.forEach((unit) => {
//     const unitLessons = unit.lessons || unit.unit_lessons || [];
//     unitLessons.forEach((lesson) => {
//       const status = getLessonStatus(lesson);
//       flatLessons.push({ unitId: unit.id, lesson, status });
//     });
//   });

//   const resumeLesson =
//     flatLessons.find((item) => item.status === "active") ||
//     flatLessons.find(
//       (item) => item.status !== "completed" && item.status !== "locked"
//     ) ||
//     flatLessons.find((item) => item.status === "completed") ||
//     null;

//   // Robust mapping for different possible field names
//   const totalLessons =
//     stats.total_lessons ??
//     stats.totalLessons ??
//     course.total_lessons ??
//     course.totalLessons ??
//     flatLessons.length;

//   const totalXP =
//     stats.total_xp ??
//     stats.totalXp ??
//     course.total_xp ??
//     course.totalXp ??
//     course.xp ??
//     0;

//   const streakDays =
//     stats.current_streak ??
//     stats.streakDays ??
//     stats.streak ??
//     course.streak_days ??
//     course.streakDays ??
//     course.streak ??
//     0;

//   const lessonsCompleted =
//     stats.lessons_completed ??
//     stats.lessonsCompleted ??
//     course.lessons_completed ??
//     course.lessonsCompleted ??
//     course.completedLessons ??
//     flatLessons.filter((l) => l.status === "completed").length;

//   const unitsCompleted =
//     stats.units_completed ??
//     stats.unitsCompleted ??
//     course.units_completed ??
//     course.unitsCompleted ??
//     course.completedUnits ??
//     units.filter((unit) => {
//       const unitLessons = unit.lessons || unit.unit_lessons || [];
//       if (!unitLessons.length) return false;
//       return unitLessons.every((lesson) => getLessonStatus(lesson) === "completed");
//     }).length;

//   const language =
//     course.language || course.target_language || course.targetLanguage || "Language";
//   const title = course.title || `${language} Learning Journey`;
//   const progressPercent =
//     stats.progress_percent ??
//     stats.progressPercent ??
//     course.progress_percent ??
//     course.progressPercent ??
//     course.progress ??
//     (totalLessons ? (lessonsCompleted / totalLessons) * 100 : 0);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-teal-400 mx-auto mb-4" />
//           <p className="text-gray-700 font-medium">Loading course details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error || !course || Object.keys(course).length === 0) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
//         <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
//           <h2 className="text-xl font-bold text-gray-900 mb-2">
//             Unable to load course
//           </h2>
//           <p className="text-gray-600 mb-6">
//             Something went wrong while fetching this course. Please try again.
//           </p>
//           <button
//             onClick={() => navigate("/dashboard")}
//             className="px-6 py-3 rounded-full bg-gradient-to-r from-orange-400 to-teal-400 text-white font-medium"
//           >
//             Back to Dashboard
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50">
//       <div className="max-w-6xl mx-auto px-6 py-6 md:py-8">

//         {/* Back + Title */}
//         <button
//           onClick={() => navigate("/dashboard")}
//           className="flex items-center gap-2 text-sm font-medium text-orange-500 hover:text-teal-500 mb-4 md:mb-6"
//         >
//           <ArrowLeft className="w-4 h-4" />
//           Back to Dashboard
//         </button>

//         <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8 gap-3">
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
//             {title}
//           </h1>
//           <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-100 to-teal-100 text-xs md:text-sm font-medium text-gray-800 border border-orange-100">
//             <BookOpen className="w-4 h-4 text-orange-500" />
//             Course #{courseId}
//           </span>
//         </div>

//         {/* Stats Row */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 md:mb-8">
//           <StatCard
//             icon={BookOpen}
//             label="Language"
//             value={language}
//             accent="from-orange-400 to-teal-400"
//           />
//           <StatCard
//             icon={BookOpen}
//             label="Total Lessons"
//             value={totalLessons}
//             accent="from-teal-400 to-cyan-400"
//           />
//           <StatCard
//             icon={Award}
//             label="Total XP"
//             value={totalXP}
//             accent="from-amber-400 to-orange-400"
//           />
//           <StatCard
//             icon={Flame}
//             label="Streak"
//             value={`${streakDays} days`}
//             accent="from-red-400 to-orange-400"
//           />
//         </div>

//         {/* Progress Card */}
//         <div className="bg-white rounded-2xl shadow-md border border-gray-100 px-5 py-4 md:px-6 md:py-5 mb-8">
//           <div className="flex justify-between items-center mb-3">
//             <div>
//               <p className="text-sm font-semibold text-gray-900">
//                 Course Progress
//               </p>
//               <p className="text-xs text-gray-500 mt-1">
//                 {lessonsCompleted} lessons completed • {unitsCompleted} units
//                 completed
//               </p>
//             </div>
//             <p className="text-sm font-semibold text-gray-700">
//               {Number(progressPercent || 0).toFixed(1)}%
//             </p>
//           </div>

//           <div className="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden">
//             <div
//               className="h-2.5 rounded-full bg-gradient-to-r from-orange-400 to-teal-400"
//               style={{ width: `${Math.min(Number(progressPercent) || 0, 100)}%` }}
//             />
//           </div>

//           {resumeLesson && (
//             <div className="mt-4 flex justify-end">
//               <button
//                 type="button"
//                 onClick={() =>
//                   navigate(
//                     `/lesson/${courseId}/${resumeLesson.unitId}/${resumeLesson.lesson.id}`
//                   )
//                 }
//                 className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-400 to-teal-400 text-white text-sm font-medium shadow hover:opacity-95"
//               >
//                 <PlayCircle className="w-4 h-4" />
//                 Resume Course
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Units & Lessons */}
//         {units.map((unit) => {
//           const unitLessons = unit.lessons || unit.unit_lessons || [];
//           const completedLessons =
//             unit.completed_lessons ??
//             unit.completedLessons ??
//             unitLessons.filter((l) => l.status === "completed" || l.is_completed)
//               .length;
//           const totalUnitLessons =
//             unit.total_lessons ?? unit.totalLessons ?? unitLessons.length;

//           return (
//             <section
//               key={unit.id}
//               className="bg-white rounded-2xl shadow-md border border-gray-100 mb-6 md:mb-8 overflow-hidden"
//             >
//               {/* Unit Header */}
//               <div className="px-5 py-4 md:px-6 md:py-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
//                 <div>
//                   <div className="flex items-center gap-2 mb-1">
//                     <span className="w-2 h-2 rounded-full bg-blue-500" />
//                     <h2 className="text-lg md:text-xl font-semibold text-gray-900">
//                       {unit.title || unit.name}
//                     </h2>
//                   </div>
//                   {unit.description && (
//                     <p className="text-sm text-gray-600 max-w-2xl">
//                       {unit.description}
//                     </p>
//                   )}
//                 </div>
//                 <p className="text-xs md:text-sm font-medium text-gray-500">
//                   {completedLessons}/{totalUnitLessons} lessons
//                 </p>
//               </div>

//               {/* Lessons Grid */}
//               <div className="px-5 py-4 md:px-6 md:py-5 grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {unitLessons.map((lesson) => {
//                   const status = getLessonStatus(lesson);

//                   const score =
//                     lesson.score ??
//                     lesson.progress_score ??
//                     (status === "completed" ? 100 : null);
//                   const xp = lesson.xp ?? lesson.xp_reward ?? 0;
//                   const estimatedTime =
//                     lesson.estimated_time || lesson.duration || "30 min";

//                   const isCompleted = status === "completed";
//                   const isActive = status === "active";
//                   const isLocked = status === "locked";

//                   return (
//                     <div
//                       key={lesson.id}
//                       className={`rounded-2xl border text-sm md:text-[15px] transition-shadow shadow-sm ${
//                         isCompleted
//                           ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-100"
//                           : isActive
//                           ? "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100"
//                           : "bg-gray-50 border-gray-100 opacity-90"
//                       }`}
//                     >
//                       <div className="p-4 flex flex-col h-full">
//                         <div className="flex justify-between items-start gap-3 mb-2">
//                           <h3 className="font-semibold text-gray-900">
//                             {lesson.title}
//                           </h3>
//                           <LessonStatusBadge status={status} />
//                         </div>

//                         {lesson.description && (
//                           <p className="text-xs md:text-sm text-gray-600 mb-3">
//                             {lesson.description}
//                           </p>
//                         )}

//                         <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 mb-3">
//                           <span className="inline-flex items-center gap-1">
//                             <Clock className="w-3.5 h-3.5" />
//                             {estimatedTime}
//                           </span>
//                           <span className="inline-flex items-center gap-1">
//                             <Award className="w-3.5 h-3.5 text-orange-500" />
//                             {xp} XP
//                           </span>
//                           {isCompleted && score != null && (
//                             <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/70 border border-green-100 text-green-700 font-semibold">
//                               Score: {score}%
//                             </span>
//                           )}
//                         </div>

//                         {isCompleted && (
//                           <button
//                             type="button"
//                             onClick={() =>
//                               navigate(
//                                 `/lesson/${courseId}/${unit.id}/${lesson.id}`
//                               )
//                             }
//                             className="mt-auto inline-flex items-center justify-center px-3 py-2 rounded-full text-xs font-semibold bg-white text-green-700 border border-green-200 hover:bg-green-50"
//                           >
//                             Review Lesson
//                           </button>
//                         )}

//                         {isActive && (
//                           <button
//                             type="button"
//                             onClick={() =>
//                               navigate(
//                                 `/lesson/${courseId}/${unit.id}/${lesson.id}`
//                               )
//                             }
//                             className="mt-auto inline-flex items-center justify-center px-3 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:opacity-95 shadow"
//                           >
//                             Start Lesson →
//                           </button>
//                         )}

//                         {isLocked && (
//                           <div className="mt-auto inline-flex items-center gap-1 text-[11px] text-gray-500">
//                             <Lock className="w-3 h-3" />
//                             Complete previous lessons to unlock.
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </section>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default CoursePage;


import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Flame,
  BookOpen,
  Award,
  Target,
  CheckCircle2,
  Lock,
  Clock,
  PlayCircle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchCourseDetails } from "../../api/courses";

// Stat Card Component
const StatCard = ({ icon: Icon, label, value }) => (
  <div className="flex flex-col rounded-2xl bg-white border border-gray-100 shadow-sm px-5 py-4">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md bg-gradient-to-r from-orange-400 to-teal-400">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {label}
        </span>
        <span className="text-lg font-semibold text-gray-900">{value}</span>
      </div>
    </div>
  </div>
);

// Lesson Status Badge
const LessonStatusBadge = ({ status }) => {
  if (status === "completed") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold border border-green-100">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Completed
      </span>
    );
  }
  if (status === "active") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
        <Target className="w-3.5 h-3.5" />
        In Progress
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-50 text-gray-500 text-xs font-semibold border border-gray-100">
      <Lock className="w-3.5 h-3.5" />
      Locked
    </span>
  );
};

const getLessonStatus = (lesson) => {
  // Progress object as sent by the course API
  const progress =
    lesson.progress ||
    lesson.lesson_progress ||
    lesson.lessonProgress ||
    lesson.user_progress ||
    null;

  // Backend-enhanced course data attaches these flags directly on lessons
  const isCompleted =
    lesson.isCompleted ||
    lesson.is_completed ||
    progress?.is_completed;

  // Treat a lesson as locked if it is explicitly locked OR not unlocked
  const isLocked =
    lesson.isUnlocked === false ||
    lesson.is_locked ||
    progress?.is_locked;
  const rawStatus = lesson.status || progress?.status;

  // ✅ COMPLETED always wins
  if (isCompleted) return "completed";

  // ✅ Locked next
  if (isLocked) return "locked";

  // ✅ Normalize status strings if backend uses them
  if (rawStatus === "completed" || rawStatus === "done") return "completed";
  if (rawStatus === "locked") return "locked";
  if (rawStatus === "in_progress" || rawStatus === "active") return "active";

  // Default
  return "active";
};



// Derive a safe status for lessons when the backend does not explicitly lock later ones.
// This ensures learners cannot start lesson 2 before completing lesson 1, etc.
const deriveLessonStatus = (lesson, index, lessons) => {
  const baseStatus = getLessonStatus(lesson);

  // If the computed status (from lesson or progress) is already
  // completed or locked, always respect that and do NOT override.
  if (baseStatus === "completed" || baseStatus === "locked") {
    return baseStatus;
  }

  // If the backend already provided an explicit status flag on the lesson,
  // respect it as-is (even if it was 'active').
  if (lesson.status || lesson.is_locked || lesson.is_completed) {
    return baseStatus;
  }

  // First lesson is always available/active.
  if (index === 0) {
    return "active";
  }

  const prev = lessons[index - 1];
  const prevStatus = getLessonStatus(prev);

  // If previous lesson is not completed, lock this one.
  if (prevStatus !== "completed") {
    return "locked";
  }

  return "active";
};

const CoursePage = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();

  // Normalize courseId to a number so it matches the query keys
  // used by mutations (e.g. completeLesson) when invalidating.
  const numericCourseId = Number(courseId);

  const { data, isLoading, error } = useQuery({
    queryKey: ["course", numericCourseId],
    queryFn: () => fetchCourseDetails(numericCourseId),
    enabled: !!numericCourseId,
  });

  const payload = data?.data || data || {};
  const course = payload.course || payload;
  const stats = payload.stats || {};

  const units = course.units || course.course_units || [];

  const flatLessons = [];
  units.forEach((unit) => {
    const lessonList = unit.lessons || unit.unit_lessons || [];
    const unitIdForRoute = unit.id ?? unit.unit_id ?? unit.unitId;
    lessonList.forEach((lesson) => {
      const lessonIdForRoute =
        lesson.id ?? lesson.lesson_id ?? lesson.lessonId;
      const status = getLessonStatus(lesson);
      flatLessons.push({
        unitId: unitIdForRoute,
        lesson: {
          ...lesson,
          _routeUnitId: unitIdForRoute,
          _routeLessonId: lessonIdForRoute,
        },
        status,
      });
    });
  });

  // Live totals based on current lesson progress
  const totalLessons = flatLessons.length;

  const lessonsCompleted = flatLessons.filter(
    (l) => l.status === "completed"
  ).length;

  const unitsCompleted = units.filter((unit) => {
    const list = unit.lessons || unit.unit_lessons || [];
    if (!list.length) return false;
    return list.every((lesson) => getLessonStatus(lesson) === "completed");
  }).length;

  const totalXP = flatLessons.reduce(
    (sum, l) => sum + (l.lesson.xpEarned ?? 0),
    0
  );

  // Streak still comes from stats (backend-managed)
  const streakDays =
    stats.current_streak ??
    course.streak ??
    0;

  const language =
    course.language ||
    course.target_language ||
    "Language";

  const title =
    course.title ||
    `${language} Learning Journey`;

  const progressPercent = totalLessons
    ? (lessonsCompleted / totalLessons) * 100
    : 0;

  const resumeLesson =
    flatLessons.find((l) => l.status === "active") ||
    flatLessons.find((l) => l.status !== "completed" && l.status !== "locked") ||
    flatLessons.find((l) => l.status === "completed");

  // Determine the "current" unit the learner is studying:
  // prefer the unit of the resumeLesson, otherwise fall back to the first unit.
  const currentUnitId =
    resumeLesson?.lesson._routeUnitId ??
    resumeLesson?.unitId ??
    (units[0]
      ? units[0].id ?? units[0].unit_id ?? units[0].unitId
      : null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-50 flex items-center justify-center">
        <div className="animate-spin h-14 w-14 rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        Failed to load course.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-50">
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Back */}
        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 mb-6 rounded-full bg-gradient-to-r from-orange-400 to-teal-400 text-white flex items-center gap-2 text-sm font-medium shadow hover:opacity-90"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        {/* Title */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard icon={BookOpen} label="Language" value={language} />
          <StatCard icon={BookOpen} label="Lessons" value={totalLessons} />
          <StatCard icon={Award} label="Total XP" value={totalXP} />
          <StatCard icon={Flame} label="Streak" value={`${streakDays} days`} />
        </div>

        {/* Progress */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow px-6 py-5 mb-8">
          <div className="flex justify-between mb-3">
            <div>
              <p className="font-semibold text-gray-900">Course Progress</p>
              <p className="text-sm text-gray-500">
                {lessonsCompleted} lessons • {unitsCompleted} units
              </p>
            </div>
            <p className="font-semibold text-gray-700">
              {progressPercent.toFixed(1)}%
            </p>
          </div>

          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="h-2.5 bg-gradient-to-r from-orange-400 to-teal-400"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {resumeLesson && (
            <div className="flex justify-end mt-4">
              <button
                onClick={() =>
                  navigate(
                    `/lesson/${courseId}/${
                      resumeLesson.lesson._routeUnitId ?? resumeLesson.unitId
                    }/${
                      resumeLesson.lesson._routeLessonId ??
                      resumeLesson.lesson.id
                    }`
                  )
                }
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-400 to-teal-400 text-white shadow hover:opacity-90"
              >
                <PlayCircle className="w-4 h-4" />
                Resume Course
              </button>
            </div>
          )}
        </div>

        {/* Units */}
        {units.map((unit, unitIndex) => {
          const lessonList = unit.lessons || unit.unit_lessons || [];

          const unitIdForRoute = unit.id ?? unit.unit_id ?? unit.unitId;
          const isCurrentUnit =
            currentUnitId != null && unitIdForRoute === currentUnitId;

          // All non-current units are slightly blurred/faded but remain visible
          const unitContainerClasses = `bg-white rounded-2xl shadow border border-gray-100 mb-10 ${
            isCurrentUnit ? "" : "opacity-70 blur-[1px]"
          }`;

          return (
            <section
              key={unit.id}
              className={unitContainerClasses}
            >
              <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full" />
                    <h2 className="text-xl font-semibold text-gray-900">
                      {unit.title}
                    </h2>
                  </div>
                  {unit.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {unit.description}
                    </p>
                  )}
                </div>
                <p className="text-xs text-gray-600">
                  {
                    lessonList.filter(
                      (l) => getLessonStatus(l) === "completed"
                    ).length
                  }
                  /{lessonList.length} lessons
                </p>
              </div>

              <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                {lessonList.map((lesson, index) => {
                  const baseStatus = deriveLessonStatus(lesson, index, lessonList);
                  const status = baseStatus;

                  // Prefer live XP earned from backend progress when available,
                  // otherwise fall back to the static XP reward defined on the lesson.
                  const xpEarned = lesson.xpEarned ?? null;
                  const xpReward = lesson.xp_reward ?? lesson.xp ?? 0;
                  const xp = xpEarned != null ? xpEarned : xpReward;

                  const lessonIdForRoute =
                    lesson.id ?? lesson.lesson_id ?? lesson.lessonId;

                  const nextLesson = lessonList[index + 1];
                  let nextLessonPath = null;
                  if (nextLesson) {
                    const nextLessonIdForRoute =
                      nextLesson.id ?? nextLesson.lesson_id ?? nextLesson.lessonId;
                    nextLessonPath = `/lesson/${courseId}/${unitIdForRoute}/${nextLessonIdForRoute}`;
                  }

                  return (
                    <div
                      key={lesson.id}
                      className={`rounded-2xl border shadow-sm p-4 flex flex-col transition-all ${
                        status === "completed"
                          ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
                          : status === "active"
                          ? "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200"
                          : "bg-gray-50 border-gray-200"
                      } ${
                        // Only lessons in the current unit are fully sharp; all others are slightly blurred
                        isCurrentUnit ? "" : "opacity-70 blur-[1px]"
                      }`}
                    >
                      <div className="flex justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {lesson.title}
                        </h3>
                        <LessonStatusBadge status={status} />
                      </div>

                      <p className="text-sm text-gray-600 mb-3">
                        {lesson.description}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-gray-600 mb-4">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-4 h-4" />{" "}
                          {lesson.duration || "30 min"}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Award className="w-4 h-4 text-indigo-600" />
                          {xp} XP
                        </span>
                      </div>

                      {/* Buttons */}
                      {status === "completed" && (
                        <button
                          className="mt-auto px-4 py-2 rounded-full bg-white text-green-700 border border-green-300 shadow-sm hover:bg-green-50"
                          onClick={() =>
                            navigate(
                              `/lesson/${courseId}/${unitIdForRoute}/${lessonIdForRoute}`,
                              {
                                state: {
                                  lesson,
                                  // if backend includes progress on lesson, pass it through
                                  progress:
                                    lesson.progress ||
                                    lesson.lesson_progress ||
                                    null,
                                  nextLessonPath,
                                },
                              }
                            )
                          }
                        >
                          Review Lesson
                        </button>
                      )}

                      {status === "active" && (
                        <button
                          className="mt-auto px-4 py-2 rounded-full bg-gradient-to-r from-orange-400 to-teal-400 text-white shadow hover:opacity-90"
                          onClick={() =>
                            navigate(
                              `/lesson/${courseId}/${unitIdForRoute}/${lessonIdForRoute}`,
                              {
                                state: {
                                  lesson,
                                  progress:
                                    lesson.progress ||
                                    lesson.lesson_progress ||
                                    null,
                                  nextLessonPath,
                                },
                              }
                            )
                          }
                        >
                          Start Lesson →
                        </button>
                      )}

                      {status === "locked" && (
                        <p className="text-xs text-gray-500 mt-auto">
                          Complete previous lessons to unlock.
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default CoursePage;
