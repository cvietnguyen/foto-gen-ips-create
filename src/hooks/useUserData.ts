
import { useState, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { setAuthToken } from '@/services/apiService';

export interface User {
  name?: string;
  email?: string;
  displayName?: string;
  id?: string;
}

export const useUserData = () => {
  const { accounts, instance } = useMsal();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (accounts && accounts.length > 0) {
      const account = accounts[0];
      const email = (account.idTokenClaims?.email as string) || account.username;
      const id = account.idTokenClaims?.oid as string;
      
      setUser({
        name: account.name,
        email: email,
        displayName: account.name,
        id: id
      });

      // Get and store the access token
      instance.acquireTokenSilent({
        scopes: ["openid", "profile", "email"],
        account: account
      }).then((response) => {
        setAuthToken(response.accessToken);
        console.log('JWT token stored for API calls');
      }).catch((error) => {
        console.error('Error acquiring token:', error);
      });
    } else {
      setUser(null);
    }
  }, [accounts, instance]);

  return { user };
};
