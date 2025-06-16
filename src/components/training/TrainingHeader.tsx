
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const TrainingHeader = () => {
  const navigate = useNavigate();

  return (
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
  );
};
