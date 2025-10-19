/** @format */

import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { read, write, remove } from '../utils/cookieStorage';
import { api } from '../api/apiClient';
import { AuthContextType, AuthData } from '../types';

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<AuthData | null>(() => {
    const saved = read('auth');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleRefresh = useCallback((expiresAt: number) => {
    if (refreshTimer.current) clearTimeout(refreshTimer.current);
    const now = Date.now();
    const refreshTime = expiresAt - now - 60 * 1000;

    if (refreshTime > 0) {
      refreshTimer.current = setTimeout(async () => {
        console.log('[Auth] Refreshing token...');
        await extendSession();
      }, refreshTime);
    }
  }, []);

  useEffect(() => {
    if (auth?.expiresAt) scheduleRefresh(auth.expiresAt);
    return () => {
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
    };
  }, [auth, scheduleRefresh]);

  const login = useCallback(
    async ({ username, password, expiresInMins = 30 }) => {
      setLoading(true);
      try {
        const res = await api.post('/auth/login', { username, password });

        const { accessToken, refreshToken, ...user } = res.data;
        const expiresAt = Date.now() + expiresInMins * 60 * 1000;

        const newAuth: AuthData = {
          user,
          accessToken,
          refreshToken,
          expiresAt,
        };
        setAuth(newAuth);

        write('auth', JSON.stringify(newAuth));
        write('accessToken', accessToken);
        write('refreshToken', refreshToken);

        scheduleRefresh(expiresAt);
        setLoading(false);
        return { ok: true };
      } catch (err: any) {
        setLoading(false);
        return { ok: false, error: err?.response?.data || err.message };
      }
    },
    [scheduleRefresh]
  );

  const logout = useCallback(() => {
    if (refreshTimer.current) clearTimeout(refreshTimer.current);
    setAuth(null);
    remove('auth');
    remove('accessToken');
    remove('refreshToken');
  }, []);

  const extendSession = useCallback(async (): Promise<boolean> => {
    if (!auth?.refreshToken) {
      logout();
      return false;
    }

    try {
      const { data } = await api.post('/auth/refresh', {
        refreshToken: auth.refreshToken,
      });
      const expiresAt = Date.now() + 30 * 60 * 1000;

      const newAuth: AuthData = {
        ...auth,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresAt,
      };

      setAuth(newAuth);
      write('auth', JSON.stringify(newAuth));
      write('accessToken', data.accessToken);
      write('refreshToken', data.refreshToken);

      scheduleRefresh(expiresAt);
      console.log('[Auth] Token refreshed');
      return true;
    } catch (err) {
      console.warn('[Auth] Refresh failed, logging out', err);
      logout();
      return false;
    }
  }, [auth, logout, scheduleRefresh]);

  return (
    <AuthContext.Provider
      value={{ auth, login, logout, extendSession, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
