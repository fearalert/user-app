/** @format */

import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './Protected';
import LoginPage from '../pages/LoginPage';
import Dashboard from '../pages/Dashboard';
import NotFoundPage from '../pages/NotFoundPage';

const AppRoutes = () => (
  <Routes>
    <Route
      path="/login"
      element={<LoginPage />}
    />

    <Route
      path="/"
      element={<LoginPage />}
    />

    {/* not found page */}
    <Route
      path="*"
      element={<NotFoundPage />}
    />

    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />
  </Routes>
);

export default AppRoutes;
