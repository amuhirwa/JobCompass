import React, { createContext, useContext, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import api from "./api";
import type { User, LoginRequest, RegisterRequest } from "./types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<User>;
  logout: () => void;
  checkOnboardingStatus: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  const isAuthenticated = !!user;

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          const response = await api.getProfile();
          setUser(response.user);
        } catch (error) {
          // Token is invalid, remove it
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      await api.login(credentials);

      // Tokens are set in api.login, now get user profile
      const response = await api.getProfile();
      setUser(response.user);

      // Invalidate all queries to refresh data with authenticated user
      queryClient.invalidateQueries();
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: RegisterRequest): Promise<User> => {
    try {
      await api.register(userData);

      // After registration, get user profile
      const response = await api.getProfile();
      setUser(response.user);

      // Invalidate all queries
      queryClient.invalidateQueries();

      return response.user;
    } catch (error) {
      throw error;
    }
  };

  const checkOnboardingStatus = async (): Promise<boolean> => {
    try {
      const profile = await api.getUserProfile();
      return profile?.onboarding_completed || false;
    } catch (error) {
      console.error("Error checking onboarding status:", error);
      return false;
    }
  };

  const logout = () => {
    // Clear tokens
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    // Clear user state
    setUser(null);

    // Clear all cached data
    queryClient.clear();

    // Optionally redirect to login page
    // Navigate to home or login page here if using React Router
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    checkOnboardingStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
