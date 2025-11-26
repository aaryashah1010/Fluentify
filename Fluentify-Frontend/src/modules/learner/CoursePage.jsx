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
  Play,
  Check,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchCourseDetails } from "../../api/courses";

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="relative rounded-2xl p-6 bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200 shadow-lg overflow-hidden">
    <div className="absolute top-4 right-4 text-2xl opacity-20">📘</div>
    <div className="flex items-center gap-3 mb-3">
      <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 shadow-md rounded-xl flex items-center justify-center">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-xs text-gray-600">{label}</p>
        <p className="text-xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

const LessonStatusBadge = ({ status }) => {
  if (status === "completed") {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-xl border border-green-200">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Completed
      </span>
    );
  }

  if (status === "active") {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-700 text-xs font-semibold rounded-xl border border-orange-200">
        <Target className="w-3.5 h-3.5" />
        In Progress
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-500 text-xs font-semibold rounded-xl border border-gray-200">
      <Lock className="w-3.5 h-3.5" />
      Locked
    </span>
  );
};

const getLessonStatus = (lesson) => {
  const progress =
    lesson.progress ||
    lesson.lesson_progress ||
    lesson.lessonProgress ||
    lesson.user_progress ||
    null;

  const isCompleted =
    lesson.isCompleted ||
    lesson.is_completed ||
    progress?.is_completed;

  const isLocked =
    lesson.isUnlocked === false ||
    lesson.is_locked ||
    progress?.is_locked;

  const rawStatus = lesson.status || progress?.status;

  if (isCompleted) return "completed";
  if (isLocked) return "locked";
  if (rawStatus === "completed") return "completed";
  if (rawStatus === "locked") return "locked";
  if (rawStatus === "in_progress" || rawStatus === "active") return "active";

  return "active";
};

const deriveLessonStatus = (lesson, index, list) => {
  const base = getLessonStatus(lesson);

  if (base === "completed" || base === "locked") return base;

  if (index === 0) return "active";

  const prev = list[index - 1];
  const prevStatus = getLessonStatus(prev);

  if (prevStatus !== "completed") return "locked";

  return "active";
};

