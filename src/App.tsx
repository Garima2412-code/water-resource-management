import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { WaterProvider } from './context/WaterContext';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';
import { SourcesPage } from './pages/SourcesPage';
import { SourceDetailsPage } from './pages/SourceDetailsPage';
import { QualityPage } from './pages/QualityPage';
import { ComplaintsPage } from './pages/ComplaintsPage';
import { MaintenancePage } from './pages/MaintenancePage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { MapPage } from './pages/MapPage';
import { ReportsPage } from './pages/ReportsPage';

function App() {
  return (
    <WaterProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public Landing View */}
            <Route path="/landing" element={<LandingPage />} />
            
            {/* Authentications */}
            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<AuthPage />} />

            {/* Dashboard Command Center */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Water Sources Modules */}
            <Route path="/sources" element={<SourcesPage />} />
            <Route path="/sources/:id" element={<SourceDetailsPage />} />

            {/* Chemistry and Quality logs */}
            <Route path="/quality" element={<QualityPage />} />

            {/* Citizen Complaint Board */}
            <Route path="/complaints" element={<ComplaintsPage />} />

            {/* Maintenance Tickets & Schedules */}
            <Route path="/maintenance" element={<MaintenancePage />} />

            {/* Analytics & System Reporting */}
            <Route path="/analytics" element={<AnalyticsPage />} />

            {/* Live GIS Map Canvas */}
            <Route path="/map" element={<MapPage />} />

            {/* Document Report Generator */}
            <Route path="/reports" element={<ReportsPage />} />

            {/* Redirects */}
            <Route path="/" element={<Navigate to="/landing" replace />} />
            <Route path="*" element={<Navigate to="/landing" replace />} />
          </Routes>
        </Layout>
      </Router>
    </WaterProvider>
  );
}

export default App;

