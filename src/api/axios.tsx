
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
    scopes: ["api://97d340b4-74c1-4b81-aa2c-9e25b61002df/access_as_user"],
    account,
  });

  config.headers.Authorization = `Bearer ${response.accessToken}`;
  return config;
});

export default apiClient;

