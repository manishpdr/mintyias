import React, { useState, useEffect, useCallback } from 'react';
import { PublicClientApplication, AccountInfo, AuthenticationResult } from '@azure/msal-browser';
import { MsalProvider, useMsal } from '@azure/msal-react';
import msalConfig from './msalConfig';
import { jwtDecode } from 'jwt-decode';

// Define the types for the decoded JWT token
interface DecodedToken {
  groups: string[];  // Groups the user belongs to
  [key: string]: any;  // Other potential claims
}

// Group ID of the target group you want to check against
const targetGroupId = '2e274a86-35e3-456a-b9c6-fdf493d2c7cf';  // Replace with the actual Azure AD Group ID

const msalInstance = new PublicClientApplication(msalConfig);

const App: React.FC = () => {
  const { accounts, instance } = useMsal();
  const [user, setUser] = useState<AccountInfo | null>(null);
  const [groups, setGroups] = useState<string[]>([]);
  
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);


  const getUserGroups = useCallback((account: AccountInfo) => {
    const idToken = account.idToken!!;
    const decodedToken: DecodedToken = jwtDecode(idToken);  // Decode the ID token to extract claims

    const userGroups = decodedToken.groups || [];  // Extract the group IDs
    setGroups(userGroups);
    checkGroupAuthorization(userGroups);  // Check if the user belongs to the target group
  },[]);
  // Check if the user is part of the target group
  useEffect(() => {
    if (accounts.length > 0) {
      const account = accounts[0];
      setUser(account);
      getUserGroups(account);  // Get user's groups after authentication
    }
  }, [accounts,getUserGroups]);

  // Sign-in function
  const signIn = async () => {
    try {
      const response: AuthenticationResult = await instance.loginPopup();
      setUser(response.account);
      getUserGroups(response.account);  // Fetch user's groups after login
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  // Get user's groups from the decoded ID token
  

  // Check if the user is a member of the target group
  const checkGroupAuthorization = (userGroups: string[]) => {
    if (userGroups.includes(targetGroupId)) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }
  };

  return (
    <div>
      <h1>Azure AD Group Membership Check</h1>
      {user ? (
        <div>
          <p>Welcome, {user.name}</p>
          <p>Groups: {groups.length > 0 ? groups.join(', ') : 'No groups found'}</p>
          {isAuthorized ? (
           <App></App>
          ) : (
            <p>You are not authorized to access this section.</p>
          )}
        </div>
      ) : (
        <button onClick={signIn}>Sign In</button>
      )}
    </div>
  );
};

// Wrap the app with MsalProvider
const Main: React.FC = () => (
  <MsalProvider instance={msalInstance}>
   {<App />}
  </MsalProvider>
);

export default Main;
