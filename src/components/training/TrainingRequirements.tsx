
import React from 'react';

export const TrainingRequirements = () => {
  return (
    <div className="p-4 rounded-lg border border-blue-200" style={{ backgroundColor: 'rgba(23, 66, 140, 0.05)' }}>
      <h4 className="font-medium mb-2" style={{ color: '#17428c' }}>Training Requirements:</h4>
      <ul className="text-sm space-y-1" style={{ color: '#125597' }}>
        <li>• Upload 10-20 high-quality images</li>
        <li>• Supported formats: JPG, PNG</li>
        <li>• Training takes approximately 20 minutes</li>
      </ul>
    </div>
  );
};
