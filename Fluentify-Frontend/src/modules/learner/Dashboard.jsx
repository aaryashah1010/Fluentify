import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  BarChart3,
  Trophy,
  User,
  Home,
  LogOut,
  Settings,
  ChevronDown,
  Mic,
  Menu,
  Plus,
  Rocket,
  Phone,
  MessageSquare,
  TrendingUp,
  Target,
  Sparkles,
  Flame,
  Globe,
  X,
  Brain,
  Bot,
  ChevronRight,
  Zap,
} from "lucide-react";

import { useLogout, useUserProfile } from "../../hooks/useAuth";
import { useCourses } from "../../hooks/useCourses";
import { useStreaming } from "../../contexts/StreamingContext";
import { useProgressReport } from "../../hooks/useProgress";
import { VoiceAIModal, FloatingChatWidget } from "../../components";
import fluentifyLogo from "../../assets/fluentify_logo.jpg";
import CourseGenerationForm from "./components/CourseGenerationForm";
import Sidebar from "./components/sidebar";
import GeneratingCourseCard from "./components/GeneratingCourseCard";
import CourseCard from "./components/CourseCard";

const LANGUAGE_FLAGS = {
  spanish: "🇪🇸",
  french: "🇫🇷",
  german: "🇩🇪",
  japanese: "🇯🇵",
  hindi: "🇮🇳",
  italian: "🇮🇹",
  english: "🇬🇧",
};

const getLanguageFlag = (language) => {
  if (!language || typeof language !== "string") return "🌐";
  const key = language.toLowerCase();
  return LANGUAGE_FLAGS[key] || "🌐";
};

const Header = ({ onMenuClick, onLogoClick, streakDays, onSettingsClick }) => {
  return (
    <header className="bg-gradient-to-r from-slate-950/95 via-slate-900/90 to-slate-950/95 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40 shadow-lg">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3 sm:gap-4 text-slate-50">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-gray-100/10 rounded-lg transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6 text-slate-200" />
          </button>

          <button
            onClick={onLogoClick}
            className="flex items-center gap-4 hover:opacity-80 transition-opacity"
          >
            <img
              src={fluentifyLogo}
              alt="Fluentify Logo"
              className="h-16 w-auto rounded-xl shadow-md bg-white/90"
            />
          </button>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="bg-white/5 px-4 py-2 rounded-xl flex items-center gap-2 border border-white/15 shadow-sm">
            <Flame className="w-5 h-5 text-orange-300" />
            <div>
              <p className="text-xs text-slate-200">Streak</p>
              <p className="text-orange-200 font-bold">
                {streakDays} {streakDays === 1 ? 'day' : 'days'}
              </p>
            </div>
          </div>

          <button
            onClick={onSettingsClick}
            className="p-2 hover:bg-gray-100/10 rounded-lg transition-colors"
            aria-label="Open settings"
          >
            <Settings className="w-6 h-6 text-slate-200" />
          </button>
        </div>
      </div>
    </header>
  );
};

