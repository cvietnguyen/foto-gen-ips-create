
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

interface ModelInfo {
  id: string;
  ownerName: string;
  isOwnedByUser: boolean;
}

interface DemoControlsProps {
  isVisible: boolean;
  onToggleVisibility: () => void;
  onDemoSetUserModel?: () => void;
  onDemoSetNoModel?: () => void;
  onDemoSetOtherModel?: () => void;
  onDemoLogin?: () => void;
  onDemoLogout?: () => void;
  isLoggedIn: boolean;
  userHasModel?: boolean;
  modelInfo?: ModelInfo;
  onSwitchToUserModel?: () => void;
}

const DemoControls = ({ 
  isVisible, 
  onToggleVisibility, 
  onDemoSetUserModel, 
  onDemoSetNoModel, 
  onDemoSetOtherModel,
  onDemoLogin,
  onDemoLogout,
  isLoggedIn,
  userHasModel,
  modelInfo,
  onSwitchToUserModel
}: DemoControlsProps) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    onDemoLogin?.();
    navigate('/home');
  };

  const handleLogout = () => {
    onDemoLogout?.();
    navigate('/login');
  };

  if (!isVisible) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <Button 
          onClick={onToggleVisibility} 
          size="sm" 
          variant="outline"
          className="bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-50 border-b border-yellow-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">Demo Controls:</span>
            <div className="flex gap-2">
              {!isLoggedIn ? (
                <Button onClick={handleLogin} size="sm" variant="outline" className="text-xs">
                  Login
                </Button>
              ) : (
                <>
                  <Button onClick={onDemoSetUserModel} size="sm" variant="outline" className="text-xs">
                    User Has Model
                  </Button>
                  <Button onClick={onDemoSetNoModel} size="sm" variant="outline" className="text-xs">
                    User No Model
                  </Button>
                  <Button onClick={onDemoSetOtherModel} size="sm" variant="outline" className="text-xs">
                    Using Other's Model
                  </Button>
                  <Button onClick={handleLogout} size="sm" variant="outline" className="text-xs">
                    Logout
                  </Button>
                </>
              )}
            </div>
          </div>
          <Button 
            onClick={onToggleVisibility} 
            size="sm" 
            variant="ghost"
            className="text-yellow-600 hover:bg-yellow-100"
          >
            Hide
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DemoControls;
