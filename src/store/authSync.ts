import type { UserInfo } from '@/models/providers/Types/Response';
import { useAuthStore } from './auth';

const CHANNEL_NAME = 'auth_channel';
let broadcastChannel: BroadcastChannel | null = null;

interface LoginMessage {
  type: 'LOGIN';
  user: UserInfo;
  accessToken: string;
}

interface LogoutMessage {
  type: 'LOGOUT';
}

type AuthMessage = LoginMessage | LogoutMessage;

export const setupAuthSync = () => {
  if (typeof BroadcastChannel === 'undefined') {
    console.warn('BroadcastChannel not supported - cross-tab sync disabled');
    return;
  }

  try {
    broadcastChannel = new BroadcastChannel(CHANNEL_NAME);

    broadcastChannel.onmessage = (event: MessageEvent<AuthMessage>) => {
      const { data } = event;

      if (data.type === 'LOGOUT') {
        useAuthStore.getState().forceLogout();
      } else if (data.type === 'LOGIN') {
        useAuthStore.setState({
          user: data.user,
          accessToken: data.accessToken,
          isAuthenticated: true,
          loading: false,
          error: null,
          mustChangePassword: data.user.must_change_password,
        });
      }
    };
  } catch (error) {
    console.error('Failed to setup auth sync:', error);
  }
};

export const broadcastLogout = () => {
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({ type: 'LOGOUT' } satisfies LogoutMessage);
    } catch (error) {
      console.error('Failed to broadcast logout:', error);
    }
  }
};

export const broadcastLogin = (user: UserInfo, accessToken: string) => {
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({
        type: 'LOGIN',
        user,
        accessToken,
      } satisfies LoginMessage);
    } catch (error) {
      console.error('Failed to broadcast login:', error);
    }
  }
};

export const initializeAuth = () => {
  useAuthStore.getState().initialize();
  setupAuthSync();
};
