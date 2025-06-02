
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ModelInfo {
  id: string;
  ownerName: string;
  isOwnedByUser: boolean;
}

interface DemoContextType {
  isLoggedIn: boolean;
  userHasModel: boolean;
  modelInfo?: ModelInfo;
  showDemoControls: boolean;
  setIsLoggedIn: (value: boolean) => void;
  setUserHasModel: (value: boolean) => void;
  setModelInfo: (value: ModelInfo | undefined) => void;
  setShowDemoControls: (value: boolean) => void;
  handleDemoLogin: () => void;
  handleDemoLogout: () => void;
  handleDemoSetUserModel: () => void;
  handleDemoSetNoModel: () => void;
  handleDemoSetOtherModel: () => void;
  handleSwitchToUserModel: () => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const useDemoContext = () => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemoContext must be used within a DemoProvider');
  }
  return context;
};

interface DemoProviderProps {
  children: ReactNode;
}

export const DemoProvider = ({ children }: DemoProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userHasModel, setUserHasModel] = useState(false);
  const [modelInfo, setModelInfo] = useState<ModelInfo | undefined>(undefined);
  const [showDemoControls, setShowDemoControls] = useState(true);

  const handleDemoLogin = () => {
    setIsLoggedIn(true);
    // Simulate checking if user has a trained model
    const hasModel = Math.random() > 0.3;
    setUserHasModel(hasModel);
    
    if (hasModel) {
      const isOwnModel = Math.random() > 0.4;
      
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

  const handleDemoLogout = () => {
    setIsLoggedIn(false);
    setUserHasModel(false);
    setModelInfo(undefined);
  };

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
    setModelInfo({
      id: 'a7b2c3d4-e5f6-7890-1234-567890abcdef',
      ownerName: 'You',
      isOwnedByUser: true
    });
  };

  const value = {
    isLoggedIn,
    userHasModel,
    modelInfo,
    showDemoControls,
    setIsLoggedIn,
    setUserHasModel,
    setModelInfo,
    setShowDemoControls,
    handleDemoLogin,
    handleDemoLogout,
    handleDemoSetUserModel,
    handleDemoSetNoModel,
    handleDemoSetOtherModel,
    handleSwitchToUserModel,
  };

  return (
    <DemoContext.Provider value={value}>
      {children}
    </DemoContext.Provider>
  );
};
