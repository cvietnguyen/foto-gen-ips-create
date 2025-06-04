
import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "./authConfig";
import { Button } from '@/components/ui/button';

export const LoginButton = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();

  const handleLogin = () => {
    console.log('LoginButton - Starting login process');
    console.log('LoginButton - Current redirectPath in sessionStorage:', sessionStorage.getItem('redirectPath'));
    
    instance.loginPopup(loginRequest)
      .then(() => {
        // Check if there's a stored redirect path
        const redirectPath = sessionStorage.getItem('redirectPath');
        console.log('LoginButton - After login, redirectPath from sessionStorage:', redirectPath);
        
        if (redirectPath) {
          console.log('LoginButton - Found redirect path, navigating to:', redirectPath);
          sessionStorage.removeItem('redirectPath'); // Clear stored path
          navigate(redirectPath);
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
