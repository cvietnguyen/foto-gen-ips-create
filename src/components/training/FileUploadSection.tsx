
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload } from 'lucide-react';

interface FileUploadSectionProps {
  isUploading: boolean;
  uploadedFiles: File[];
  previewUrls: string[];
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  isUploading,
  uploadedFiles,
  previewUrls,
  onFileUpload
}) => {
  return (
    <>
      {/* Upload Button */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <Input
            type="file"
            multiple
            accept="image/*"
            onChange={onFileUpload}
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
            Selected Images ({previewUrls.length} images)
          </h4>
          <div className="grid grid-cols-5 gap-4">
            {previewUrls.map((url, index) => (
              <div key={index} className="aspect-square">
                <img
                  src={url}
                  alt={`Selected image ${index + 1}`}
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
            ✓ {uploadedFiles.length} images selected and ready for training
          </p>
        </div>
      )}
    </>
  );
};
