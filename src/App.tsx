import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navigation from './components/Navigation';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import FarmerDashboard from './components/dashboards/FarmerDashboard';
import DistributorDashboard from './components/dashboards/DistributorDashboard';
import ConsumerDashboard from './components/dashboards/ConsumerDashboard';
import RegulatorDashboard from './components/dashboards/RegulatorDashboard';
import FarmerProfile from './components/profiles/FarmerProfile';
import DistributorProfile from './components/profiles/DistributorProfile';
import ConsumerProfile from './components/profiles/ConsumerProfile';
import RegulatorProfile from './components/profiles/RegulatorProfile';

function AppContent() {
  const { user } = useApp();
  const [currentPage, setCurrentPage] = useState('home');
  const [pageKey, setPageKey] = useState(0);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    // Force re-render with new key to trigger animations
    setPageKey(prev => prev + 1);
  };

  const renderDashboard = () => {
    if (!user) return null;

    // Show profile page when selected
    if (currentPage === 'profile') {
      switch (user.role) {
        case 'farmer':
          return <FarmerProfile />;
        case 'distributor':
          return <DistributorProfile />;
        case 'consumer':
          return <ConsumerProfile />;
        case 'regulator':
          return <RegulatorProfile />;
      }
    }

    switch (user.role) {
      case 'farmer':
        return <FarmerDashboard key={pageKey} currentPage={currentPage} />;
      case 'distributor':
        return <DistributorDashboard key={pageKey} currentPage={currentPage} onNavigate={handleNavigate} />;
      case 'consumer':
        return <ConsumerDashboard key={pageKey} currentPage={currentPage} />;
      case 'regulator':
        return <RegulatorDashboard key={pageKey} currentPage={currentPage} />;
      default:
        return null;
    }
  };

  const renderContent = () => {
    if (!user) {
      switch (currentPage) {
        case 'login':
          return <LoginPage onNavigate={handleNavigate} />;
        case 'home':
          return <LandingPage onNavigate={handleNavigate} />;
        default:
          return <LandingPage onNavigate={handleNavigate} />;
      }
    }

    // If user is logged in but navigates to 'home', show landing page
    if (currentPage === 'home') {
      return <LandingPage onNavigate={handleNavigate} />;
    }

    return renderDashboard();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
      {renderContent()}
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;