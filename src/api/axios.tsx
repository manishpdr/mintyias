
///
import axios from "axios";
import { AccountInfo, PublicClientApplication } from "@azure/msal-browser";
import msalConfig from "../msalConfig";


// Create MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);
msalInstance.initialize();

const apiClient = axios.create({
  baseURL: "https://mintyapi-a6euhmhxe4dme7du.canadacentral-01.azurewebsites.net", // Replace with your backend base URL
});

// Token injection interceptor
apiClient.interceptors.request.use(async (config) => {
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length === 0) {
    throw new Error("No active Azure AD user account found.");
  }

  const account: AccountInfo = accounts[0];

  const response = await msalInstance.acquireTokenSilent({
    scopes: ["api://1a10c311-55bf-433e-909b-3ed772aa6d0a/AdminUser"],
    account,
  });

  config.headers.Authorization = `Bearer ${response.accessToken}`;
  return config;
});

export default apiClient;

