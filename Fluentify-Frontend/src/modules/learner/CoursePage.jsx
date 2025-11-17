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

  if (rawStatus === "completed" || rawStatus === "done") return "completed";
  if (rawStatus === "locked") return "locked";
  if (rawStatus === "in_progress" || rawStatus === "active") return "active";

  // Default
  return "active";
};


const deriveLessonStatus = (lesson, index, lessons) => {
  const baseStatus = getLessonStatus(lesson);

  if (baseStatus === "completed" || baseStatus === "locked") {
    return baseStatus;
  }

  if (lesson.status || lesson.is_locked || lesson.is_completed) {
    return baseStatus;
  }

  if (index === 0) {
    return "active";
  }

  const prev = lessons[index - 1];
  const prevStatus = getLessonStatus(prev);

  if (prevStatus !== "completed") {
    return "locked";
  }

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
