import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import UiKit from './pages/UiKit';
import LandingPage from './pages/LandingPage';
import ChoixRole from './pages/auth/ChoixRole';
import Inscription from './pages/auth/Inscription';
import Connexion from './pages/auth/Connexion';
import AuthCallback from './pages/auth/AuthCallback';
import Onboarding from './pages/auth/Onboarding';
import { useUserSync } from './hooks/useUserSync';

function App() {
  // Synchroniser automatiquement les utilisateurs
  useUserSync();
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/uikit" element={<UiKit />} />
        
        {/* Routes d'authentification */}
        <Route path="/auth/choix-role" element={<ChoixRole />} />
        <Route path="/auth/inscription/:role" element={<Inscription />} />
        <Route path="/auth/connexion" element={<Connexion />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/auth/onboarding/:role" element={<Onboarding />} />

        
        {/* Redirige toute autre route vers / */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
