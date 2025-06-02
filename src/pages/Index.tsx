
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useDemoContext } from '@/contexts/DemoContext';

const Index = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useDemoContext();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      navigate('/home');
    }
  }, [isLoggedIn, navigate]);

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
