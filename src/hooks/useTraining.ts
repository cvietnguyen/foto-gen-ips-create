
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';
import JSZip from 'jszip';

export type TrainingStep = 'upload' | 'training' | 'complete';

export const useTraining = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { uploadZipFile, trainModel } = useApi();
  
  const [isTraining, setIsTraining] = useState(false);
  const [currentStep, setCurrentStep] = useState<TrainingStep>('upload');

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

  const handleStartTraining = async (uploadedFiles: File[]) => {
    if (!uploadedFiles || uploadedFiles.length === 0) {
      toast({
        title: 'No Images Selected',
        description: 'Please select images before starting training.',
        variant: 'destructive',
      });
      return;
    }

    setIsTraining(true);

    try {
      // Step 1: Upload files
      setCurrentStep('upload');
      const modelId = generateModelId();
      console.log('Generated model ID:', modelId);

      const zipFile = await createZipFile(uploadedFiles, modelId);
      console.log('Created zip file:', zipFile);

      const uploadResponse = await uploadZipFile(zipFile, modelId);
      
      if (!uploadResponse.success) {
        throw new Error(uploadResponse.message || 'Upload failed');
      }

      toast({
        title: 'Upload Successful',
        description: `${uploadedFiles.length} images uploaded successfully.`,
      });

      // Step 2: Start training
      setCurrentStep('training');
      const trainResponse = await trainModel({ imageUrl: uploadResponse.url });
      
      if (trainResponse.success) {
        setCurrentStep('complete');
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
      setCurrentStep('upload');
    }
  };

  return {
    isTraining,
    currentStep,
    handleStartTraining
  };
};
