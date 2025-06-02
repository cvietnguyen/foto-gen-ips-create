
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";
import { Button } from '@/components/ui/button';

export const LoginButton = () => {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginPopup(loginRequest).catch((e) => {
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
