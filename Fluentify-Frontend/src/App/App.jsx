import React, { useMemo } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Login, Signup, SignupWithOTP, ForgotPassword } from '../modules/auth';
import {
  Dashboard,
  CoursePage,
  LessonPage,
  TutorChatPage,
  LanguageModulesPage,
  ModuleCoursesPage,
  ModuleCourseDetailsPage,
  UserProfile as LearnerProfile
} from '../modules/learner';
import {
  AdminDashboard,
  AnalyticsDashboard,
  ModuleManagementLayout,
  UserProfile as AdminProfile
} from '../modules/admin';
import UserListPage from '../modules/admin/user-management/pages/UserListPage';
import UserDetailPage from '../modules/admin/user-management/pages/UserDetailPage';
import { StreamingProvider } from '../contexts/StreamingContext';
import './App.css';

/**
 * FIX: Decode JWT payload with better error handling
 * Prevents unnecessary logout on malformed tokens during API errors
 */
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

/**
 * FIX: ProtectedRoute validates token on every mount/refresh
 * Persists authentication across page refreshes
 * Only redirects to login on actual authentication failures
 */
function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem('jwt');
  
  // No token - redirect to login
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  // Decode and validate token
  const payload = decodeJwtPayload(token);
  if (!payload) {
    localStorage.removeItem('jwt');
    return <Navigate to="/login" />;
  }
  
  // Check token expiration
  if (payload.exp && payload.exp * 1000 < Date.now()) {
    localStorage.removeItem('jwt');
    return <Navigate to="/login" />;
  }
  
  // Check role if required
  if (role && payload.role !== role) {
    return <Navigate to="/login" />;
  }
  
  // Valid token - render protected content
  return children;
}

function App() {
  return (
    <StreamingProvider>
      <Routes>
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
          path="/admin/modules"
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
          path="/admin/profile"
          element={
            <ProtectedRoute role="admin">
              <AdminProfile />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </StreamingProvider>
  );
}

export default App;
