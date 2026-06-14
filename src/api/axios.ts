
///
import axios from "axios";
import { AccountInfo, PublicClientApplication } from "@azure/msal-browser";
import msalConfig from "../auth/msalConfig";


// Create MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);
msalInstance.initialize();

const apiClient = axios.create({
  baseURL: "https://mintyappp.greenglacier-d1b8f4d6.westus2.azurecontainerapps.io/api", // Replace with your backend base URL
});

// Token injection interceptor
apiClient.interceptors.request.use(async (config) => {
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length === 0) {
    throw new Error("No active Azure AD user account found.");
  }

  const account: AccountInfo = accounts[0];


  
  const response = await msalInstance.acquireTokenSilent({
    scopes: ["api://727ccc82-c83a-4048-9aa7-61c1bd53461a/access_as_user"],
    account,
  });

  config.headers.Authorization = `Bearer ${response.accessToken}`;
  return config;
});

export default apiClient;

