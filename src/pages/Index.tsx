
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import LoginPage from '@/components/LoginPage';
import HomePage from '@/components/HomePage';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userHasModel, setUserHasModel] = useState(false); // This would come from API

  const handleLogin = () => {
    setIsLoggedIn(true);
    // In real implementation, this would handle Azure AD authentication
    // and fetch user's model status
    
    // Simulate checking if user has a trained model (randomized for demo)
    setUserHasModel(Math.random() > 0.5);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserHasModel(false);
  };

  return (
    <Layout>
      {!isLoggedIn ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <HomePage onLogout={handleLogout} userHasModel={userHasModel} />
      )}
    </Layout>
  );
};

export default Index;
