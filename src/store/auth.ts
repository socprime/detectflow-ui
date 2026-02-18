import { api } from '@/models/providers/api';
import { ApiError } from '@/models/providers/ApiError';
import type { UserInfo } from '@/models/providers/Types/Response';
import { create } from 'zustand';
import { broadcastLogin, broadcastLogout } from './authSync';

interface AuthState {
  loading: boolean;
  user: UserInfo | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  error: string | null;
  mustChangePassword: boolean;
  login: (email: string, password: string) => Promise<{ mustChangePassword: boolean }>;
  logout: () => Promise<void>;
  forceLogout: () => void;
  fetchCurrentUser: () => Promise<void>;
  clearError: () => void;
  initialize: () => Promise<void>;
  setMustChangePassword: (value: boolean) => void;
  updateUser: (user: UserInfo) => void;
  updateAccessToken: (accessToken: string) => void;
}

const cleanupLegacyStorage = () => {
  try {
    const legacyKeys = ['auth-storage', 'access_token'];
    legacyKeys.forEach((key) => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        console.info(`Cleaned up legacy storage key: ${key}`);
      }
    });
  } catch (error) {
    console.error('Failed to cleanup legacy storage:', error);
  }
};

const initialState: Omit<
  AuthState,
  | 'login'
  | 'logout'
  | 'forceLogout'
  | 'fetchCurrentUser'
  | 'clearError'
  | 'initialize'
  | 'setMustChangePassword'
  | 'updateUser'
  | 'updateAccessToken'
> = {
  loading: false,
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
    const { isAuthenticated } = get();

    if (!isAuthenticated) {
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        mustChangePassword: false,
      });
      broadcastLogout();
      return;
    }

    set({ loading: true });
    try {
      await api.auth.logout();
    } catch (error) {
      console.debug('Logout API call failed (expected if token expired):', error);
    } finally {
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        mustChangePassword: false,
      });

      broadcastLogout();
    }
  },

  forceLogout: () => {
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      mustChangePassword: false,
    });
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

  clearError: () => {
    set({ error: null });
  },

  initialize: async () => {
    set({ loading: true });

    cleanupLegacyStorage();

    try {
      const refreshData = await api.auth.refresh();

      set({
        accessToken: refreshData.access_token,
        isAuthenticated: true,
      });

      const user = await api.auth.getCurrentUser();
      set({
        user,
        mustChangePassword: user.must_change_password,
        loading: false,
      });
    } catch (error) {
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  },

  setMustChangePassword: (value: boolean) => {
    set({ mustChangePassword: value });
    if (get().user) {
      set({
        user: {
          ...get().user!,
          must_change_password: value,
        },
      });
    }
  },

  updateUser: (user: UserInfo) => {
    set({ user, mustChangePassword: user.must_change_password });
  },

  updateAccessToken: (accessToken: string) => {
    set({ accessToken });
  },
}));
