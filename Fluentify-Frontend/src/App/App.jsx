import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
<<<<<<< HEAD
import { Login, Signup } from '../modules/auth';
import { Dashboard, CoursePage, LessonPage, TutorChatPage, LanguageModulesPage, ModuleCoursesPage, ModuleCourseDetailsPage } from '../modules/learner';
import { AdminDashboard, AnalyticsDashboard, ModuleManagementLayout } from '../modules/admin';
=======
import { Login, Signup, SignupWithOTP, ForgotPassword } from '../modules/auth';
import { Dashboard, CoursePage, LessonPage, UserProfile as LearnerProfile } from '../modules/learner';
import { AdminDashboard, UserProfile as AdminProfile, ModuleManagementLayout } from '../modules/admin';
import UserListPage from '../modules/admin/user-management/pages/UserListPage';
import UserDetailPage from '../modules/admin/user-management/pages/UserDetailPage';
>>>>>>> 3e7413f (auth changes)
import { StreamingProvider } from '../contexts/StreamingContext';
import './App.css';

function decodeJwtPayload(token) {
  try {
    const base64Url = token.split('.')[1];
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
  if (role && payload.role !== role) return <Navigate to="/login" />;
  if (payload.exp * 1000 < Date.now()) {
    localStorage.removeItem('jwt');
    return <Navigate to="/login" />;
  }
  return children;
}

function App() {
  return (
    <StreamingProvider>
      <Routes>
        {/* Use SignupWithOTP as the main signup route */}
        <Route path="/signup" element={<SignupWithOTP />} />
        <Route path="/signup-old" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={
          <ProtectedRoute role="learner">
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/chat" element={
          <ProtectedRoute role="learner">
            <TutorChatPage />
          </ProtectedRoute>
        } />
        <Route path="/admin-dashboard" element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
<<<<<<< HEAD
        <Route path="/admin" element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/analytics" element={
          <ProtectedRoute role="admin">
            <AnalyticsDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/modules/*" element={
=======
        <Route path="/admin/modules" element={
>>>>>>> 3e7413f (auth changes)
          <ProtectedRoute role="admin">
            <ModuleManagementLayout />
          </ProtectedRoute>
        } />
<<<<<<< HEAD
=======
        <Route path="/admin/users" element={
          <ProtectedRoute role="admin">
            <UserListPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/users/:userId" element={
          <ProtectedRoute role="admin">
            <UserDetailPage />
          </ProtectedRoute>
        } />
>>>>>>> 3e7413f (auth changes)
        <Route path="/course/:courseId" element={
          <ProtectedRoute role="learner">
            <CoursePage />
          </ProtectedRoute>
        } />
        <Route path="/lesson/:courseId/:unitId/:lessonId" element={
          <ProtectedRoute role="learner">
            <LessonPage />
          </ProtectedRoute>
        } />
<<<<<<< HEAD
        <Route path="/language-modules" element={
          <ProtectedRoute role="learner">
            <LanguageModulesPage />
          </ProtectedRoute>
        } />
        <Route path="/language-modules/:language" element={
          <ProtectedRoute role="learner">
            <ModuleCoursesPage />
          </ProtectedRoute>
        } />
        <Route path="/module-course/:courseId" element={
          <ProtectedRoute role="learner">
            <ModuleCourseDetailsPage />
=======
        <Route path="/profile" element={
          <ProtectedRoute role="learner">
            <LearnerProfile />
          </ProtectedRoute>
        } />
        <Route path="/admin/profile" element={
          <ProtectedRoute role="admin">
            <AdminProfile />
>>>>>>> 3e7413f (auth changes)
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </StreamingProvider>
  );
}

export default App;
