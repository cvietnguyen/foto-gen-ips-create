
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Upload, FileText, Clock, Mail, ArrowLeft } from 'lucide-react';
import { useDemoContext } from '@/contexts/DemoContext';

const TrainingPage = () => {
  const navigate = useNavigate();
  const { showDemoControls } = useDemoContext();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isTraining, setIsTraining] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if it's a ZIP file by extension or MIME type
      const isZipFile = file.name.toLowerCase().endsWith('.zip') || 
                       file.type === 'application/zip' || 
                       file.type === 'application/x-zip-compressed';
      
      if (isZipFile) {
        setSelectedFile(file);
        console.log('File selected:', file.name, 'Type:', file.type);
      } else {
        console.log('Invalid file type. Only ZIP files are allowed.');
        event.target.value = ''; // Clear the input
      }
    }
  };

  const handleStartTraining = async () => {
    if (!selectedFile) return;

    setIsTraining(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className={`bg-white border-b border-gray-200 ${showDemoControls ? 'mt-16' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate('/home')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <img 
                src="https://www.ips-ag.com/wp-content/themes/ips-group-v1/images/ips-logo-no-claim.svg" 
                alt="IPS Logo" 
                className="h-8 cursor-pointer"
                onClick={() => navigate('/home')}
              />
              <h1 
                className="text-2xl font-bold cursor-pointer"
                style={{ color: '#17428c' }}
                onClick={() => navigate('/home')}
              >
                FotoGen
              </h1>
            </div>
          </div>
        </div>
      </header>

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
              <Upload className="h-5 w-5" style={{ color: '#17428c' }} />
              Upload Training Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isTraining ? (
              <>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="zip-file" className="text-sm font-medium text-gray-700">
                      Select ZIP file containing your training images
                    </Label>
                    <div className="mt-2">
                      <Input
                        id="zip-file"
                        type="file"
                        accept=".zip,application/zip,application/x-zip-compressed"
                        onChange={handleFileChange}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:text-white"
                        style={{ 
                          '--file-bg': 'linear-gradient(to right, #17428c, #125597)',
                          background: 'var(--file-bg)'
                        } as React.CSSProperties & { '--file-bg': string }}
                      />
                    </div>
                    {selectedFile && (
                      <p className="text-sm text-green-600 mt-1">
                        File ready: {selectedFile.name}
                      </p>
                    )}
                  </div>

                  {selectedFile && (
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 text-green-700">
                        <FileText className="h-4 w-4" />
                        <span className="font-medium">{selectedFile.name}</span>
                        <span className="text-sm">({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                      </div>
                    </div>
                  )}

                  <div className="p-4 rounded-lg border border-blue-200" style={{ backgroundColor: 'rgba(23, 66, 140, 0.05)' }}>
                    <h4 className="font-medium mb-2" style={{ color: '#17428c' }}>Training Requirements:</h4>
                    <ul className="text-sm space-y-1" style={{ color: '#125597' }}>
                      <li>• Upload 10-20 high-quality images in ZIP format</li>
                      <li>• Images should be at least 512x512 pixels</li>
                      <li>• Supported formats: JPG, PNG</li>
                      <li>• Training takes approximately 20 minutes</li>
                    </ul>
                  </div>

                  <Button
                    onClick={handleStartTraining}
                    disabled={!selectedFile}
                    className="w-full text-white font-semibold py-3"
                    style={{ background: `linear-gradient(to right, #17428c, #125597)` }}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Start Training Model
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center space-y-6">
                <div className="p-8 rounded-full w-32 h-32 mx-auto flex items-center justify-center" style={{ background: `linear-gradient(to right, rgba(23, 66, 140, 0.1), rgba(18, 85, 151, 0.1))` }}>
                  <Clock className="h-12 w-12 animate-pulse" style={{ color: '#17428c' }} />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Your Model is Training
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Your AI model training has started. This process takes approximately 20 minutes to complete.
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-blue-200" style={{ backgroundColor: 'rgba(23, 66, 140, 0.05)' }}>
                  <div className="flex items-center gap-2 justify-center" style={{ color: '#125597' }}>
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">You will receive an email notification when training is complete</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default TrainingPage;
