

// src/axiosInstance.js
import axios from "axios";
import { PublicClientApplication } from "@azure/msal-browser";
import msalConfig from "../msalConfig";

// Create MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);


// Create Axios instance
const axiosInstance = axios.create({
  baseURL: "https://mintyapi-a6euhmhxe4dme7du.centralindia-01.azurewebsites.net", // change to your API base URL
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
      try {
          const token = await msalInstance.acquireTokenSilent({ scopes: ["api://1a10c311-55bf-433e-909b-3ed772aa6d0a/access_as_user"] });
        config.headers.Authorization = `Bearer ${token.accessToken}`;
      
      } catch (error) {
        console.error("Token acquisition failed", error);
      }
    
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;

