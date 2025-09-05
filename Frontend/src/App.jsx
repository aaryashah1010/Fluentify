import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem('jwt');
  if (!token) return <Navigate to="/login" />;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (role && payload.role !== role) return <Navigate to="/login" />;
    // Optionally check exp
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
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={
        <ProtectedRoute role="learner">
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin-dashboard" element={
        <ProtectedRoute role="admin">
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
