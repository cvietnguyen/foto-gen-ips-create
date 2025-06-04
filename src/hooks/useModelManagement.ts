
import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { checkUserModelAvailable } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/hooks/useUserData';

interface ModelInfo {
  id: string;
  ownerName: string;
  isOwnedByUser: boolean;
}

export const useModelManagement = (user: User | null, isAuthenticated: boolean) => {
  const navigate = useNavigate();
  const { username, modelName } = useParams();
  const location = useLocation();
  const { toast } = useToast();
  
  const [userHasModel, setUserHasModel] = useState<boolean>(false);
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [isLoadingModel, setIsLoadingModel] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      console.log('useModelManagement effect - username:', username, 'modelName:', modelName, 'pathname:', location.pathname);
      
      // Check if we're coming from a shared model URL or if there's stored model info
      const storedModelInfo = sessionStorage.getItem('sharedModelInfo');
      
      if (username && modelName) {
        // When accessing another user's model via URL, use the modelName from params
        console.log('Detected shared model URL - calling checkOtherUserModel with:', modelName, username);
        checkOtherUserModel(modelName, username);
      } else if (storedModelInfo && location.pathname === '/home') {
        // When on /home but we have stored shared model info, use it
        console.log('Using stored shared model info on /home');
        const parsed = JSON.parse(storedModelInfo);
        setModelInfo(parsed);
        setUserHasModel(true);
        setIsLoadingModel(false);
      } else {
        // When accessing user's own model, let backend find it and clear any stored shared model
        console.log('Accessing user own model - clearing stored shared model');
        sessionStorage.removeItem('sharedModelInfo');
        checkUserModel();
      }
    }
  }, [isAuthenticated, user?.id, username, modelName, location.pathname]);

  const checkOtherUserModel = async (modelId: string, ownerName: string) => {
    if (!user?.id) return;
    
    setIsLoadingModel(true);
    try {
      // Pass the specific model ID from URL to the API
      console.log('Checking other user model with modelId:', modelId);
      const response = await checkUserModelAvailable(user.id, modelId);
      
      if (response.success && response.hasModel) {
        const sharedModelInfo = {
          id: modelId, // Use the model ID from URL params
          ownerName: ownerName,
          isOwnedByUser: false
        };
        
        setUserHasModel(true);
        setModelInfo(sharedModelInfo);
        
        // Store the shared model info for use when navigating to /home
        sessionStorage.setItem('sharedModelInfo', JSON.stringify(sharedModelInfo));
      } else {
        setUserHasModel(false);
        toast({
          title: 'Model Not Found',
          description: 'The requested model is not available or accessible.',
          variant: 'destructive',
        });
        navigate('/home');
      }
    } catch (error) {
      console.error('Error checking other user model:', error);
      toast({
        title: 'Error',
        description: 'Failed to check model availability',
        variant: 'destructive',
      });
      navigate('/home');
    } finally {
      setIsLoadingModel(false);
    }
  };

  const checkUserModel = async () => {
    if (!user?.id) return;
    
    setIsLoadingModel(true);
    try {
      // For user's own model, pass null to let backend find it
      console.log('Checking user own model, passing null to API');
      const response = await checkUserModelAvailable(user.id, null);
      
      if (response.success) {
        setUserHasModel(response.hasModel);
        if (response.hasModel && response.modelName) {
          setModelInfo({
            id: response.modelName,
            ownerName: user.displayName || user.name || 'IPS User',
            isOwnedByUser: true
          });
        }
      } else {
        console.error('Failed to check user model:', response.message);
        toast({
          title: 'Error',
          description: 'Failed to check model availability',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error checking user model:', error);
      toast({
        title: 'Error',
        description: 'Failed to check model availability',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingModel(false);
    }
  };

  return {
    userHasModel,
    modelInfo,
    isLoadingModel
  };
};
