import React, { useState, useEffect, useCallback } from 'react';
import { PublicClientApplication, AccountInfo, AuthenticationResult } from '@azure/msal-browser';
import { MsalProvider, useMsal } from '@azure/msal-react';
import { Provider } from 'react-redux';
import msalConfig from './auth/msalConfig';
import { store } from './state/store/store';
import { jwtDecode } from 'jwt-decode';
import AppRoutes from './routes/approutes';
import './App.css';

// Define the types for the decoded JWT token
interface DecodedToken {
  groups: string[];
  [key: string]: any;
}

// Group ID of the target group you want to check against
const targetGroupId = '2e274a86-35e3-456a-b9c6-fdf493d2c7cf';

const msalInstance = new PublicClientApplication(msalConfig);

const AppContent: React.FC = () => {
  const { accounts, instance } = useMsal();
  const [user, setUser] = useState<AccountInfo | null>(null);
  const [groups, setGroups] = useState<string[]>([]);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

  const getUserGroups = useCallback((account: AccountInfo) => {
    const idToken = account.idToken!!;
    const decodedToken: DecodedToken = jwtDecode(idToken);
    const userGroups = decodedToken.groups || [];
    setGroups(userGroups);
    checkGroupAuthorization(userGroups);
  }, []);

  useEffect(() => {
    if (accounts.length > 0) {
      const account = accounts[0];
      setUser(account);
      getUserGroups(account);
    }
  }, [accounts, getUserGroups]);

  const signIn = async () => {
    try {
      const response: AuthenticationResult = await instance.loginPopup();
      setUser(response.account);
      getUserGroups(response.account);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const signOut = async () => {
    try {
      await instance.logoutPopup();
      setUser(null);
      setIsAuthorized(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const checkGroupAuthorization = (userGroups: string[]) => {
    if (userGroups.includes(targetGroupId)) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(true); // Allow access for demo purposes
    }
  };

  if (!user) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h1>👨‍👩‍👧‍👦 FamilyHub</h1>
          <p>Welcome to Family Management Application</p>
          <button className="btn btn-primary" onClick={signIn}>
            Sign In with Microsoft
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <AppRoutes />
      <footer className="app-footer">
        <p>Logged in as: {user.name}</p>
        <button className="btn btn-secondary" onClick={signOut}>
          Sign Out
        </button>
      </footer>
    </div>
  );
};

// Wrap the app with MsalProvider and Redux Provider
const Main: React.FC = () => (
  <MsalProvider instance={msalInstance}>
    <Provider store={store}>
      <AppContent />
    </Provider>
  </MsalProvider>
);

export default Main;
