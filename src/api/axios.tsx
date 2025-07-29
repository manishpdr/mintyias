

// src/axiosInstance.js
import axios from "axios";
import { PublicClientApplication } from "@azure/msal-browser";
import msalConfig from "../msalConfig";

// Create MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

 const loginRequest = {
  scopes: ["api://f333d102-c9c9-4434-9f07-635eecff69a6/access_as_user"], // Or MS Graph scopes
};
// Create Axios instance
const axiosInstance = axios.create({
  baseURL: "https://mintyapi-a6euhmhxe4dme7du.centralindia-01.azurewebsites.net", // change to your API base URL
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    const accounts = msalInstance.getAllAccounts();
    msalInstance.loginRedirect(loginRequest);
    if (accounts.length > 0) {
      try {
        const response = await msalInstance.acquireTokenSilent({
          ...loginRequest,
          account: accounts[0],
        });
        config.headers.Authorization = `Bearer ${response.accessToken}`;
      } catch (error) {
        console.error("Token acquisition failed", error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;

