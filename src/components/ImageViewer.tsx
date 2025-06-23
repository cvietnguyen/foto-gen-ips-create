
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageViewerProps {
  src: string;
  alt: string;
  className?: string;
}

export const ImageViewer = ({ src, alt, className = "" }: ImageViewerProps) => {
  const [zoom, setZoom] = useState(100);
  const { toast } = useToast();

  const handleZoomIn = () => {
    if (zoom < 200) {
      setZoom(prev => Math.min(prev + 25, 200));
    }
  };

  const handleZoomOut = () => {
    if (zoom > 50) {
      setZoom(prev => Math.max(prev - 25, 50));
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Success',
        description: 'Image downloaded successfully!',
      });
    } catch (error) {
      console.error('Error downloading image:', error);
      toast({
        title: 'Download Failed',
        description: 'Failed to download image. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute top-2 right-2 z-10 flex gap-1">
        <Button
          size="sm"
          variant="secondary"
          onClick={handleZoomOut}
          disabled={zoom <= 50}
          className="h-8 w-8 p-0"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={handleZoomIn}
          disabled={zoom >= 200}
          className="h-8 w-8 p-0"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={handleDownload}
          className="h-8 w-8 p-0"
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="overflow-auto max-h-full">
        <img 
          src={src} 
          alt={alt}
          className="w-full h-full object-cover rounded-lg transition-transform duration-200"
          style={{ 
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'center'
          }}
        />
      </div>
      
      <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
        {zoom}%
      </div>
    </div>
  );
};
