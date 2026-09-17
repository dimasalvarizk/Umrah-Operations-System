import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { loginApi, getMeApi, logoutApi, type UserProfile } from '../services/authApi';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => void;
  updateUserProfile: (userData: UserProfile) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const savedUser = localStorage.getItem('umrah_auth_user') || sessionStorage.getItem('umrah_auth_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('umrah_auth_token') || sessionStorage.getItem('umrah_auth_token');
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Validate token on mount
  useEffect(() => {
    async function verifyUser() {
      if (token) {
        try {
          const res = await getMeApi(token);
          if (res.data?.user) {
            setUser(res.data.user);
            if (localStorage.getItem('umrah_auth_token')) {
              localStorage.setItem('umrah_auth_user', JSON.stringify(res.data.user));
            } else {
              sessionStorage.setItem('umrah_auth_user', JSON.stringify(res.data.user));
            }
          }
        } catch (err: any) {
          // If unauthorized or token invalid, purge and logout
          if (err?.status === 401 || err?.status === 403 || err?.message?.includes('jwt') || err?.message?.includes('token')) {
            logout();
          } else {
            console.warn('Backend verification unavailable, using persisted session:', err?.message || err);
          }
        }
      }
      setIsLoading(false);
    }

    verifyUser();
  }, [token]);

  // Sync logout across browser tabs in real time
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'umrah_auth_token' && !e.newValue) {
        setUser(null);
        setToken(null);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (email: string, password: string, rememberMe = false) => {
    const res = await loginApi(email, password);
    if (res.data) {
      const { user: userData, token: tokenData } = res.data;
      setUser(userData);
      setToken(tokenData);

      if (rememberMe) {
        localStorage.setItem('umrah_auth_token', tokenData);
        localStorage.setItem('umrah_auth_user', JSON.stringify(userData));
        sessionStorage.removeItem('umrah_auth_token');
        sessionStorage.removeItem('umrah_auth_user');
      } else {
        sessionStorage.setItem('umrah_auth_token', tokenData);
        sessionStorage.setItem('umrah_auth_user', JSON.stringify(userData));
        localStorage.removeItem('umrah_auth_token');
        localStorage.removeItem('umrah_auth_user');
      }
    }
  };

  const logout = () => {
    const currentToken = token || localStorage.getItem('umrah_auth_token') || sessionStorage.getItem('umrah_auth_token');

    // 1. Reset in-memory state
    setUser(null);
    setToken(null);

    // 2. Clear all authentication keys from all browser storages
    try {
      localStorage.removeItem('umrah_auth_token');
      localStorage.removeItem('umrah_auth_user');
      sessionStorage.removeItem('umrah_auth_token');
      sessionStorage.removeItem('umrah_auth_user');
      sessionStorage.removeItem('client_public_ip');

      // 3. Clear cached operational lists from storage
      const cachedKeys = [
        'umrah_groups_list',
        'umrah_trips_list',
        'umrah_hotels_list',
        'umrah_transports_list',
        'umrah_notes_list',
        'contracts_agreements_list',
      ];
      cachedKeys.forEach((key) => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });
    } catch (e) {
      console.warn('Storage purge error on logout:', e);
    }

    // 4. Notify backend of session end
    if (currentToken) {
      logoutApi(currentToken).catch(() => {});
    }
  };

  const updateUserProfile = (userData: UserProfile) => {
    setUser(userData);
    if (localStorage.getItem('umrah_auth_token')) {
      localStorage.setItem('umrah_auth_user', JSON.stringify(userData));
    } else {
      sessionStorage.setItem('umrah_auth_user', JSON.stringify(userData));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
