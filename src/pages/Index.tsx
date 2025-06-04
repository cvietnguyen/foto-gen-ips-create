
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

    if (!isAuthenticated) {
      // Store the intended path if it's a model path
      if (isModelPath) {
        console.log('Index.tsx - Storing model path in sessionStorage:', path);
        console.log('Index.tsx - SessionStorage before storing:', sessionStorage.getItem('redirectPath'));
        // Make sure to store the path with the full URL
        sessionStorage.setItem('redirectPath', path);
        console.log('Index.tsx - SessionStorage after storing:', sessionStorage.getItem('redirectPath'));
      }
      console.log('Index.tsx - Not authenticated, redirecting to /login');
      navigate('/login');
      return;
    }

    // User is authenticated
    if (isModelPath) {
      console.log('Index.tsx - Authenticated user on model path, staying on current route - NO REDIRECT');
      // Keep the original path to preserve model info - don't redirect to /home
      return;
    } else if (path === '/') {
      console.log('Index.tsx - On root path, redirecting to /home');
      // Only redirect to home if we're on the root path
      navigate('/home');
    }
    // If we're already on /home or other paths, don't redirect
  }, [navigate, isAuthenticated, path]);

  // If authenticated and on a model path, don't show loading - let the route handle it
  if (isAuthenticated && path.includes('/model/')) {
    console.log('Index.tsx - Returning null for model path');
    return null;
  }

  // If authenticated and on home, don't show loading
  if (isAuthenticated && path === '/home') {
    console.log('Index.tsx - Returning null for home path');
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
