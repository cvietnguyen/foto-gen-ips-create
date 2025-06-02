
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import LoginPage from './LoginPage';
import HomePage from './HomePage';
import DemoControls from '@/components/DemoControls';

interface ModelInfo {
  id: string;
  ownerName: string;
  isOwnedByUser: boolean;
}

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userHasModel, setUserHasModel] = useState(false);
  const [modelInfo, setModelInfo] = useState<ModelInfo | undefined>(undefined);
  const [showDemoControls, setShowDemoControls] = useState(true);

  const handleLogin = () => {
    setIsLoggedIn(true);
    // In real implementation, this would handle Azure AD authentication
    // and fetch user's model status
    
    // Simulate checking if user has a trained model (randomized for demo)
    const hasModel = Math.random() > 0.3; // Increased chance to see model interface
    setUserHasModel(hasModel);
    
    if (hasModel) {
      // Simulate different model scenarios
      const isOwnModel = Math.random() > 0.4; // 60% chance it's user's own model
      
      if (isOwnModel) {
        setModelInfo({
          id: 'a7b2c3d4-e5f6-7890-1234-567890abcdef',
          ownerName: 'You',
          isOwnedByUser: true
        });
      } else {
        const otherUsers = ['Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson'];
        const randomUser = otherUsers[Math.floor(Math.random() * otherUsers.length)];
        setModelInfo({
          id: '12345678-9abc-def0-1234-567890abcdef',
          ownerName: randomUser,
          isOwnedByUser: false
        });
      }
    }
  };

  // Demo control functions
  const handleDemoSetUserModel = () => {
    setUserHasModel(true);
    setModelInfo({
      id: 'a7b2c3d4-e5f6-7890-1234-567890abcdef',
      ownerName: 'You',
      isOwnedByUser: true
    });
  };

  const handleDemoSetNoModel = () => {
    setUserHasModel(false);
    setModelInfo(undefined);
  };

  const handleDemoSetOtherModel = () => {
    setUserHasModel(true);
    const otherUsers = ['Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson'];
    const randomUser = otherUsers[Math.floor(Math.random() * otherUsers.length)];
    setModelInfo({
      id: '12345678-9abc-def0-1234-567890abcdef',
      ownerName: randomUser,
      isOwnedByUser: false
    });
  };

  const handleSwitchToUserModel = () => {
    // Simulate switching back to user's own model
    setModelInfo({
      id: 'a7b2c3d4-e5f6-7890-1234-567890abcdef',
      ownerName: 'You',
      isOwnedByUser: true
    });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserHasModel(false);
    setModelInfo(undefined);
  };

  return (
    <Layout>
      <DemoControls
        isVisible={showDemoControls}
        onToggleVisibility={() => setShowDemoControls(!showDemoControls)}
        onDemoSetUserModel={handleDemoSetUserModel}
        onDemoSetNoModel={handleDemoSetNoModel}
        onDemoSetOtherModel={handleDemoSetOtherModel}
        onDemoLogin={handleLogin}
        onDemoLogout={handleLogout}
        isLoggedIn={isLoggedIn}
      />
      
      <div className={showDemoControls ? 'pt-16' : ''}>
        {!isLoggedIn ? (
          <LoginPage onLogin={handleLogin} />
        ) : (
          <HomePage 
            onLogout={handleLogout} 
            userHasModel={userHasModel} 
            modelInfo={modelInfo}
            onSwitchToUserModel={handleSwitchToUserModel}
          />
        )}
      </div>
    </Layout>
  );
};

export default Index;
