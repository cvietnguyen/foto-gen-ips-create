
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Image } from 'lucide-react';
import { useIsAuthenticated } from '@azure/msal-react';
import { AuthGuard } from '@/auth/AuthGuard';
import { useTraining } from '@/hooks/useTraining';
import { useFileUpload } from '@/hooks/useFileUpload';
import { TrainingHeader } from '@/components/training/TrainingHeader';
import { FileUploadSection } from '@/components/training/FileUploadSection';
import { TrainingProgress } from '@/components/training/TrainingProgress';
import { TrainingRequirements } from '@/components/training/TrainingRequirements';

const TrainingPage = () => {
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const { isTraining, currentStep, handleStartTraining } = useTraining();
  const { isUploading, uploadedFiles, previewUrls, handleFileUpload } = useFileUpload();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <TrainingHeader />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Train Your AI Model
            </h2>
            <p className="text-gray-600">
              Upload your training data to create a personalized AI model
            </p>
          </div>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" style={{ color: '#17428c' }} />
                Training Images
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isTraining ? (
                <>
                  <FileUploadSection
                    isUploading={isUploading}
                    uploadedFiles={uploadedFiles}
                    previewUrls={previewUrls}
                    onFileUpload={handleFileUpload}
                  />

                  <TrainingRequirements />

                  <Button
                    onClick={() => handleStartTraining(uploadedFiles)}
                    disabled={uploadedFiles.length === 0 || isTraining}
                    className="w-full text-white font-semibold py-3"
                    style={{ background: `linear-gradient(to right, #17428c, #125597)` }}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Start Training Model
                  </Button>
                </>
              ) : (
                <TrainingProgress currentStep={currentStep} />
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </AuthGuard>
  );
};

export default TrainingPage;
