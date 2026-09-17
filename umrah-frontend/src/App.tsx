import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
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
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/groups" element={<GroupsPage />} />
              <Route path="/hotels" element={<HotelsPage />} />
              <Route path="/trips" element={<TripsPage />} />
              <Route path="/transport" element={<TransportPage />} />
              <Route path="/contracts" element={<ContractsPage />} />
              <Route path="/contracts/:id" element={<AgreementDetailPage />} />
              <Route path="/contracts/:id/pdf" element={<AgreementPdfPage />} />
              <Route path="/agreement-detail-view" element={<AgreementDetailPage />} />
              <Route path="/agreement-pdf-form" element={<AgreementPdfPage />} />
              <Route path="/agreement-pdf" element={<AgreementPdfPage />} />
              <Route path="/transportation-companies-listing-ar" element={<ContractsPage />} />
              <Route path="/agreements" element={<ContractsPage />} />
              <Route path="/agreements/:id" element={<AgreementDetailPage />} />
              <Route path="/agreements/:id/pdf" element={<AgreementPdfPage />} />
              <Route path="/notes" element={<NotesPage />} />
              <Route path="/activity-logs" element={<ActivityLogsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              {/* Default route redirects to dashboard */}
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
