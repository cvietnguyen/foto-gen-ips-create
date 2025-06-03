import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Sparkles, User, LogOut, Zap, Upload, Image as ImageIcon, Loader2, RefreshCw, Users, ArrowLeft } from 'lucide-react';
import { checkUserModelAvailable, generatePhoto } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { AuthGuard } from '@/auth/AuthGuard';
import { useUserData } from '@/hooks/useUserData';

interface ModelInfo {
  id: string;
  ownerName: string;
  isOwnedByUser: boolean;
}

interface HomePageProps {
  userHasModel?: boolean;
  modelInfo?: ModelInfo;
  onSwitchToUserModel?: () => void;
}

const HomePage = () => {
  const navigate = useNavigate();
  const { username, modelName } = useParams();
  const { toast } = useToast();
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const { user } = useUserData();
  
  const [userHasModel, setUserHasModel] = useState<boolean>(false);
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [isLoadingModel, setIsLoadingModel] = useState(true);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      if (username && modelName) {
        // Using someone else's model from URL
        setUserHasModel(true);
        setModelInfo({
          id: modelName,
          ownerName: username,
          isOwnedByUser: false
        });
        setIsLoadingModel(false);
      } else {
        // Check user's own model
        checkUserModel();
      }
    }
  }, [isAuthenticated, user?.id, username, modelName]);

  const checkUserModel = async () => {
    if (!user?.id) return;
    
    setIsLoadingModel(true);
    try {
      // Pass null as modelName when checking user's own model
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

  const handleGenerate = async () => {
    if (!prompt.trim() || !modelInfo) return;
    
    setIsGenerating(true);
    try {
      const response = await generatePhoto({
        ModelName: modelInfo.isOwnedByUser ? null : modelInfo.id,
        Prompt: prompt
      });
      
      if (response.success && response.imageUrl) {
        setGeneratedImage(response.imageUrl);
        toast({
          title: 'Success',
          description: 'Image generated successfully!',
        });
      } else {
        throw new Error(response.message || 'Failed to generate image');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: 'Generation Failed',
        description: 'Failed to generate image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTrainModel = () => {
    navigate('/training');
  };

  const handleLogout = () => {
    instance.logoutPopup().catch((e) => {
      console.error(e);
    });
  };

  const handleSwitchToUserModel = () => {
    navigate('/home');
  };

  if (isLoadingModel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" style={{ color: '#17428c' }} />
          <p className="text-gray-600">Checking your model...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Header */}
        <header className="bg-white backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3">
                <img 
                  src="https://www.ips-ag.com/wp-content/themes/ips-group-v1/images/ips-logo-no-claim.svg" 
                  alt="IPS Logo" 
                  className="h-8"
                />
                <h1 className="text-2xl font-bold" style={{ color: '#17428c' }}>
                  FotoGen
                </h1>
              </div>
              
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {user?.displayName || user?.name || 'IPS User'}
                </Badge>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
          {isLoadingModel ? (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" style={{ color: '#17428c' }} />
                <p className="text-gray-600">Checking your model...</p>
              </div>
            </div>
          ) : userHasModel && modelInfo ? (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Generate Your Images
                </h2>
                <p className="text-gray-600">
                  Use {modelInfo.isOwnedByUser ? 'your trained model' : `${modelInfo.ownerName}'s model`} to create amazing images from text prompts
                </p>
              </div>

              <div className="flex justify-center items-center gap-4">
                <Badge variant="outline" className="flex items-center gap-2 px-3 py-1">
                  {modelInfo.isOwnedByUser ? (
                    <User className="h-4 w-4" style={{ color: '#125597' }} />
                  ) : (
                    <Users className="h-4 w-4" style={{ color: '#17428c' }} />
                  )}
                  <span className="text-sm">
                    Model by: <strong>{modelInfo.ownerName}</strong>
                  </span>
                  <span className="text-xs text-gray-500">({modelInfo.id})</span>
                </Badge>
                
                {modelInfo.isOwnedByUser ? (
                  <Button 
                    onClick={handleTrainModel}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 border-2"
                    style={{ color: '#17428c', borderColor: '#17428c' }}
                  >
                    <RefreshCw className="h-4 w-4" />
                    Retrain Model
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSwitchToUserModel}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 border-2"
                    style={{ color: '#125597', borderColor: '#125597' }}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Use My Model
                  </Button>
                )}
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5" style={{ color: '#17428c' }} />
                      Prompt Generator
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Describe your image
                      </label>
                      <Textarea
                        placeholder="A beautiful sunset over mountains, photorealistic, high detail..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="min-h-32 resize-none"
                      />
                    </div>
                    
                    <Button 
                      onClick={handleGenerate}
                      disabled={!prompt.trim() || isGenerating}
                      className="w-full text-white font-semibold py-3"
                      style={{ background: `linear-gradient(to right, #17428c, #125597)` }}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Generate Image
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5" style={{ color: '#125597' }} />
                      Generated Image
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {isGenerating ? (
                        <div className="text-center">
                          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" style={{ color: '#17428c' }} />
                          <p className="text-sm text-gray-500">Creating your image...</p>
                        </div>
                      ) : generatedImage ? (
                        <img 
                          src={generatedImage} 
                          alt="Generated" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="text-center text-gray-400">
                          <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                          <p>Your generated image will appear here</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Train Your AI Model
                </h2>
                <p className="text-gray-600 text-lg">
                  Before generating images, you need to train your personal AI model with your data
                </p>
              </div>

              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-12">
                  <div className="space-y-6">
                    <div className="p-8 rounded-full w-32 h-32 mx-auto flex items-center justify-center" style={{ background: `linear-gradient(to right, rgba(23, 66, 140, 0.1), rgba(18, 85, 151, 0.1))` }}>
                      <Upload className="h-12 w-12" style={{ color: '#17428c' }} />
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No Model Found
                      </h3>
                      <p className="text-gray-600 mb-6">
                        You haven't trained your personal AI model yet. Upload your training data to get started.
                      </p>
                    </div>

                    <Button 
                      onClick={handleTrainModel}
                      size="lg"
                      className="text-white font-semibold px-8 py-4 text-lg"
                      style={{ background: `linear-gradient(to right, #17428c, #125597)` }}
                    >
                      <Upload className="h-5 w-5 mr-2" />
                      Start Training Your Model
                    </Button>

                    <div className="text-sm text-gray-500 space-y-1">
                      <p>• Upload 10-20 high-quality images</p>
                      <p>• Training typically takes 15-30 minutes</p>
                      <p>• You'll receive an email when complete</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  );
};

export default HomePage;
