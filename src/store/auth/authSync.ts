import type { UserInfo } from '@/models/providers/Types/Response';
import { resetAuthState, scheduleTokenRefresh, useAuthStore } from './auth';

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

interface AuthStateRequestMessage {
  type: 'AUTH_STATE_REQUEST';
}

interface SyncResponseMessage {
  type: 'SYNC_RESPONSE';
  user: UserInfo;
  accessToken: string;
}

type AuthMessage = LoginMessage | LogoutMessage | AuthStateRequestMessage | SyncResponseMessage;

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
        resetAuthState();
      } else if (data.type === 'LOGIN') {
        useAuthStore.setState({
          user: data.user,
          accessToken: data.accessToken,
          isAuthenticated: true,
          loading: false,
          isInitialized: true,
          error: null,
          mustChangePassword: data.user.must_change_password,
        });
        scheduleTokenRefresh(data.accessToken);
      } else if (data.type === 'AUTH_STATE_REQUEST') {
        const { isAuthenticated, user, accessToken } = useAuthStore.getState();
        if (isAuthenticated && user && accessToken) {
          broadcastChannel?.postMessage({
            type: 'SYNC_RESPONSE',
            user,
            accessToken,
          } satisfies SyncResponseMessage);
        }
      } else if (data.type === 'SYNC_RESPONSE') {
        if (!useAuthStore.getState().isAuthenticated) {
          useAuthStore.setState({
            user: data.user,
            accessToken: data.accessToken,
            isAuthenticated: true,
            loading: false,
            isInitialized: true,
            error: null,
            mustChangePassword: data.user.must_change_password,
          });
          scheduleTokenRefresh(data.accessToken);
        }
      }
    };

    broadcastChannel.postMessage({
      type: 'AUTH_STATE_REQUEST',
    } satisfies AuthStateRequestMessage);
  } catch (error) {
    console.error('Failed to setup auth sync:', error);
  }
};

export const teardownAuthSync = () => {
  if (broadcastChannel) {
    broadcastChannel.close();
    broadcastChannel = null;
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
  setupAuthSync();
};
