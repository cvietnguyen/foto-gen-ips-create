
import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "./authConfig";
import { Button } from '@/components/ui/button';

export const LoginButton = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();

  const handleLogin = () => {
    console.log('LoginButton - Starting login process');
    
    // Store the current URL path in sessionStorage before login if not already set
    const currentPath = window.location.pathname;
    console.log('LoginButton - Current path:', currentPath);
    
    if (currentPath.includes('/model/')) {
      console.log('LoginButton - Found model path, setting redirectPath');
      // Always set the redirectPath for model paths, overwrite any existing value
      sessionStorage.setItem('redirectPath', currentPath);
      console.log('LoginButton - Set redirectPath to:', currentPath);
    }
    
    console.log('LoginButton - Current redirectPath in sessionStorage:', sessionStorage.getItem('redirectPath'));
    
    instance.loginPopup(loginRequest)
      .then(() => {
        // Check if there's a stored redirect path
        const redirectPath = sessionStorage.getItem('redirectPath');
        console.log('LoginButton - After login, redirectPath from sessionStorage:', redirectPath);
        
        if (redirectPath) {
          console.log('LoginButton - Found redirect path, navigating to:', redirectPath);
          // Don't remove the redirectPath until after successful navigation
          navigate(redirectPath);
          console.log('LoginButton - Navigation initiated to:', redirectPath);
          // Now clear it after navigation is initiated
          sessionStorage.removeItem('redirectPath');
          console.log('LoginButton - Cleared redirectPath from sessionStorage');
        } else {
          console.log('LoginButton - No redirect path found, navigating to /home');
          navigate('/home');
        }
      })
      .catch((e) => {
        console.error('LoginButton - Login error:', e);
      });
  };

  return (
    <Button 
      onClick={handleLogin}
      className="w-full text-white font-semibold py-6 text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
      style={{ background: `linear-gradient(to right, #17428c, #125597)` }}
    >
      Sign in with Azure AD
    </Button>
  );
};
