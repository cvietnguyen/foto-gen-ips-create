
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  const { toast } = useToast();
  
  const [userHasModel, setUserHasModel] = useState<boolean>(false);
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [isLoadingModel, setIsLoadingModel] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      if (username && modelName) {
        checkOtherUserModel(modelName, username);
      } else {
        checkUserModel();
      }
    }
  }, [isAuthenticated, user?.id, username, modelName]);

  const checkOtherUserModel = async (modelId: string, ownerName: string) => {
    if (!user?.id) return;
    
    setIsLoadingModel(true);
    try {
      const response = await checkUserModelAvailable(user.id, modelId);
      
      if (response.success && response.hasModel) {
        setUserHasModel(true);
        setModelInfo({
          id: modelId,
          ownerName: ownerName,
          isOwnedByUser: false
        });
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
