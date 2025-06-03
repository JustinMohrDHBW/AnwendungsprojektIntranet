import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import * as authApi from '../api/auth';
import type { User } from '../api/auth';

interface AuthContextType {
  isLoggedIn: boolean;
  currentUser: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  hasPermission: (userId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Local storage keys
const STORAGE_KEY = 'auth_state';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial state from localStorage and verify with server
  useEffect(() => {
    const initAuth = async () => {
      try {
        // First check localStorage
        const storedAuth = localStorage.getItem(STORAGE_KEY);
        if (storedAuth) {
          const parsedAuth = JSON.parse(storedAuth);
          setCurrentUser(parsedAuth.user);
          setIsLoggedIn(true);
        }

        // Verify with server
        const user = await authApi.getCurrentUser();
        if (user) {
          setCurrentUser(user);
          setIsLoggedIn(true);
          // Update localStorage with latest data
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ user }));
        } else {
          // Clear localStorage if server check fails
          localStorage.removeItem(STORAGE_KEY);
          setCurrentUser(null);
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Failed to get current user:', error);
        // Clear localStorage on error
        localStorage.removeItem(STORAGE_KEY);
        setCurrentUser(null);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const user = await authApi.login(username, password);
      setCurrentUser(user);
      setIsLoggedIn(true);
      // Store in localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user }));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      // Clear localStorage
      localStorage.removeItem(STORAGE_KEY);
      setIsLoggedIn(false);
      setCurrentUser(null);
    }
  };

  const hasPermission = (userId: string): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true;
    return currentUser.id === userId;
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, currentUser, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 