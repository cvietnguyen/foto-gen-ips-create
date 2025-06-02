
import { useState, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';

export interface User {
  name?: string;
  email?: string;
  displayName?: string;
  id?: string;
}

export const useUserData = () => {
  const { accounts } = useMsal();
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
    } else {
      setUser(null);
    }
  }, [accounts]);

  return { user };
};
