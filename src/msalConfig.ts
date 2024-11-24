import { Configuration } from '@azure/msal-browser';

const msalConfig = {
  auth: {
    clientId: 'f333d102-c9c9-4434-9f07-635eecff69a6',  // Replace with your Azure AD app's Client ID
    authority: 'https://login.microsoftonline.com/00e0add0-dc68-40a9-a6a1-019cbcf740b8',  // Replace with your Azure AD Tenant ID
    redirectUri: 'http://localhost:3000',  // URI where the app redirects after login
  },
  cache: {
    cacheLocation: 'sessionStorage',  // 'localStorage' if you need persistent sessions
    storeAuthStateInCookie: false,  // Set to true for IE11 support
  },
};

export default msalConfig;
