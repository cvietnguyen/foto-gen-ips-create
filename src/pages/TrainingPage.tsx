import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Clock, Mail, ArrowLeft, Image, Upload } from 'lucide-react';
import { useDemoContext } from '@/contexts/DemoContext';
import { uploadZipFile, trainModel } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';
import JSZip from 'jszip';

const TrainingPage = () => {
  const navigate = useNavigate();
  const { showDemoControls } = useDemoContext();
  const { toast } = useToast();
  const [isTraining, setIsTraining] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // Mock training images data
  const trainingImages = [
    { id: 1, src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face', alt: 'Training image 1' },
    { id: 2, src: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face', alt: 'Training image 2' },
    { id: 3, src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face', alt: 'Training image 3' },
    { id: 4, src: 'https://images.unsplash.com/photo-1500648741775-53994a69daeb?w=200&h=200&fit=crop&crop=face', alt: 'Training image 4' },
    { id: 5, src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face', alt: 'Training image 5' },
    { id: 6, src: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face', alt: 'Training image 6' },
    { id: 7, src: 'https://images.unsplash.com/photo-1519345182560-472988babdf9?w=200&h=200&fit=crop&crop=face', alt: 'Training image 7' },
    { id: 8, src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face', alt: 'Training image 8' },
    { id: 9, src: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=200&h=200&fit=crop&crop=face', alt: 'Training image 9' },
    { id: 10, src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face', alt: 'Training image 10' },
    { id: 11, src: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=200&h=200&fit=crop&crop=face', alt: 'Training image 11' },
    { id: 12, src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face', alt: 'Training image 12' },
    { id: 13, src: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=200&h=200&fit=crop&crop=face', alt: 'Training image 13' },
    { id: 14, src: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200&h=200&fit=crop&crop=face', alt: 'Training image 14' },
    { id: 15, src: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&h=200&fit=crop&crop=face', alt: 'Training image 15' },
  ];

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
              <Image className="h-5 w-5" style={{ color: '#17428c' }} />
              Training Images ({trainingImages.length} images)
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

                {/* Upload Status */}
                {uploadedFiles.length > 0 && (
                  <div className="p-4 rounded-lg border border-green-200" style={{ backgroundColor: 'rgba(34, 197, 94, 0.05)' }}>
                    <p className="text-sm text-green-700">
                      ✓ {uploadedFiles.length} images uploaded and ready for training
                    </p>
                  </div>
                )}

                {/* Images Grid */}
                <div className="grid grid-cols-5 gap-4">
                  {trainingImages.map((image) => (
                    <div key={image.id} className="aspect-square">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-colors"
                      />
                    </div>
                  ))}
                </div>

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
