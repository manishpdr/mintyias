

// src/axiosInstance.js
import axios from "axios";
import { PublicClientApplication } from "@azure/msal-browser";
import msalConfig from "../msalConfig";

// Create MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);
msalInstance.initialize();


// Create Axios instance
const axiosInstance = axios.create({
  baseURL: "https://mintyapi-a6euhmhxe4dme7du.canadacentral-01.azurewebsites.net", // change to your API base URL
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
      try {
          const token = await msalInstance.acquireTokenSilent({ scopes: ["api://5254975b-cbe7-41a9-9879-e42593962bb5/access-as-user"] });
        config.headers.Authorization = `Bearer ${token.accessToken}`;
      
      } catch (error) {
        console.error("Token acquisition failed", error);
      }
    
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;

