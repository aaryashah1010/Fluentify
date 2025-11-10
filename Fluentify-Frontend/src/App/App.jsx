import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import {
  Login,
  Signup,
  SignupWithOTP,
  ForgotPassword
} from '../modules/auth';

import {
  Dashboard,
  CoursePage,
  LessonPage,
  TutorChatPage,
  LanguageModulesPage,
  ModuleCoursesPage,
  ModuleCourseDetailsPage,
  UserProfile as LearnerProfile,
  ProgressPage
} from '../modules/learner';

import {
  AdminDashboard,
  AnalyticsDashboard,
  ModuleManagementLayout,
  UserProfile as AdminProfile,
  UserManagementLayout,
  CourseEditorPage
} from '../modules/admin';

import UserListPage from '../modules/admin/user-management/pages/UserListPage';
import UserDetailPage from '../modules/admin/user-management/pages/UserDetailPage';
import PublishedLanguageList from '../modules/learner/components/PublishedLanguageList';
import PublishedCourseList from '../modules/learner/components/PublishedCourseList';
import PublishedCourseDetails from '../modules/learner/components/PublishedCourseDetails';
import { StreamingProvider } from '../contexts/StreamingContext';
import './App.css';

function decodeJwtPayload(token) {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '==='.slice((base64.length + 3) % 4);
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}


function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem('jwt');
  if (!token) return <Navigate to="/login" />;

  const payload = decodeJwtPayload(token);
  if (!payload) {
    localStorage.removeItem('jwt');
    return <Navigate to="/login" />;
  }

  if (payload.exp && payload.exp * 1000 < Date.now()) {
    localStorage.removeItem('jwt');
    return <Navigate to="/login" />;
  }

  if (role && payload.role !== role) {
    return <Navigate to="/login" />;
  }

  return children;
}

// Smart redirect component that redirects based on auth status
function SmartRedirect() {
  const token = localStorage.getItem('jwt');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const payload = decodeJwtPayload(token);
  if (!payload || (payload.exp && payload.exp * 1000 < Date.now())) {
    localStorage.removeItem('jwt');
    return <Navigate to="/login" replace />;
  }

  // Redirect to appropriate dashboard based on role
  if (payload.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  } else {
    return <Navigate to="/dashboard" replace />;
  }
}

function App() {
  return (
    <StreamingProvider>
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<SmartRedirect />} />

        {/* Authentication */}
        <Route path="/signup" element={<SignupWithOTP />} />
        <Route path="/signup-old" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Learner Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="learner">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute role="learner">
              <TutorChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/course/:courseId"
          element={
            <ProtectedRoute role="learner">
              <CoursePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lesson/:courseId/:unitId/:lessonId"
          element={
            <ProtectedRoute role="learner">
              <LessonPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/language-modules"
          element={
            <ProtectedRoute role="learner">
              <LanguageModulesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/language-modules/:language"
          element={
            <ProtectedRoute role="learner">
              <ModuleCoursesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/module-course/:courseId"
          element={
            <ProtectedRoute role="learner">
              <ModuleCourseDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute role="learner">
              <LearnerProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/progress"
          element={
            <ProtectedRoute role="learner">
              <ProgressPage />
            </ProtectedRoute>
          }
        />

        {/* Published Modules (Learner Public View) */}
        <Route
          path="/learner/modules"
          element={
            <ProtectedRoute role="learner">
              <PublishedLanguageList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/learner/modules/:language"
          element={
            <ProtectedRoute role="learner">
              <PublishedCourseList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/learner/course/:courseId"
          element={
            <ProtectedRoute role="learner">
              <PublishedCourseDetails />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute role="admin">
              <AnalyticsDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/modules/*"
          element={
            <ProtectedRoute role="admin">
              <ModuleManagementLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role="admin">
              <UserListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users/:userId"
          element={
            <ProtectedRoute role="admin">
              <UserDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users/*"
          element={
            <ProtectedRoute role="admin">
              <UserManagementLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/course/new"
          element={
            <ProtectedRoute role="admin">
              <CourseEditorPage mode="create" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/course/edit/:courseId"
          element={
            <ProtectedRoute role="admin">
              <CourseEditorPage mode="edit" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute role="admin">
              <AdminProfile />
            </ProtectedRoute>
          }
        />

        {/* Fallback - redirect based on auth status */}
        <Route path="*" element={<SmartRedirect />} />
      </Routes>
    </StreamingProvider>
  );
}

export default App;
