import React, { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useIsAuthenticated } from '@azure/msal-react';
import Layout from '@/components/Layout';

const Index = () => {
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const location = useLocation();
  const path = location.pathname;

  console.log('Index.tsx - Current path:', path);
  console.log('Index.tsx - isAuthenticated:', isAuthenticated);

  useEffect(() => {
    console.log('Index.tsx useEffect - path:', path, 'isAuthenticated:', isAuthenticated);
    
    // Check if URL path contains '/model/'
    const isModelPath = path.includes('/model/');
    console.log('Index.tsx - isModelPath:', isModelPath);

    if (isAuthenticated) {
      if (isModelPath) {
        console.log('Index.tsx - Detected model path, staying on current route');
        // Keep the original path to preserve model info - don't redirect to /home
        // The HomePage component will handle the model path directly
        return;
      } else {
        console.log('Index.tsx - Regular path, redirecting to /home');
        // Regular flow - redirect to home page
        navigate('/home');
      }
    } else {
      // Store the intended path if it's a model path
      if (isModelPath) {
        console.log('Index.tsx - Storing model path in sessionStorage:', path);
        sessionStorage.setItem('redirectPath', path);
      }
      console.log('Index.tsx - Not authenticated, redirecting to /login');
      // If user is not authenticated, redirect to login page
      navigate('/login');
    }
  }, [navigate, isAuthenticated, path]);

  // If authenticated and on a model path, don't show loading - let the route handle it
  if (isAuthenticated && path.includes('/model/')) {
    console.log('Index.tsx - Returning null for model path');
    return null;
  }

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
