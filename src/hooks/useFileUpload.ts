
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useFileUpload = () => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    setUploadedFiles(fileArray);
    
    const urls = fileArray.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
    
    toast({
      title: 'Images Selected',
      description: `${fileArray.length} images selected and ready for training.`,
    });
  };

  return {
    isUploading,
    uploadedFiles,
    previewUrls,
    handleFileUpload
  };
};
