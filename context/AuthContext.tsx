import axios from "axios";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useState } from "react";

// 1. Define the shape of your context (the data and functions you'll share)
interface AuthProps {
  authState?: {
    token: string | null;
    authenticated: boolean | null;
    user: any | null;
  };
  onRegister?: (email: string, password: string, name: string) => Promise<any>;
  onLogin?: (email: string, password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
  isLoading?: boolean;
}

// 2. Create the Context
const AuthContext = createContext<AuthProps>({});

// 3. Define your API base URL (use a more robust config in production)
export const API_URL =
  process.env.BACKEND_BASE_URL || "http://192.168.1.167:5000";
console.log("API_URL configured as:", API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 4. Create the Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  console.log("=== AuthProvider Initializing ===");

  // State to hold authentication info
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
    user: any | null;
  }>({
    token: null,
    authenticated: null, // Start as null to indicate we haven't checked yet
    user: null,
  });

  const [isLoading, setIsLoading] = useState(true); // For initial loading screen

  // 5. Load token and user from SecureStore on startup (NO validation!)
  useEffect(() => {
    console.log("AuthProvider useEffect triggered");
    const loadToken = async () => {
      console.log("Loading token from storage...");
      setIsLoading(true);
      const token = await SecureStore.getItemAsync("token");
      const userFromStorage = await SecureStore.getItemAsync("user");

      console.log("Token from storage:", token ? "EXISTS" : "NULL");
      console.log("User from storage:", userFromStorage ? "EXISTS" : "NULL");

      if (token && userFromStorage) {
        // Set token in axios for future requests
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setAuthState({
          token: token,
          authenticated: true,
          user: JSON.parse(userFromStorage),
        });
      } else {
        setAuthState({
          token: null,
          authenticated: false,
          user: null,
        });
      }
      setIsLoading(false);
      console.log("Token loading completed");
    };

    loadToken();
  }, []);

  // 6. Login Function
  const login = async (email: string, password: string) => {
    console.log("=== Login Process Started ===");
    console.log("Login attempt for email:", email);
    try {
      const result = await api.post("/auth/login", { email, password });
      console.log("Login API response received");

      // Assuming your backend returns { token, user }
      const { token, user } = result.data;
      console.log("Login successful, token received:", token ? "YES" : "NO");

      // Update axios default headers and secure storage
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      await SecureStore.setItemAsync("token", token);
      await SecureStore.setItemAsync("user", JSON.stringify(user)); // Optional: store user info

      // Update context state
      setAuthState({
        token: token,
        authenticated: true,
        user: user,
      });

      console.log("Login process completed successfully");
      router.replace("/(app)/chats");
      return result; // Return the result in case the component needs it
    } catch (error) {
      console.error("Login failed:", error);
      console.error("Login error details:", (error as any).response?.data);
      setAuthState({
        token: null,
        authenticated: false,
        user: null,
      });
      return {
        error: true,
        msg: (error as any).response?.data?.message || "Login failed",
      };
    }
  };

  // 7. Register Function (that also logs the user in automatically)
  const register = async (email: string, password: string, name: string) => {
    console.log("=== Register Process Started ===");
    console.log("Registration attempt for:", {
      email,
      name,
      passwordLength: password.length,
    });
    try {
      console.log("Calling registration API...");
      // 1. Create the account
      const result = await api.post("/auth/register", {
        email,
        password,
        name,
      });

      console.log("Registration API response received:", result.status);
      console.log("Registration response data:", result.data);

      // 2. Assuming your backend returns the token and user on successful registration, log them in.
      const { token, user } = result.data;
      console.log(
        "Registration successful, token received:",
        token ? "YES" : "NO"
      );

      // 3. Store the token and user, update state (same as login)
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      await SecureStore.setItemAsync("token", token);
      await SecureStore.setItemAsync("user", JSON.stringify(user));

      setAuthState({
        token: token,
        authenticated: true,
        user: user,
      });

      console.log("Registration process completed successfully");
      return result;
    } catch (error) {
      console.error("Registration failed:", error);
      console.error(
        "Registration error details:",
        (error as any).response?.data
      );
      console.error(
        "Registration error status:",
        (error as any).response?.status
      );
      setAuthState({
        token: null,
        authenticated: false,
        user: null,
      });
      return {
        error: true,
        msg: (error as any).response?.data?.message || "Registration failed",
      };
    }
  };

  // 8. Logout Function
  const logout = async () => {
    console.log("=== Logout Process Started ===");
    // Clear everything from storage
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("user");

    // Update axios & context state
    delete api.defaults.headers.common["Authorization"];
    setAuthState({
      token: null,
      authenticated: false,
      user: null,
    });
    console.log("Logout completed");
  };

  // 9. Value provided to consuming components
  const value = {
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    authState,
    isLoading,
  };

  console.log("AuthProvider value being provided:", {
    onRegister: typeof register,
    onLogin: typeof login,
    onLogout: typeof logout,
    authState,
    isLoading,
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 10. Custom Hook to use the Auth context easily
export const useAuth = () => {
  const context = useContext(AuthContext);
  console.log("useAuth called, returning:", {
    onRegister: typeof context.onRegister,
    onLogin: typeof context.onLogin,
    onLogout: typeof context.onLogout,
    authState: context.authState,
    isLoading: context.isLoading,
  });
  return context;
};

// 11. Export the configured api instance for direct use if needed
export { api };

// Optional: Keep your original utility functions if other parts of the app need them
export const getToken = () => SecureStore.getItemAsync("token");
export const saveToken = (token: string) =>
  SecureStore.setItemAsync("token", token);
export const removeToken = () => SecureStore.deleteItemAsync("token");
