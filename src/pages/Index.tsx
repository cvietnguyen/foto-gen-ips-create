
import React, { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useIsAuthenticated } from '@azure/msal-react';
import Layout from '@/components/Layout';
import HomePage from './HomePage';

const Index = () => {
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const location = useLocation();
  const path = location.pathname;

  console.log('Index.tsx - Current path:', path);
  console.log('Index.tsx - isAuthenticated:', isAuthenticated);
  console.log('Index.tsx - sessionStorage before any logic:', sessionStorage.getItem('redirectPath'));

  useEffect(() => {
    console.log('Index.tsx useEffect - path:', path, 'isAuthenticated:', isAuthenticated);
    
    // Check if URL path contains '/model/'
    const isModelPath = path.includes('/model/');
    console.log('Index.tsx - isModelPath:', isModelPath);

    if (!isAuthenticated) {
      // Store the intended path if it's a model path
      if (isModelPath) {
        console.log('Index.tsx - User not authenticated, storing model path in sessionStorage:', path);
        console.log('Index.tsx - SessionStorage before storing:', sessionStorage.getItem('redirectPath'));
        
        // Always set the redirectPath for model paths, overwrite any existing value
        sessionStorage.setItem('redirectPath', path);
        console.log('Index.tsx - SessionStorage after storing:', sessionStorage.getItem('redirectPath'));

        // Log all session storage items for debugging
        console.log('Index.tsx - All sessionStorage items after storing:');
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key) {
            console.log(`  - ${key}: ${sessionStorage.getItem(key)}`);
          }
        }

        // Add a small delay to ensure sessionStorage is updated before navigating
        setTimeout(() => {
          console.log('Index.tsx - After delay, redirectPath before navigate:', sessionStorage.getItem('redirectPath'));
          navigate('/login');
          console.log('Index.tsx - Navigated to /login from model path');
        }, 200);
      } else {
        console.log('Index.tsx - Not authenticated, redirecting to /login from non-model path');
        navigate('/login');
      }
      return;
    }

    // User is authenticated
    if (isModelPath) {
      console.log('Index.tsx - Authenticated user on model path, will render HomePage component');
      // Don't redirect, let the component render HomePage
      return;
    } else if (path === '/') {
      console.log('Index.tsx - On root path, redirecting to /home');
      // Only redirect to home if we're on the root path
      navigate('/home');
    }
    // If we're already on /home or other paths, don't redirect
  }, [navigate, isAuthenticated, path]);

  // If authenticated and on a model path, render HomePage
  if (isAuthenticated && path.includes('/model/')) {
    console.log('Index.tsx - Rendering HomePage for authenticated user on model path');
    return <HomePage />;
  }

  // If authenticated and on home, redirect to /home route
  if (isAuthenticated && path === '/home') {
    console.log('Index.tsx - Returning null for authenticated user on home path');
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
