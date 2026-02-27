import { api } from '@/models/providers/api';
import { ApiError } from '@/models/providers/ApiError';
import type { UserInfo } from '@/models/providers/Types/Response';
import { create } from 'zustand';
import { broadcastLogin, broadcastLogout } from './authSync';

const AUTH_SESSION_HINT_KEY = 'auth_session_hint';
const REFRESH_BUFFER_MS = 30_000;

const setSessionHint = () => {
  try {
    localStorage.setItem(AUTH_SESSION_HINT_KEY, '1');
  } catch (error) {
    console.warn('Failed to set auth session hint:', error);
  }
};

export const clearSessionHint = () => {
  try {
    localStorage.removeItem(AUTH_SESSION_HINT_KEY);
  } catch (error) {
    console.warn('Failed to clear auth session hint:', error);
  }
};

let refreshTimer: ReturnType<typeof setTimeout> | null = null;

function base64UrlDecode(str: string): string {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  return atob(padded);
}

function decodeTokenExp(token: string): number | null {
  try {
    const payload = JSON.parse(base64UrlDecode(token.split('.')[1]));
    return typeof payload.exp === 'number' ? payload.exp : null;
  } catch {
    return null;
  }
}

export function cancelTokenRefresh() {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
}

export function scheduleTokenRefresh(token: string) {
  cancelTokenRefresh();

  const exp = decodeTokenExp(token);
  if (!exp) return;

  const refreshAt = exp * 1000 - Date.now() - REFRESH_BUFFER_MS;
  if (refreshAt <= 0) return;

  refreshTimer = setTimeout(async () => {
    try {
      const data = await api.auth.refresh();
      useAuthStore.getState().updateAccessToken(data.access_token);
    } catch {
      console.error('Failed to refresh token');
    }
  }, refreshAt);
}

export const resetAuthState = () => {
  useAuthStore.setState({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    mustChangePassword: false,
  });
  clearSessionHint();
  cancelTokenRefresh();
};

interface AuthState {
  loading: boolean;
  isInitialized: boolean;
  user: UserInfo | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  error: string | null;
  mustChangePassword: boolean;
  login: (email: string, password: string) => Promise<{ mustChangePassword: boolean }>;
  logout: () => Promise<void>;
  forceLogout: () => void;
  fetchCurrentUser: () => Promise<void>;
  ensureInitialized: () => Promise<void>;
  clearError: () => void;
  initialize: () => Promise<void>;
  setMustChangePassword: (value: boolean) => void;
  updateUser: (user: UserInfo) => void;
  updateAccessToken: (accessToken: string) => void;
}

const initialState: Omit<
  AuthState,
  | 'login'
  | 'logout'
  | 'forceLogout'
  | 'fetchCurrentUser'
  | 'ensureInitialized'
  | 'clearError'
  | 'initialize'
  | 'setMustChangePassword'
  | 'updateUser'
  | 'updateAccessToken'
> = {
  loading: false,
  isInitialized: false,
  error: null,
  user: null,
  accessToken: null,
  isAuthenticated: false,
  mustChangePassword: false,
};

export const useAuthStore = create<AuthState>((set, get) => ({
  ...initialState,

  login: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.auth.login({ email, password });

      const mustChangePassword = response.user.must_change_password;

      set({
        user: response.user,
        accessToken: response.access_token,
        isAuthenticated: true,
        loading: false,
        error: null,
        mustChangePassword,
      });
      setSessionHint();
      scheduleTokenRefresh(response.access_token);
      broadcastLogin(response.user, response.access_token);

      return { mustChangePassword };
    } catch (error) {
      const errorMessage =
        error instanceof ApiError
          ? error.message
          : 'Login error. Please check your data and try again.';
      set({
        loading: false,
        error: errorMessage,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  logout: async () => {
    if (!get().isAuthenticated) {
      resetAuthState();
      broadcastLogout();
      return;
    }

    set({ loading: true });
    try {
      await api.auth.logout();
    } catch (error) {
      console.debug('Logout API call failed (expected if token expired):', error);
    } finally {
      resetAuthState();
      broadcastLogout();
    }
  },

  forceLogout: () => {
    resetAuthState();
    broadcastLogout();
  },

  fetchCurrentUser: async () => {
    set({ loading: true });
    try {
      const user = await api.auth.getCurrentUser();
      set({
        user,
        mustChangePassword: user.must_change_password,
        loading: false,
      });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  ensureInitialized: async () => {
    const { isInitialized, loading } = get();
    if (isInitialized || loading) {
      return;
    }
    await get().initialize();
  },

  clearError: () => {
    set({ error: null });
  },

  initialize: async () => {
    set({ loading: true });

    try {
      const refreshData = await api.auth.refresh();

      set({
        accessToken: refreshData.access_token,
        isAuthenticated: true,
      });
      setSessionHint();
      scheduleTokenRefresh(refreshData.access_token);

      const user = await api.auth.getCurrentUser();
      set({
        user,
        mustChangePassword: user.must_change_password,
        loading: false,
        isInitialized: true,
      });
    } catch {
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        loading: false,
        isInitialized: true,
      });
      clearSessionHint();
    }
  },

  setMustChangePassword: (value: boolean) => {
    const user = get().user;
    set({
      mustChangePassword: value,
      ...(user && { user: { ...user, must_change_password: value } }),
    });
  },

  updateUser: (user: UserInfo) => {
    set({ user, mustChangePassword: user.must_change_password });
  },

  updateAccessToken: (accessToken: string) => {
    set({ accessToken });
    scheduleTokenRefresh(accessToken);
  },
}));
