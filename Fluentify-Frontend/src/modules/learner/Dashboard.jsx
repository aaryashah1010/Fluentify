import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  BarChart3,
  Trophy,
  User,
  Home,
  LogOut,
  ChevronDown,
  Mic,
} from "lucide-react";

import { useLogout, useUserProfile } from "../../hooks/useAuth";
import { useCourses } from "../../hooks/useCourses";
import { useStreaming } from "../../contexts/StreamingContext";
import { VoiceAIModal, FloatingChatWidget } from "../../components";
import fluentifyLogo from "../../assets/fluentify_logo.jpg";
import CourseGenerationForm from "./components/CourseGenerationForm";

const LearnerDashboard = () => {
  const navigate = useNavigate();
  const logout = useLogout();

  // Existing generated AI courses for this learner
  const { data: courses = [] } = useCourses();

  // Streaming AI course generation state
  const { generateCourse: startStreamGeneration, state: streamState } = useStreaming();

  const { data: profileData, isLoading } = useUserProfile();
  const user = profileData?.data?.user || profileData?.user || profileData?.data || profileData || {};
  const userName = user?.name || user?.fullName || "Learner";

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [showVoiceAiModal, setShowVoiceAiModal] = useState(false);
  const [showGenerateForm, setShowGenerateForm] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [pendingGeneratedCourse, setPendingGeneratedCourse] = useState(false);
  const [formError, setFormError] = useState("");

  const [form, setForm] = useState({
    language: "",
    expectedDuration: "",
    expertise: "",
  });

  // When we just requested generation and the backend reports a new courseId via SSE,
  // automatically take the learner to that AI-generated course page.
  useEffect(() => {
    if (pendingGeneratedCourse && streamState.courseId) {
      setPendingGeneratedCourse(false);
      navigate(`/course/${streamState.courseId}`);
    }
  }, [pendingGeneratedCourse, streamState.courseId, navigate]);

  const handleGenerateCourse = async () => {
    if (!form.language || !form.expectedDuration || !form.expertise) {
      setFormError("Please fill all fields.");
      return;
    }

    setFormError("");
    setGenerating(true);

    try {
      // Start AI course generation via SSE
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

  const handleStartCourseClick = () => {
    // If an AI-generated course is currently tracked by the streaming state, go there
    if (streamState.courseId) {
      navigate(`/course/${streamState.courseId}`);
      return;
    }

    // Otherwise, if there are existing generated courses, open the latest/first
    if (courses.length > 0) {
      const firstCourse = courses[0];
      navigate(`/course/${firstCourse.id}`);
      return;
    }

    // No course yet – ask the learner to configure and generate one
    setShowGenerateForm(true);
  };

  const hasCourses = courses.length > 0;
  const primaryCourse = hasCourses ? courses[0] : null;
  const primaryProgress = primaryCourse?.progress || {};
  const progressPercentage = primaryProgress.progressPercentage || 0;
  const unitsCompleted = primaryProgress.unitsCompleted || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50">
      
      {/* ================= HEADER ================= */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          {/* Large Fluentify Logo */}
          <img
            src={fluentifyLogo}
            alt="Fluentify"
            className="h-20 w-auto cursor-pointer"
            onClick={() => navigate("/dashboard")}
          />


          {/* Right Controls */}
          <div className="flex items-center gap-3">

            <button
              onClick={() => navigate("/learner/modules")}
              className="px-4 py-2 bg-white border rounded-full flex items-center gap-2 text-sm hover:shadow-md"
            >
              <BookOpen className="w-4 h-4" />
              Language Modules
            </button>

            <button
              onClick={() => navigate("/progress")}
              className="px-4 py-2 bg-white border rounded-full flex items-center gap-2 text-sm hover:shadow-md"
            >
              <BarChart3 className="w-4 h-4" />
              Progress Report
            </button>

            <button
              onClick={() => navigate("/contests")}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-orange-400 to-teal-400 text-white flex items-center gap-2 text-sm"
            >
              <Trophy className="w-4 h-4" />
              Contests
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen((p) => !p)}
                className="px-3 py-2 bg-white border rounded-full flex items-center gap-2 text-sm hover:shadow-md"
              >
                <User className="w-4 h-4" />
                Profile
                <ChevronDown className="w-4 h-4" />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white shadow-xl rounded-xl border py-2 z-50">

                  <button
                    onClick={() => { setProfileMenuOpen(false); navigate("/dashboard"); }}
                    className="w-full flex gap-2 items-center px-4 py-2 text-sm hover:bg-orange-50"
                  >
                    <Home className="w-4 h-4 text-teal-600" /> Home
                  </button>

                  <button
                    onClick={() => { setProfileMenuOpen(false); navigate("/profile"); }}
                    className="w-full flex gap-2 items-center px-4 py-2 text-sm hover:bg-orange-50"
                  >
                    <User className="w-4 h-4 text-orange-500" /> Profile
                  </button>

                  <hr className="my-1" />

                  <button
                    onClick={() => { setProfileMenuOpen(false); logout(); }}
                    className="w-full flex gap-2 items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>

                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* Welcome */}
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-4xl font-bold text-gray-900">
            Welcome, {isLoading ? "..." : userName} 👋
          </h2>

          {/* Right-Aligned Actions */}
          <div className="flex gap-3">

            {/* AI */}
            <div className="relative">
              <button
                onClick={() => setAiOpen((p) => !p)}
                className="px-4 py-2 rounded-full bg-white border hover:shadow-md flex items-center gap-2 text-sm"
              >
                <Mic className="w-4 h-4" />
                Talk with AI
                <ChevronDown className="w-4 h-4" />
              </button>

              {aiOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border rounded-xl shadow-xl py-2 z-50">
                  <button
                    onClick={() => {
                      setAiOpen(false);
                      setShowVoiceAiModal(true);
                    }}
                    className="w-full px-4 py-2 flex items-center gap-2 text-sm hover:bg-orange-50"
                  >
                    <Mic className="w-4 h-4 text-teal-600" />
                    Voice Calling AI
                  </button>
                </div>
              )}
            </div>

            {/* Generate Course */}
            <button
              onClick={() => setShowGenerateForm((p) => !p)}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-orange-400 to-teal-400 text-white flex items-center gap-2 text-sm"
            >
              <BookOpen className="w-4 h-4" />
              Generate New Course
            </button>
          </div>
        </div>

        {/* =============== COURSE CARDS (Design B) =============== */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Your Courses
          </h3>

          {showGenerateForm && (
            <div className="mb-6">
              <CourseGenerationForm
                form={form}
                setForm={setForm}
                onGenerate={handleGenerateCourse}
                onCancel={() => setShowGenerateForm(false)}
                isGenerating={generating}
                error={formError}
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hasCourses && primaryCourse && (
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">

                <div className="flex justify-between items-start gap-4">

                  <div>
                    <h4 className="text-xl font-bold text-gray-900">
                      {primaryCourse.title || `${primaryCourse.language} Learning Journey`}
                    </h4>

                    <p className="text-sm text-gray-500">
                      {primaryCourse.language} • {primaryCourse.totalUnits || 0} units • {primaryCourse.totalLessons || 0} lessons
                    </p>

                    <div className="mt-3 flex items-center gap-3 text-xs text-gray-600">
                      <span>{primaryCourse.expectedDuration || "Custom plan"}</span>
                      <span>•</span>
                      <span>Adaptive level</span>
                    </div>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-teal-400 flex items-center justify-center shadow">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-5">
                  <p className="text-sm text-gray-600">Progress</p>
                  <div className="w-full bg-gray-100 h-2 rounded-full mt-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-orange-400 to-teal-400"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center mt-3 text-xs text-gray-600">
                    <span>🔥 {primaryProgress.currentStreak || 0} day streak</span>
                    <span>{unitsCompleted} units done</span>
                  </div>

                  <button
                    onClick={handleStartCourseClick}
                    className="mt-4 w-full px-4 py-3 rounded-full bg-gradient-to-r from-orange-400 to-teal-400 text-white font-medium"
                  >
                    Start Course
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

      </main>

      {/* Dashboard-only tutor chat widget (orange→teal gradient) */}
      <FloatingChatWidget position="right" />

      {/* Voice calling AI modal for "Talk with AI" */}
      <VoiceAIModal
        isOpen={showVoiceAiModal}
        onClose={() => setShowVoiceAiModal(false)}
      />

    </div>
  );
};

export default LearnerDashboard;