import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Login, Signup } from '../modules/auth';
import { Dashboard, CoursePage, LessonPage } from '../modules/learner';
import { AdminDashboard, ModuleManagementLayout, CourseEditorPage } from '../modules/admin';
import PublishedLanguageList from '../modules/learner/components/PublishedLanguageList';
import PublishedCourseList from '../modules/learner/components/PublishedCourseList';
import PublishedCourseDetails from '../modules/learner/components/PublishedCourseDetails';
import { Dashboard, CoursePage, LessonPage, TutorChatPage, LanguageModulesPage, ModuleCoursesPage, ModuleCourseDetailsPage } from '../modules/learner';
import { AdminDashboard, AnalyticsDashboard, ModuleManagementLayout } from '../modules/admin';
import { StreamingProvider } from '../contexts/StreamingContext';
import './App.css';

function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem('jwt');
  if (!token) return <Navigate to="/login" />;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (role && payload.role !== role) return <Navigate to="/login" />;
    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem('jwt');
      return <Navigate to="/login" />;
    }
    return children;
  } catch {
    localStorage.removeItem('jwt');
    return <Navigate to="/login" />;
  }
}

function App() {
  return (
    <StreamingProvider>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
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
          <ProtectedRoute role="admin">
            <ModuleManagementLayout />
          </ProtectedRoute>
        } />
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
        <Route path="/learner/modules" element={
          <ProtectedRoute role="learner">
            <PublishedLanguageList />
          </ProtectedRoute>
        } />
        <Route path="/learner/modules/:language" element={
          <ProtectedRoute role="learner">
            <PublishedCourseList />
          </ProtectedRoute>
        } />
        <Route path="/learner/course/:courseId" element={
          <ProtectedRoute role="learner">
            <PublishedCourseDetails />
          </ProtectedRoute>
        } />
        <Route path="/admin/modules/*" element={
          <ProtectedRoute role="admin">
            <ModuleManagementLayout />
          </ProtectedRoute>
        } />
        <Route path="/admin/course/new" element={
          <ProtectedRoute role="admin">
            <CourseEditorPage mode="create" />
          </ProtectedRoute>
        } />
        <Route path="/admin/course/edit/:courseId" element={
          <ProtectedRoute role="admin">
            <CourseEditorPage mode="edit" />
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
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </StreamingProvider>
  );
}

export default App;
