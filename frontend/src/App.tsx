
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import UiKit from './pages/UiKit';
import TestDashboardComponents from './pages/dashboard/TestDashboardComponents';
import TestLayout from './pages/dashboard/TestLayout';
import Connexion from './pages/auth/Connexion';
import ChoixRole from './pages/auth/ChoixRole';
import Inscription from './pages/auth/Inscription';
import Onboarding from './pages/auth/Onboarding';
import AuthCallback from './pages/auth/AuthCallback';
import EventWizard from './components/events/wizard/EventWizard';
import FaviconManager from './components/common/FaviconManager';
import './App.css';

function App() {
  return (
    <Router>
      <FaviconManager />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/ui-kit" element={<UiKit />} />
        <Route path="/test-dashboard" element={<TestDashboardComponents />} />
        <Route path="/test-layout" element={<TestLayout />} />
        
        {/* Routes d'authentification */}
        <Route path="/auth/connexion" element={<Connexion />} />
        <Route path="/auth/choix-role" element={<ChoixRole />} />
        <Route path="/auth/inscription/:role" element={<Inscription />} />
        <Route path="/auth/onboarding/:role" element={<Onboarding />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        
        {/* Routes du wizard d'événements */}
        <Route path="/events/create" element={<EventWizard />} />
        <Route path="/events/edit/:id" element={<EventWizard />} />
      </Routes>
    </Router>
  );
}

export default App;
