
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, UserRole } from '@/types';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
};

const defaultUser: User = {
  id: '1',
  name: 'Admin User',
  email: 'admin@groceryflow.com',
  role: 'admin' as UserRole,
  permissions: [
    'inventory.view', 'inventory.edit',
    'sales.view', 'sales.edit',
    'purchase.view', 'purchase.edit',
    'vendors.view', 'vendors.edit',
    'customers.view', 'customers.edit',
    'delivery.view', 'delivery.edit',
    'rider.view', 'rider.edit',
    'accounting.view', 'accounting.edit',
    'reports.view',
    'settings.view', 'settings.edit',
    'users.view', 'users.edit'
  ],
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  isAuthenticated: false,
  hasPermission: () => false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real app, we would check for an existing session/token
        // For now, simulate loading and set demo user after a delay
        setTimeout(() => {
          setUser(defaultUser);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For demo purposes, any email/password works
      setUser(defaultUser);
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    // In a real app, also clear tokens, cookies, etc.
  };

  const hasPermission = (permission: string) => {
    if (!user) return false;
    return user.permissions.includes(permission as any);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
