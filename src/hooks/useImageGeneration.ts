
import { useState } from 'react';
import { generatePhoto } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';

interface ModelInfo {
  id: string;
  ownerName: string;
  isOwnedByUser: boolean;
}

export const useImageGeneration = (modelInfo: ModelInfo | null) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const { toast } = useToast();

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

  return {
    prompt,
    setPrompt,
    isGenerating,
    generatedImage,
    handleGenerate
  };
};
