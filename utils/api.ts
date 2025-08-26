import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API_URL = process.env.BACKEND_BASE_URL;

// Create a configured axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to get the saved token
const getToken = async () => {
  return await SecureStore.getItemAsync("access_token");
};

// Function to save the token after login
const saveToken = async (token: string) => {
  await SecureStore.setItemAsync("access_token", token);
};

// Function to remove the token on logout
const removeToken = async () => {
  await SecureStore.deleteItemAsync("access_token");
};

// Add a request interceptor
// This runs before every request. We use it to add the token to the header.
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
// This checks for 401 Unauthorized errors and logs the user out.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid/expired, log the user out
      removeToken();
      // You might want to redirect to the login screen here
      // e.g., navigation.navigate('Login');
    }
    return Promise.reject(error);
  }
);

// Export all the functions
export { api, getToken, removeToken, saveToken };
