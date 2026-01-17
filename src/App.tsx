import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryProvider } from './providers/QueryProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { SettingsProvider } from './providers/SettingsProvider';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

// Layouts - these are likely named exports
import { MainLayout } from './layouts/MainLayout';
import { AuthLayout } from './layouts/AuthLayout';

// Pages - change to default imports since you're getting "no exported member" error
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProjectsPage from './pages/projects/ProjectsPage';
import CreateProjectPage from './pages/projects/CreateProjectPage';
import ProjectDetailPage from './pages/projects/ProjectDetailPage';
import TasksPage from './pages/tasks/TasksPage';
import CreateTaskPage from './pages/tasks/CreateTaskPage';
import CalendarPage from './pages/calendar/CalendarPage';
import AnalyticsPage from './pages/analytics/AnalyticsPage';
import SettingsPage from './pages/settings/SettingsPage';
import TaskDetailPage from './pages/tasks/TaskDetailPage';

// Components - these are likely named exports
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ProfilePage } from './pages/profile/ProfilePage';

function App() {
  return (
    <QueryProvider>
      <ThemeProvider>
        <SettingsProvider>
          <Router>
            <AnimatePresence mode="wait">
              <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                <Routes>
                  {/* Public routes */}
                  <Route path="/auth" element={<AuthLayout />}>
                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<RegisterPage />} />
                  </Route>

                  {/* Protected routes */}
                  <Route path="/" element={
                    <ProtectedRoute>
                      <MainLayout />
                    </ProtectedRoute>
                  }>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="projects">
                      <Route index element={<ProjectsPage />} />
                      <Route path="create" element={<CreateProjectPage />} />
                      <Route path=":id" element={<ProjectDetailPage />} />
                    </Route>
                    <Route path="tasks">
                      <Route index element={<TasksPage />} />
                      <Route path="create" element={<CreateTaskPage />} />
                      <Route path=":id" element={<TaskDetailPage />} />
                    </Route>
                    <Route path="calendar" element={<CalendarPage />} />
                    <Route path="analytics" element={<AnalyticsPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="settings" element={<SettingsPage />} />
                  </Route>

                  {/* Catch all route */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
            </AnimatePresence>
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 4000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </Router>
        </SettingsProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}

export default App;
