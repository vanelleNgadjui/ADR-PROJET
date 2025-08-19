import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import UiKit from './pages/UiKit';
import TestDashboardComponents from './pages/dashboard/TestDashboardComponents';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/ui-kit" element={<UiKit />} />
        <Route path="/test-dashboard" element={<TestDashboardComponents />} />
      </Routes>
    </Router>
  );
}

export default App;
