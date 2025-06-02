import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Sparkles, User, LogOut, Zap, Upload, Image as ImageIcon, Loader2, RefreshCw, Users, ArrowLeft } from 'lucide-react';
import { useDemoContext } from '@/contexts/DemoContext';

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
  const { userHasModel, modelInfo, handleSwitchToUserModel, showDemoControls } = useDemoContext();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setGeneratedImage(`https://picsum.photos/512/512?random=${Date.now()}`);
      setIsGenerating(false);
    }, 3000);
  };

  const handleTrainModel = () => {
    navigate('/training');
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className={`bg-white backdrop-blur-sm border-b border-gray-200 sticky z-10 ${showDemoControls ? 'top-16' : 'top-0'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                FotoGen
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="flex items-center gap-1">
                <User className="h-3 w-3" />
                IPS User
              </Badge>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {userHasModel && modelInfo ? (
          /* Model exists - show generation interface */
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Generate Your Images
              </h2>
              <p className="text-gray-600">
                Use {modelInfo.isOwnedByUser ? 'your trained model' : `${modelInfo.ownerName}'s model`} to create amazing images from text prompts
              </p>
            </div>

            {/* Model Info & Actions */}
            <div className="flex justify-center items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-2 px-3 py-1">
                {modelInfo.isOwnedByUser ? (
                  <User className="h-4 w-4 text-green-600" />
                ) : (
                  <Users className="h-4 w-4 text-blue-600" />
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
                  className="flex items-center gap-2 text-purple-600 border-purple-200 hover:bg-purple-50"
                >
                  <RefreshCw className="h-4 w-4" />
                  Retrain Model
                </Button>
              ) : (
                <Button 
                  onClick={handleSwitchToUserModel}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 text-green-600 border-green-200 hover:bg-green-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Use My Model
                </Button>
              )}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input Section */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-purple-600" />
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
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3"
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

              {/* Output Section */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-blue-600" />
                    Generated Image
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {isGenerating ? (
                      <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-2" />
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
          /* No model - show training interface */
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
                  <div className="p-8 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 w-32 h-32 mx-auto flex items-center justify-center">
                    <Upload className="h-12 w-12 text-purple-600" />
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
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-4 text-lg"
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
  );
};

export default HomePage;
