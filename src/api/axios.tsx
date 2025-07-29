

// src/axiosInstance.js
import axios from "axios";
import { PublicClientApplication } from "@azure/msal-browser";
import msalConfig from "../msalConfig";
import { useMsal } from "@azure/msal-react";

// Create MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);
msalInstance.initialize();

  const { instance, accounts } = useMsal();
// Create Axios instance
const axiosInstance = axios.create({
  baseURL: "https://mintyapi-a6euhmhxe4dme7du.canadacentral-01.azurewebsites.net", // change to your API base URL
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
      try {
           msalInstance.acquireTokenSilent({
          account: accounts[0],
          scopes: ["api://5254975b-cbe7-41a9-9879-e42593962bb5/access-as-user"],
        })
        .then((response) => {
           config.headers.Authorization = `Bearer ${response.accessToken}`;
          console.log("Bearer Token: ", response.accessToken);
        });
       
      
      } catch (error) {
        console.error("Token acquisition failed", error);
      }
    
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;

