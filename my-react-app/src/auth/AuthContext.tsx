import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  clearSession,
  loadSession,
  saveSession as persistSession,
  type AuthSession,
} from './authStorage';

interface AuthContextValue {
  token: string | null;
  userId: string | null;
  email: string | null;
  name: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  saveSession: (session: AuthSession) => void;
  logout: () => void;
  getAuthHeaders: () => Record<string, string>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setSession(loadSession());
    setIsLoading(false);
  }, []);

  const saveSession = useCallback((nextSession: AuthSession) => {
    persistSession(nextSession);
    setSession(nextSession);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setSession(null);
  }, []);

  const getAuthHeaders = useCallback((): Record<string, string> => {
    if (!session?.token) {
      return {};
    }

    return {
      Authorization: `Bearer ${session.token}`,
    };
  }, [session?.token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      token: session?.token ?? null,
      userId: session?.userId ?? null,
      email: session?.email ?? null,
      name: session?.name ?? null,
      isAuthenticated: Boolean(session?.token && session?.userId),
      isLoading,
      saveSession,
      logout,
      getAuthHeaders,
    }),
    [session, isLoading, saveSession, logout, getAuthHeaders],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
