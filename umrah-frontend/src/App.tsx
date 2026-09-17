import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ProtectedRoute, PublicOnlyRoute } from './components/auth/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import GroupsPage from './pages/GroupsPage';
import HotelsPage from './pages/HotelsPage';
import TripsPage from './pages/TripsPage';
import TransportPage from './pages/TransportPage';
import ContractsPage from './pages/ContractsPage';
import AgreementDetailPage from './pages/AgreementDetailPage';
import AgreementPdfPage from './pages/AgreementPdfPage';
import NotesPage from './pages/NotesPage';
import SettingsPage from './pages/SettingsPage';
import ActivityLogsPage from './pages/ActivityLogsPage';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <NotificationProvider>
            <Routes>
              {/* Public-only Route (redirects to /dashboard if already logged in) */}
              <Route
                path="/login"
                element={
                  <PublicOnlyRoute>
                    <LoginPage />
                  </PublicOnlyRoute>
                }
              />

              {/* Protected Routes (strictly require valid authentication) */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/groups"
                element={
                  <ProtectedRoute>
                    <GroupsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hotels"
                element={
                  <ProtectedRoute>
                    <HotelsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/trips"
                element={
                  <ProtectedRoute>
                    <TripsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transport"
                element={
                  <ProtectedRoute>
                    <TransportPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/contracts"
                element={
                  <ProtectedRoute>
                    <ContractsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/contracts/:id"
                element={
                  <ProtectedRoute>
                    <AgreementDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/contracts/:id/pdf"
                element={
                  <ProtectedRoute>
                    <AgreementPdfPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/agreement-detail-view"
                element={
                  <ProtectedRoute>
                    <AgreementDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/agreement-pdf-form"
                element={
                  <ProtectedRoute>
                    <AgreementPdfPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/agreement-pdf"
                element={
                  <ProtectedRoute>
                    <AgreementPdfPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transportation-companies-listing-ar"
                element={
                  <ProtectedRoute>
                    <ContractsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/agreements"
                element={
                  <ProtectedRoute>
                    <ContractsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/agreements/:id"
                element={
                  <ProtectedRoute>
                    <AgreementDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/agreements/:id/pdf"
                element={
                  <ProtectedRoute>
                    <AgreementPdfPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notes"
                element={
                  <ProtectedRoute>
                    <NotesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/activity-logs"
                element={
                  <ProtectedRoute>
                    <ActivityLogsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />

              {/* Default fallback route */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </NotificationProvider>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
