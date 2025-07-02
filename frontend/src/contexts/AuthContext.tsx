import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: Partial<User> & { password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

// Auth context for managing user authentication state
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  token: null,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Mock user data for development
  const mockUser: User = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'demo@sistema-cloud.com',
    firstName: 'Demo',
    lastName: 'User',
    role: 'admin',
  };

  // Initialize state with stored auth data or null
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('token') ? true : false;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token') || null;
  });

  // Save auth state to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }

    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [user, token]);

  // Mock login function (would normally make API request)
  const login = async (email: string, password: string) => {
    // For development, accept any email/password and return mock data
    try {
      // Mock API response
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkRlbW8gVXNlciIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      
      setUser(mockUser);
      setToken(mockToken);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Invalid credentials' };
    }
  };

  // Mock register function
  const register = async (userData: Partial<User> & { password: string }) => {
    try {
      // In a real app, this would send data to the API
      setUser(mockUser);
      setToken('mock-token');
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  // Create value object with all auth-related data and functions
  const value = {
    user,
    isAuthenticated,
    token,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
