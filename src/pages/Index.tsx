
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // For now, just redirect to login page
    navigate('/login');
  }, [navigate]);

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading...</h1>
          <p className="text-gray-600">Redirecting you to the appropriate page</p>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
