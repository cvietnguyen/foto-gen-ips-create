
import React from 'react';
import { Clock, Mail, Loader2 } from 'lucide-react';
import { TrainingStep } from '@/hooks/useTraining';

interface TrainingProgressProps {
  currentStep: TrainingStep;
}

export const TrainingProgress: React.FC<TrainingProgressProps> = ({ currentStep }) => {
  return (
    <div className="text-center space-y-6">
      <div className="p-8 rounded-full w-32 h-32 mx-auto flex items-center justify-center" style={{ background: `linear-gradient(to right, rgba(23, 66, 140, 0.1), rgba(18, 85, 151, 0.1))` }}>
        {currentStep === 'upload' && (
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin" style={{ color: '#17428c' }} />
            <span className="text-xs mt-2" style={{ color: '#17428c' }}>Uploading...</span>
          </div>
        )}
        {currentStep === 'training' && (
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin" style={{ color: '#17428c' }} />
            <span className="text-xs mt-2" style={{ color: '#17428c' }}>Training...</span>
          </div>
        )}
        {currentStep === 'complete' && (
          <Clock className="h-12 w-12 animate-pulse" style={{ color: '#17428c' }} />
        )}
      </div>
      
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {currentStep === 'upload' && 'Uploading Your Images'}
          {currentStep === 'training' && 'Starting Model Training'}
          {currentStep === 'complete' && 'Your Model is Training'}
        </h3>
        <p className="text-gray-600 mb-4">
          {currentStep === 'upload' && 'Please wait while we upload your training images...'}
          {currentStep === 'training' && 'Initializing the training process...'}
          {currentStep === 'complete' && 'Your AI model training has started. This process takes approximately 20 minutes to complete.'}
        </p>
      </div>

      {currentStep === 'complete' && (
        <div className="p-4 rounded-lg border border-blue-200" style={{ backgroundColor: 'rgba(23, 66, 140, 0.05)' }}>
          <div className="flex items-center gap-2 justify-center" style={{ color: '#125597' }}>
            <Mail className="h-4 w-4" />
            <span className="text-sm">You will receive an email notification when training is complete</span>
          </div>
        </div>
      )}
    </div>
  );
};