const LearnerDashboard = () => {
  const navigate = useNavigate();
  const logout = useLogout();
  
  const { data: courses = [] } = useCourses();
  const { generateCourse: startStreamGeneration, state: streamState } = useStreaming();
  const { data: profileData, isLoading } = useUserProfile();
  const { data: progressData } = useProgressReport("all");

  const user = profileData?.data?.user || profileData?.user || profileData?.data || profileData || {};
  const rawUserName = user?.name || user?.fullName || "Learner";
  const userName = typeof rawUserName === "string" ? rawUserName : String(rawUserName || "Learner");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [showVoiceAiModal, setShowVoiceAiModal] = useState(false);
  const [showGenerateForm, setShowGenerateForm] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [pendingGeneratedCourse, setPendingGeneratedCourse] = useState(false);
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [formError, setFormError] = useState("");

  const [form, setForm] = useState({
    language: "",
    expectedDuration: "",
    expertise: "",
  });
  
  const totalLessonsCompleted = courses.reduce(
    (acc, course) => acc + (course.progress?.lessonsCompleted || 0),
    0
  );
  const totalLessonsAvailable = courses.reduce(
    (acc, course) => acc + (course.totalLessons || 0),
    0
  );
  const totalCourses = courses.length;
  const maxStreak = courses.reduce(
    (max, course) => Math.max(max, course.progress?.currentStreak || 0),
    0
  );
  
  const completedLanguageSet = new Set(
    courses
      .filter((course) => (course.progress?.progressPercentage || 0) >= 100)
      .map((course) => course.language)
  );
  const hasPolyglotAchievement = completedLanguageSet.size >= 3;
  const progressSummary = progressData?.summary || {};
  const lessonsCompletedOverall =
    typeof progressSummary.lessons_completed === "number"
      ? progressSummary.lessons_completed
      : totalLessonsCompleted;
  const totalXPOverall = progressSummary.total_xp || 0;

  const effectiveStreakDays = Math.max(1,
    typeof progressSummary.current_streak === "number"
      ? progressSummary.current_streak
      : maxStreak
  );

  let overallProgressPercent = 0;
  if (totalLessonsAvailable > 0) {
    overallProgressPercent = Math.round(
      (lessonsCompletedOverall / totalLessonsAvailable) * 100
    );
  }

  overallProgressPercent = Math.min(100, Math.max(0, overallProgressPercent));

  useEffect(() => {
    if (pendingGeneratedCourse && streamState.isComplete) {
      setPendingGeneratedCourse(false);
    }
  }, [pendingGeneratedCourse, streamState.isComplete]);

  const handleGenerateCourse = async () => {
    if (!form.language || !form.expectedDuration || !form.expertise) {
      setFormError("Please fill all fields.");
      return;
    }
    setFormError("");
    setGenerating(true);
    try {
      startStreamGeneration({
        language: form.language,
        expectedDuration: form.expectedDuration,
        expertise: form.expertise,
      });
      setPendingGeneratedCourse(true);
      setShowGenerateForm(false);
    } finally {
      setGenerating(false);
    }
  };

  const hasCourses = courses.length > 0;
  const visibleCourses = hasCourses
    ? showAllCourses
      ? courses
      : courses.slice(0, 3)
    : [];
  const canToggleCourseView = courses.length > 3;
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-900 via-orange-900 to-teal-900 flex items-center justify-center">
        <div className="relative w-16 h-16 animate-spin">
          <div className="w-full h-full border-4 border-orange-200 border-t-teal-500 rounded-full"></div>
          <Sparkles className="w-6 h-6 text-teal-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-orange-900 to-slate-950 relative overflow-x-hidden">
      
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-20 right-20 text-7xl opacity-20 animate-bounce" style={{ animationDuration: '3s' }}>📚</div>
        <div className="absolute top-40 left-20 text-6xl opacity-20 animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }}>🌍</div>
        <div className="absolute bottom-40 right-40 text-7xl opacity-20 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '1s' }}>✨</div>
        <div className="absolute top-1/2 left-1/3 text-6xl opacity-10 animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '1.5s' }}>🎓</div>
      </div>

      <Header
        onMenuClick={() => setSidebarOpen(true)}
        onLogoClick={() => navigate("/dashboard")}
        streakDays={effectiveStreakDays}
        onSettingsClick={() => setShowSettingsPanel((prev) => !prev)}
      />

      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 shadow-2xl animate-in slide-in-from-left">
            <Sidebar />
          </div>
        </>
      )}

      {showSettingsPanel && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setShowSettingsPanel(false)}
          />
          <div className="fixed top-20 right-4 z-50 w-56 bg-slate-950/95 border border-white/15 rounded-2xl shadow-2xl p-4 space-y-3 min-h-[150px]">
            <button
              type="button"
              onClick={() => {
                setShowSettingsPanel(false);
                navigate('/profile');
              }}
              className="w-full px-3 py-2 rounded-xl text-sm text-slate-50 bg-slate-800/80 hover:bg-slate-700 flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setShowSettingsPanel(false);
                logout();
              }}
              className="w-full px-3 py-2 rounded-xl text-sm text-red-100 bg-red-600/80 hover:bg-red-700 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 relative z-10">

        <div className="mb-10">
          <h1 className="text-3xl md:text-5xl font-bold text-slate-50 drop-shadow-md mb-2">
            Welcome, {userName.split(' ')[0]}! 👋
          </h1>
        </div>

        {showGenerateForm && (
            <div className="mb-12 animate-in fade-in slide-in-from-top-4">
                <div className="bg-slate-950/90 rounded-3xl p-1 shadow-2xl border border-white/10">
                    <div className="bg-slate-950/95 rounded-[20px] p-6 md:p-8 border border-white/10">
                        <div className="flex justify-between items-center mb-6">
                             <h3 className="text-xl font-bold text-slate-50 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-orange-500" />
                                Generate New Course
                             </h3>
                             <button
                               onClick={() => setShowGenerateForm(false)}
                               className="p-2 hover:bg-white/10 rounded-full text-slate-300 transition-colors"
                             >
                               <X className="w-5 h-5" />
                             </button>
                        </div>
                        <CourseGenerationForm
                            form={form}
                            setForm={setForm}
                            onGenerate={handleGenerateCourse}
                            onCancel={() => setShowGenerateForm(false)}
                            isGenerating={generating}
                            error={formError}
                        />
                    </div>
                </div>
            </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

          <div className="space-y-6 md:col-span-3">
            <div 
              onClick={() => navigate('/progress')}
              className="relative overflow-hidden rounded-3xl border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer bg-slate-900/85 h-[360px] lg:h-[460px]"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-orange-500/20 rounded-full blur-3xl" />
              
              <div className="relative p-6 flex flex-col h-full">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-6 w-6 text-orange-300" />
                  <h2 className="text-2xl text-slate-50 font-bold">My Progress</h2>
                </div>

                <p className="text-slate-300 text-sm mb-6">
                  See your learning milestones and skill breakdown.
                </p>

                <div className="flex items-center justify-center mb-6">
                  <div className="relative">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="#1f2937"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="url(#progressGradient)"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        style={{
                          strokeDasharray: `${(overallProgressPercent / 100) * 352} 352`,
                          transition: 'stroke-dasharray 1.5s ease-out',
                        }}
                      />
                      <defs>
                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#a855f7" />
                          <stop offset="50%" stopColor="#ec4899" />
                          <stop offset="100%" stopColor="#f97316" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-3xl text-slate-50 font-bold">{overallProgressPercent}%</div>
                      <div className="text-xs text-slate-300">Complete</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6 font-medium text-center">
                    <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-700 shadow-sm">
                      <div className="text-2xl text-orange-300">{totalXPOverall}</div>
                      <div className="text-xs text-slate-200">Total XP</div>
                    </div>
                    <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-700 shadow-sm">
                      <div className="text-2xl text-purple-300">{lessonsCompletedOverall}</div>
                      <div className="text-xs text-slate-200">Lessons</div>
                    </div>
                </div>

                <div className="mt-auto">
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate('/progress'); }}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white px-4 py-3 rounded-xl shadow-lg font-medium flex items-center justify-center group"
                  >
                    View Full Report
                    <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 md:col-span-1">
            <div
              className="w-full h-full text-left rounded-3xl border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 group hover:scale-[1.005] cursor-pointer bg-slate-900/85 h-[360px] lg:h-[460px]"
              onClick={() => setShowVoiceAiModal(true)}
            >
              <div className="relative overflow-hidden p-6 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-2 bg-purple-500/20 rounded-lg">
                                    <Bot className="h-6 w-6 text-purple-200" />
                                </div>
                                <h3 className="text-2xl text-slate-50 font-bold">Talk with AI</h3>
                            </div>
                            <p className="text-slate-300 text-sm mb-4">
                                Practice live with AI, ask quick questions, and build speaking confidence.
                            </p>
                            <div className="grid grid-cols-1 gap-2 text-xs text-slate-300">
                              <div className="flex items-center gap-2">
                                <Sparkles className="w-3 h-3 text-teal-300" />
                                <span>Clarify grammar instantly.</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Sparkles className="w-3 h-3 text-orange-300" />
                                <span>Check understanding.</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Sparkles className="w-3 h-3 text-emerald-300" />
                                <span>Real‑life speaking drills.</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Sparkles className="w-3 h-3 text-purple-300" />
                                <span>Interview warm-ups.</span>
                              </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setShowVoiceAiModal(true); }}
                          className="w-full bg-gradient-to-r from-teal-500 to-orange-500 text-white hover:from-teal-600 hover:to-orange-600 px-4 py-3 rounded-xl flex items-center justify-center shadow-lg font-medium"
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Start Voice Call
                        </button>
                    </div>
                </div>
            </div>
          </div>
        </div>
       

        <section className="mt-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
            <h2 className="text-slate-50 font-bold text-xl flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-300" />
              Your Courses
            </h2>
            <button
              type="button"
              onClick={() => setShowGenerateForm(true)}
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-orange-500 text-white text-sm font-medium shadow-md hover:shadow-lg hover:from-teal-600 hover:to-orange-600"
            >
              <Plus className="w-4 h-4" />
              Create new course
            </button>
          </div>

          {courses.length === 0 && !pendingGeneratedCourse ? (
            <div className="p-6 text-center bg-slate-900/80 rounded-2xl border border-dashed border-slate-600">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-200 text-sm mb-4">
                No active courses yet. Create your first AI-powered course to begin.
              </p>
              <button
                type="button"
                onClick={() => setShowGenerateForm(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-orange-500 text-white text-sm font-medium shadow-md hover:shadow-lg hover:from-teal-600 hover:to-orange-600"
              >
                <Plus className="w-4 h-4" />
                Create course
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {pendingGeneratedCourse && streamState && streamState.units && (
                  <GeneratingCourseCard
                    state={streamState}
                    onClick={() => {
                      if (streamState.courseId) {
                        navigate(`/course/${streamState.courseId}`);
                      }
                    }}
                  />
                )}
                {visibleCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onClick={(selectedCourse) => navigate(`/course/${selectedCourse.id}`)}
                  />
                ))}
              </div>

              {canToggleCourseView && (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => setShowAllCourses((prev) => !prev)}
                    className="text-xs sm:text-sm font-medium text-teal-200 hover:text-orange-200 underline-offset-2 hover:underline"
                  >
                    {showAllCourses
                      ? "Show fewer courses"
                      : `View all courses (${courses.length})`}
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      <FloatingChatWidget position="right" />
      
      <VoiceAIModal
        isOpen={showVoiceAiModal}
        onClose={() => setShowVoiceAiModal(false)}
      />

    </div>
  );
};

export default LearnerDashboard;
