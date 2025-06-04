
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Building2 } from 'lucide-react';
import { LoginButton } from '@/auth/LoginButton';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { useNavigate, useLocation } from 'react-router-dom';

const LoginPage = () => {
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  
  console.log('LoginPage - Component loaded');
  console.log('LoginPage - Current path:', currentPath);
  console.log('LoginPage - isAuthenticated:', isAuthenticated);
  console.log('LoginPage - redirectPath in sessionStorage:', sessionStorage.getItem('redirectPath'));
  
  useEffect(() => {
    console.log('LoginPage useEffect - isAuthenticated:', isAuthenticated);
    console.log('LoginPage useEffect - Current redirectPath:', sessionStorage.getItem('redirectPath'));
    
    if (isAuthenticated) {
      // Check if there's a stored redirect path
      const redirectPath = sessionStorage.getItem('redirectPath');
      console.log('LoginPage - Retrieved redirectPath from sessionStorage:', redirectPath);
      
      if (redirectPath) {
        console.log('LoginPage - Found redirect path, clearing sessionStorage and navigating to:', redirectPath);
        // Don't remove the redirectPath until after successful navigation
        navigate(redirectPath);
        console.log('LoginPage - Navigation initiated to:', redirectPath);
        // Now clear it
        sessionStorage.removeItem('redirectPath');
        console.log('LoginPage - Cleared redirectPath from sessionStorage');
      } else {
        console.log('LoginPage - No redirect path found, navigating to /home');
        navigate('/home');
      }
    } else {
      // When still on login page and not authenticated, check for model path
      console.log('LoginPage - Not authenticated yet');
      
      // Check the current URL referrer for model path and store it
      const referrer = document.referrer;
      console.log('LoginPage - Document referrer:', referrer);
      
      // Also check the URL parameter if we have one
      const urlParams = new URLSearchParams(location.search);
      const fromPath = urlParams.get('from');
      console.log('LoginPage - From URL parameter:', fromPath);
      
      // Check if we need to set a redirect path
      if (
        (referrer && referrer.includes('/model/') && !sessionStorage.getItem('redirectPath')) ||
        (fromPath && fromPath.includes('/model/') && !sessionStorage.getItem('redirectPath'))
      ) {
        const pathToStore = fromPath || new URL(referrer).pathname;
        console.log('LoginPage - Setting redirectPath from referrer/param:', pathToStore);
        sessionStorage.setItem('redirectPath', pathToStore);
        console.log('LoginPage - After setting, redirectPath is:', sessionStorage.getItem('redirectPath'));
      }
      
      // Log all session storage items for debugging
      console.log('LoginPage - All sessionStorage items:');
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key) {
          console.log(`  - ${key}: ${sessionStorage.getItem(key)}`);
        }
      }
    }
  }, [isAuthenticated, navigate, location]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-8 pt-12">
          <div className="flex items-center justify-center mb-6">
            <img 
              src="https://www.ips-ag.com/wp-content/themes/ips-group-v1/images/ips-logo-no-claim.svg" 
              alt="IPS Logo" 
              className="h-12"
            />
          </div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#17428c' }}>
            FotoGen
          </h1>
          <div className="flex items-center justify-center gap-2 text-gray-600 mb-6">
            <Building2 className="h-4 w-4" />
            <span className="text-sm font-medium">IPS Enterprise</span>
          </div>
          <p className="text-gray-500 text-sm">
            AI-powered image generation platform
          </p>
        </CardHeader>
        
        <CardContent className="pb-12">
          <LoginButton />
          
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              Restricted to IPS group members only
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
