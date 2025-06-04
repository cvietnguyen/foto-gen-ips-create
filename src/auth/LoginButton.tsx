
import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "./authConfig";
import { Button } from '@/components/ui/button';

export const LoginButton = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();

  const handleLogin = () => {
    instance.loginPopup(loginRequest)
      .then(() => {
        // Check if there's a stored redirect path
        const redirectPath = sessionStorage.getItem('redirectPath');
        if (redirectPath) {
          sessionStorage.removeItem('redirectPath'); // Clear stored path
          navigate(redirectPath);
        } else {
          // Regular flow - redirect to home page
          navigate('/home');
        }
      })
      .catch((e) => {
        console.error(e);
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
