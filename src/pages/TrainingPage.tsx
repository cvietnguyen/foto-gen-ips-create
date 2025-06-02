
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Clock, Mail, Image, Upload } from 'lucide-react';
import { uploadZipFile, trainModel } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';
import JSZip from 'jszip';

const TrainingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isTraining, setIsTraining] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const generateModelId = () => {
    return 'model-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  };

  const createZipFile = async (files: File[], modelId: string): Promise<File> => {
    const zip = new JSZip();
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExtension = file.name.split('.').pop();
      const fileName = `image_${i + 1}.${fileExtension}`;
      zip.file(fileName, file);
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    return new File([zipBlob], `${modelId}.zip`, { type: 'application/zip' });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    setUploadedFiles(fileArray);
    
    // Create preview URLs for the uploaded images
    const urls = fileArray.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
    
    setIsUploading(true);

    try {
      // Generate model ID
      const modelId = generateModelId();
      console.log('Generated model ID:', modelId);

      // Create zip file
      const zipFile = await createZipFile(fileArray, modelId);
      console.log('Created zip file:', zipFile);

      // Upload zip file
      const uploadResponse = await uploadZipFile(zipFile, modelId);
      
      if (uploadResponse.success) {
        setUploadedImageUrl(uploadResponse.url);
        toast({
          title: 'Upload Successful',
          description: `${fileArray.length} images uploaded and zipped successfully.`,
        });
      } else {
        throw new Error(uploadResponse.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload and zip images. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleStartTraining = async () => {
    if (!uploadedImageUrl) {
      toast({
        title: 'No Images Uploaded',
        description: 'Please upload images before starting training.',
        variant: 'destructive',
      });
      return;
    }

    setIsTraining(true);

    try {
      const trainResponse = await trainModel({ ImageUrl: uploadedImageUrl });
      
      if (trainResponse.success) {
        toast({
          title: 'Training Started',
          description: 'Your model training has begun successfully.',
        });
      } else {
        throw new Error(trainResponse.message || 'Training failed to start');
      }
    } catch (error) {
      console.error('Training error:', error);
      toast({
        title: 'Training Failed',
        description: 'Failed to start model training. Please try again.',
        variant: 'destructive',
      });
      setIsTraining(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
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
              <Image className="h-5 w-5" style={{ color: '#17428c' }} />
              Training Images
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isTraining ? (
              <>
                {/* Upload Button */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Button
                      disabled={isUploading}
                      className="text-white font-semibold px-6 py-3"
                      style={{ background: `linear-gradient(to right, #17428c, #125597)` }}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {isUploading ? 'Uploading...' : 'Upload Images'}
                    </Button>
                  </div>
                </div>

                {/* Uploaded Images Preview */}
                {previewUrls.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium mb-3 text-gray-700">
                      Uploaded Images ({previewUrls.length} images)
                    </h4>
                    <div className="grid grid-cols-5 gap-4">
                      {previewUrls.map((url, index) => (
                        <div key={index} className="aspect-square">
                          <img
                            src={url}
                            alt={`Uploaded image ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg border-2 border-green-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload Status */}
                {uploadedFiles.length > 0 && (
                  <div className="p-4 rounded-lg border border-green-200" style={{ backgroundColor: 'rgba(34, 197, 94, 0.05)' }}>
                    <p className="text-sm text-green-700">
                      ✓ {uploadedFiles.length} images uploaded and ready for training
                    </p>
                  </div>
                )}

                <div className="p-4 rounded-lg border border-blue-200" style={{ backgroundColor: 'rgba(23, 66, 140, 0.05)' }}>
                  <h4 className="font-medium mb-2" style={{ color: '#17428c' }}>Training Requirements:</h4>
                  <ul className="text-sm space-y-1" style={{ color: '#125597' }}>
                    <li>• Upload 10-20 high-quality images</li>
                    <li>• Supported formats: JPG, PNG</li>
                    <li>• Training takes approximately 20 minutes</li>
                  </ul>
                </div>

                <Button
                  onClick={handleStartTraining}
                  disabled={!uploadedImageUrl}
                  className="w-full text-white font-semibold py-3"
                  style={{ background: `linear-gradient(to right, #17428c, #125597)` }}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Start Training Model
                </Button>
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