const CoursePage = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
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
    const lessons = unit.lessons || unit.unit_lessons || [];
    const unitId = unit.id ?? unit.unit_id ?? unit.unitId;
    lessons.forEach((lesson) => {
      const lessonId = lesson.id ?? lesson.lesson_id ?? lesson.lessonId;
      flatLessons.push({
        unitId,
        lesson: { ...lesson, _routeUnitId: unitId, _routeLessonId: lessonId },
        status: getLessonStatus(lesson),
      });
    });
  });

  const totalLessons = flatLessons.length;
  const lessonsCompleted = flatLessons.filter((l) => l.status === "completed").length;
  const unitsCompleted = units.filter((u) => {
    const list = u.lessons || u.unit_lessons || [];
    if (!list.length) return false;
    return list.every((l) => getLessonStatus(l) === "completed");
  }).length;

  const totalXP = flatLessons.reduce(
    (sum, l) => sum + (l.lesson.xpEarned ?? l.lesson.xp_reward ?? l.lesson.xp ?? 0),
    0
  );

  const streakDays = stats.current_streak || course.streak || 0;

  const language = course.language || course.target_language || "Language";
  const title = course.title || `${language} Learning Journey`;

  const progressPercent = totalLessons
    ? (lessonsCompleted / totalLessons) * 100
    : 0;

  const resumeLesson =
    flatLessons.find((l) => l.status === "active") ||
    flatLessons.find((l) => l.status !== "completed" && l.status !== "locked") ||
    flatLessons[0];

  const currentUnitId = resumeLesson?.lesson._routeUnitId;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-900 via-orange-900 to-slate-950 flex items-center justify-center">
        <div className="animate-spin h-14 w-14 rounded-full border-4 border-cyan-200 border-t-cyan-500"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-red-800 to-slate-950">
        Failed to load course.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-orange-900 to-slate-950 relative overflow-hidden">

    
      <div className="absolute top-20 right-16 text-7xl opacity-30 animate-bounce pointer-events-none" style={{ animationDuration: "3s" }}>
        📘
      </div>

      <div className="absolute top-40 left-10 text-6xl opacity-25 animate-bounce pointer-events-none" style={{ animationDuration: "4s", animationDelay: "0.5s" }}>
        ✨
      </div>

      <div className="absolute bottom-32 right-32 text-7xl opacity-30 animate-bounce pointer-events-none" style={{ animationDuration: "3.5s", animationDelay: "1s" }}>
        🧠
      </div>

      <div className="absolute bottom-16 left-1/3 text-6xl opacity-20 animate-bounce pointer-events-none" style={{ animationDuration: "4s", animationDelay: "1.2s" }}>
        🏆
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-teal-600 hover:text-teal-800 mb-8 transition-all font-medium group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        <div className="bg-gradient-to-br from-slate-950 via-teal-900 to-orange-700 rounded-3xl p-6 sm:p-8 lg:p-10 mb-12 text-white shadow-2xl border border-white/10">

          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">

            {/* LEFT */}
            <div className="flex items-center gap-4 md:gap-6">
              <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-5xl shadow-lg">
                {course.flag || "🌍"}
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-2">{title}</h1>
                <p className="text-white/90 mb-3 text-lg">
                  {language} • {units.length} units
                </p>
                <p className="text-sm text-white/90">
                  {lessonsCompleted} / {totalLessons} lessons completed
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="mt-4 md:mt-0 text-left md:text-right">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-2">{progressPercent.toFixed(1)}%</div>
              <p className="text-white/80 text-sm">Complete</p>
            </div>
          </div>

          {/* PROGRESS BAR */}
          <div className="mt-6">
            <div className="h-3 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

  
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">

          <StatCard
            icon={BookOpen}
            label="Language"
            value={language}
          />

          <StatCard
            icon={BookOpen}
            label="Total Lessons"
            value={totalLessons}
          />

          <StatCard
            icon={Award}
            label="Total XP"
            value={totalXP}
          />

          <StatCard
            icon={Flame}
            label="Streak"
            value={`${streakDays} days`}
          />

        </div>

        <div className="bg-slate-950/90 backdrop-blur-sm rounded-3xl border border-white/15 shadow-2xl p-8 mb-8">

          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-50">Course Progress</h2>
              <p className="text-slate-300 text-sm mt-1">
                {lessonsCompleted} completed • {unitsCompleted} units finished
              </p>
            </div>

            <span className="text-3xl font-semibold text-teal-300">
              { progressPercent.toFixed(1)}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-gradient-to-r from-teal-400 to-orange-300 transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Resume Button */}
          {resumeLesson && (
            <div className="flex justify-end">
              <button
                onClick={() =>
                  navigate(
                    `/lesson/${courseId}/${resumeLesson.lesson._routeUnitId}/${resumeLesson.lesson._routeLessonId}`,
                    {
                      state: {
                        lesson: resumeLesson.lesson,
                        progress:
                          resumeLesson.lesson.progress ||
                          resumeLesson.lesson.lesson_progress ||
                          null,
                      },
                    }
                  )
                }
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-orange-400 text-white shadow-lg hover:opacity-95 hover:shadow-xl transition-transform hover:scale-[1.02]"
              >
                <PlayCircle className="w-5 h-5" />
                Resume Course
              </button>
            </div>
          )}

        </div>

        {/* Course Lessons header (like the mock) */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex items-center gap-2 text-gray-800">
            <BookOpen className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-semibold">Course Lessons</h2>
          </div>
          <p className="text-sm text-gray-500">
            {lessonsCompleted} / {totalLessons} lessons completed
          </p>
        </div>

        {/* UNITS SECTION — */}
        <div className="space-y-10">
          {units.map((unit, unitIndex) => {
            const lessonList = unit.lessons || unit.unit_lessons || [];
            const unitId = unit.id ?? unit.unit_id ?? unit.unitId;

            const isCurrentUnit = currentUnitId === unitId;

            const containerClasses = `
              bg-slate-950/90 
              backdrop-blur-sm 
              rounded-3xl 
              shadow-xl 
              border 
              transition-all 
              ${isCurrentUnit ? "border-teal-400" : "border-slate-700"}
            `;

            return (
              <section key={unitId} className={containerClasses}>

                {/* Unit Header */}
                <div className="px-4 sm:px-6 md:px-8 py-6 border-b border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2.5 h-2.5 bg-teal-500 rounded-full"></span>
                      <h2 className="text-2xl font-semibold text-slate-50">
                        {unit.title}
                      </h2>
                    </div>

                    {unit.description && (
                      <p className="text-sm text-slate-300">{unit.description}</p>
                    )}
                  </div>

                  <p className="text-sm text-slate-300">
                    {
                      lessonList.filter((l) => getLessonStatus(l) === "completed")
                        .length
                    }
                    /{lessonList.length} lessons
                  </p>
                </div>

                
                <div className="px-4 sm:px-6 md:px-8 py-6 md:py-8 grid grid-cols-1 gap-5">
                {lessonList.map((lesson, index) => {
                  const status = deriveLessonStatus(lesson, index, lessonList);

                  const lessonIdForRoute =
                    lesson.id ?? lesson.lesson_id ?? lesson.lessonId;

                  const xpEarned = lesson.xpEarned ?? null;
                  const xpReward = lesson.xp_reward ?? lesson.xp ?? 0;
                  const xp = xpEarned != null ? xpEarned : xpReward;

                  const lessonCardClasses = `
                    rounded-3xl 
                    p-6 
                    bg-slate-900/90
                    shadow-lg 
                    border 
                    transition-all 
                    flex flex-col 
                    hover:shadow-xl hover:-translate-y-0.5
                    ${
                      status === "completed"
                        ? "border-emerald-400 ring-1 ring-emerald-400/40"
                        : status === "active"
                        ? "border-teal-400 ring-1 ring-teal-400/40"
                        : "border-slate-700 opacity-60 cursor-not-allowed"
                    }
                  `;

                  return (
                    <div key={lessonIdForRoute} className={lessonCardClasses}>

                      {/* Title + Badge */}
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-slate-50">
                          {lesson.title}
                        </h3>
                        <LessonStatusBadge status={status} />
                      </div>

                      {/* Description */}
                      {lesson.description && (
                        <p className="text-sm text-slate-300 mb-4">
                          {lesson.description}
                        </p>
                      )}

                      {/* Time + XP */}
                      <div className="flex items-center gap-4 text-xs text-slate-300 mb-5">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {lesson.duration || "30 min"}
                        </span>

                        <span className="inline-flex items-center gap-1 text-amber-600">
                          <Award className="w-4 h-4" />
                          {xp} XP
                        </span>
                      </div>

                      {/* CTA Buttons */}
                      {status === "completed" && (
                        <button
                          onClick={() =>
                            navigate(
                              `/lesson/${courseId}/${unitId}/${lessonIdForRoute}`,
                              {
                                state: {
                                  lesson,
                                  progress:
                                    lesson.progress ||
                                    lesson.lesson_progress ||
                                    null,
                                },
                              }
                            )
                          }
                          className="mt-auto px-5 py-2.5 rounded-2xl bg-white text-green-700 border border-green-300 shadow hover:bg-green-50 transition-all"
                        >
                          Review Lesson
                        </button>
                      )}

                      {status === "active" && (
                        <button
                          onClick={() =>
                            navigate(
                              `/lesson/${courseId}/${unitId}/${lessonIdForRoute}`,
                              {
                                state: {
                                  lesson,
                                  progress:
                                    lesson.progress ||
                                    lesson.lesson_progress ||
                                    null,
                                },
                              }
                            )
                          }
                          className="mt-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-teal-500 to-orange-400 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                        >
                          Start Lesson →
                        </button>
                      )}

                      {status === "locked" && (
                        <p className="text-xs text-gray-600 mt-auto italic">
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
    </div>
  );
};

export default CoursePage;
