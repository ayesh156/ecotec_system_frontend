import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import {
  authService,
  onTokenChange,
  getAccessToken,
  setAccessToken,
  setRefreshToken,
  getRefreshToken,
  getCachedUser,
  setCachedUser,
} from '../services/authService';
import { clearAllCaches } from '../lib/persistentCache';
import type { 
  User, 
  LoginCredentials, 
  RegisterData,
} from '../services/authService';

// ===================================
// Type Definitions
// ===================================

interface AuthContextType {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  updateProfile: (data: { name?: string; email?: string }) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  clearError: () => void;
  refreshUser: () => Promise<void>;
  getAccessToken: () => string | null;
}

interface AuthProviderProps {
  children: ReactNode;
}

// ===================================
// Context Creation
// ===================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ===================================
// Auth Provider Component
// ===================================

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  // CRITICAL: Only show loading state on system routes.
  // Public routes must render instantly with zero loader flash.
  const isSystemPath = typeof window !== 'undefined' && window.location.pathname.startsWith('/system');
  const [isLoading, setIsLoading] = useState(isSystemPath);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = user !== null && getAccessToken() !== null;

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Handle logout event (from interceptor when session expires)
  useEffect(() => {
    const handleLogoutEvent = (event: CustomEvent<{ reason: string }>) => {
      console.log('🔒 Session expired, logging out...', event.detail.reason);
      setUser(null);
      setCachedUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      clearAllCaches();
    };

    window.addEventListener('auth:logout', handleLogoutEvent as EventListener);
    return () => {
      window.removeEventListener('auth:logout', handleLogoutEvent as EventListener);
    };
  }, []);

  // Sync token changes with state
  useEffect(() => {
    onTokenChange((token) => {
      if (!token) {
        console.log('🔑 Access token cleared');
      }
    });
  }, []);

  // Try to restore session on mount
  useEffect(() => {
    const restoreSession = async (): Promise<User | null> => {
      try {
        console.log('🔄 Attempting to restore session...');
        const restoredUser = await authService.restoreSession();
        if (restoredUser) {
          setUser(restoredUser);
          console.log('✅ Session restored for:', restoredUser.email);
          return restoredUser;
        } else {
          console.log('ℹ️ No active session');
          return null;
        }
      } catch (err) {
        console.log('ℹ️ No valid session found');
        return null;
      } finally {
        setIsLoading(false);
      }
    };

    // PUBLIC WEBSITE BYPASS: If user is on a public route (not /system/*),
    // skip session restoration entirely so public pages render instantly
    // without being blocked by POS workspace authentication loading.
    const pathname = window.location.pathname;
    const isSystemRoute = pathname.startsWith('/system');
    if (!isSystemRoute) {
      console.log('🌐 Public route detected, bypassing POS session restoration');
      setIsLoading(false);
      return;
    }

    // FAST PATH: Try instant restore from cache first
    const cachedUser = getCachedUser();
    const token = getAccessToken();
    if (cachedUser && token) {
      setUser(cachedUser);
      setIsLoading(false);
      console.log('⚡ Instant user restore from cache:', cachedUser.email);

      // Background: validate/refresh token if needed
      restoreSession().then(freshUser => {
        if (freshUser) {
          setUser(freshUser);
          setCachedUser(freshUser);
        } else {
          console.warn('⚠️ Background session restore failed, clearing stale user');
          setUser(null);
          setCachedUser(null);
          setAccessToken(null);
          setRefreshToken(null);
          clearAllCaches();
        }
      }).catch(() => {
        console.warn('⚠️ Background session restore threw, clearing stale user');
        setUser(null);
        setCachedUser(null);
        setAccessToken(null);
        setRefreshToken(null);
        clearAllCaches();
      });
    } else {
      restoreSession();
    }
  }, []);

  // Login
  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(credentials);
      setUser(response.data.user);
      setCachedUser(response.data.user);
      console.log('✅ Login successful:', response.data.user.email);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number; data?: { message?: string } }; code?: string };
      const status = axiosErr?.response?.status;
      if (status === 503 || status === 502 || (!axiosErr?.response && axiosErr?.code !== 'ERR_CANCELED')) {
        setError('Service is starting up. Please try again in a few seconds.');
      } else {
        const message = axiosErr?.response?.data?.message || 'Login failed. Please try again.';
        setError(message);
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Register
  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.register(data);
      setUser(response.data.user);
      setCachedUser(response.data.user);
      console.log('✅ Registration successful:', response.data.user.email);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      console.log('✅ Logout successful');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setCachedUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      clearAllCaches();
      setIsLoading(false);
    }
  }, []);

  // Logout from all devices
  const logoutAll = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logoutAll();
      console.log('✅ Logged out from all devices');
    } catch (err) {
      console.error('Logout all error:', err);
    } finally {
      setUser(null);
      setCachedUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      clearAllCaches();
      setIsLoading(false);
    }
  }, []);

  // Update profile
  const updateProfile = useCallback(async (data: { name?: string; email?: string }) => {
    setError(null);
    try {
      const response = await authService.updateProfile(data);
      setUser(response.data.user);
      setCachedUser(response.data.user);
      console.log('✅ Profile updated');
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Profile update failed.';
      setError(message);
      throw new Error(message);
    }
  }, []);

  // Change password
  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    setError(null);
    try {
      await authService.changePassword({ currentPassword, newPassword });
      setUser(null);
      setCachedUser(null);
      console.log('✅ Password changed, please login again');
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Password change failed.';
      setError(message);
      throw new Error(message);
    }
  }, []);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    try {
      const response = await authService.getMe();
      setUser(response.data.user);
      setCachedUser(response.data.user);
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    logoutAll,
    updateProfile,
    changePassword,
    clearError,
    refreshUser,
    getAccessToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ===================================
// Custom Hook
// ===================================

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// ===================================
// Higher-Order Component for Protected Routes
// ===================================

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: Array<'ADMIN' | 'MANAGER' | 'STAFF'>;
  fallback?: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRoles,
  fallback 
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Show loading spinner while checking auth
  if (isLoading) {
    const hasRefreshToken = !!getRefreshToken();
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 text-emerald-400">
            <svg className="animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-slate-400">{hasRefreshToken ? 'Restoring session...' : 'Loading...'}</p>
          {hasRefreshToken && (
            <p className="text-slate-500 text-sm mt-2">Server may be warming up, please wait...</p>
          )}
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    window.location.href = '/system/login';
    return null;
  }

  // Check role-based access
  if (requiredRoles && user && !requiredRoles.includes(user.role as any)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-slate-400">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthContext;