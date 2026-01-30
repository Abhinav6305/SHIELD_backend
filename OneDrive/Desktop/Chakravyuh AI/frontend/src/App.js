import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import BankDashboard from './pages/BankDashboard';
import OnboardingPage from './pages/OnboardingPage';
import InvestigationPage from './pages/InvestigationPage';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // On app load, check session
  useEffect(() => {
    const session = localStorage.getItem('isLoggedIn');
    if (session === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', backgroundColor: '#f0f0f0' }}>
        <Routes>
          {/* Login Page */}
          <Route
            path="/login"
            element={
              isLoggedIn ? <Navigate to="/dashboard" /> :
              <LoginPage setIsLoggedIn={setIsLoggedIn} />
            }
          />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              isLoggedIn ? <BankDashboard /> : <Navigate to="/login" />
            }
          />

          {/* Onboarding */}
          <Route
            path="/onboarding"
            element={
              isLoggedIn ? <OnboardingPage /> : <Navigate to="/login" />
            }
          />

          {/* Investigation */}
          <Route
            path="/investigate"
            element={
              isLoggedIn ? <InvestigationPage /> : <Navigate to="/login" />
            }
          />

          {/* Default */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
