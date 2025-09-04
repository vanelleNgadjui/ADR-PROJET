
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import DynamicEventsPage from './pages/DynamicEventsPage';
import UiKit from './pages/UiKit';
import TestDashboardComponents from './pages/dashboard/TestDashboardComponents';
import HomeOrg from './pages/dashboard/HomeOrg';
import Connexion from './pages/auth/Connexion';
import ChoixRole from './pages/auth/ChoixRole';
import Inscription from './pages/auth/Inscription';
import Onboarding from './pages/auth/Onboarding';
import AuthCallback from './pages/auth/AuthCallback';
import EventWizard from './components/events/wizard/EventWizard';
import ProfilePage from './pages/ProfilePage';
import FaviconManager from './components/common/FaviconManager';
import './App.css';

function App() {
  return (
    <Router>
      <FaviconManager />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/homeOrg" element={<HomeOrg />} />
        <Route path="/ui-kit" element={<UiKit />} />
        <Route path="/test-dashboard" element={<TestDashboardComponents />} />
        <Route path="/test-layout" element={<HomeOrg />} />
        
        {/* Routes des dashboards */}
        <Route path="/dashboard" element={<HomeOrg />} />
        <Route path="/admin-dashboard" element={<HomeOrg />} />
        
        {/* Routes d'authentification */}
        <Route path="/auth/connexion" element={<Connexion />} />
        <Route path="/auth/choix-role" element={<ChoixRole />} />
        <Route path="/auth/inscription/:role" element={<Inscription />} />
        <Route path="/auth/onboarding/:role" element={<Onboarding />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        
        {/* Routes du wizard d'événements */}
        <Route path="/events/create" element={<EventWizard />} />
        <Route path="/events/edit/:id" element={<EventWizard />} />
        
        {/* Routes des pages dynamiques d'événements */}
        <Route path="/search" element={<DynamicEventsPage context="search" />} />
        <Route path="/category/:id" element={<DynamicEventsPage context="category" />} />
        <Route path="/upcoming" element={<DynamicEventsPage context="upcoming" />} />
        <Route path="/suggestions" element={<DynamicEventsPage context="suggestions" />} />
        <Route path="/top-events" element={<DynamicEventsPage context="top-events" />} />
        
        {/* Route du profil utilisateur */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/recent" element={<DynamicEventsPage context="recent" />} />
      </Routes>
    </Router>
  );
}

export default App;
