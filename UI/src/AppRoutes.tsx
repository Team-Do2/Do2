import { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import SettingsPage from './pages/Settings/SettingsPage';
import LoginPage from './pages/Login/LoginPage';
import { useAuthStore } from './stores/authStore';

export function AppRoutes() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  return (
    <Routes>
      <Route
        path="/"
        element={
          isLoggedIn ? (
            <Suspense fallback={<div>Loading...</div>}>
              <HomePage />
            </Suspense>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="/login" element={isLoggedIn ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route
        path="/settings"
        element={isLoggedIn ? <SettingsPage /> : <Navigate to="/login" replace />}
      />
      {/* Redirect unknown routes to home page */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
