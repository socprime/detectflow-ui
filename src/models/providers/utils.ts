import { useAuthStore } from '@/store/auth';
import { ApiError } from './ApiError';
import { isLoginEndpoint, isLogoutEndpoint, isRefreshEndpoint } from './constants';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

const REFRESH_MAX_RETRIES = 3;
const REFRESH_RETRY_DELAY_MS = 1500;

const getAccessToken = (): string | null => {
  return useAuthStore.getState().accessToken;
};

const setAccessToken = (token: string): void => {
  useAuthStore.getState().updateAccessToken(token);
};

let refreshPromise: Promise<string> | null = null;

const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

async function refreshAccessToken(): Promise<string> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < REFRESH_MAX_RETRIES; attempt++) {
      try {
        const { api } = await import('./api');
        const data = await api.auth.refresh();

        setAccessToken(data.access_token);

        return data.access_token;
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          useAuthStore.getState().forceLogout();
          throw error;
        }

        lastError = error instanceof Error ? error : new Error('Unknown error');

        if (attempt < REFRESH_MAX_RETRIES - 1) {
          await delay(REFRESH_RETRY_DELAY_MS);
        }
      }
    }

    useAuthStore.getState().forceLogout();
    throw lastError || new Error('Failed to refresh token');
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const accessToken = getAccessToken();
  const defaultCredentials: RequestCredentials = 'include';
  const credentials = options.credentials ?? defaultCredentials;

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...options.headers,
    },
    ...(credentials && { credentials }),
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (
      response.status === 401 &&
      !isRefreshEndpoint(endpoint) &&
      !isLoginEndpoint(endpoint) &&
      !isLogoutEndpoint(endpoint)
    ) {
      try {
        await refreshAccessToken();

        const newAccessToken = getAccessToken();
        const retryConfig: RequestInit = {
          ...config,
          headers: {
            ...config.headers,
            ...(newAccessToken && { Authorization: `Bearer ${newAccessToken}` }),
          },
        };

        const retryResponse = await fetch(url, retryConfig);

        if (!retryResponse.ok) {
          const contentType = retryResponse.headers.get('content-type');
          let errorData;
          if (contentType && contentType.includes('application/json')) {
            errorData = await retryResponse.json();
          } else {
            errorData = await retryResponse.text();
          }

          const apiError = new ApiError(retryResponse.status, retryResponse.statusText, errorData);

          if (retryResponse.status === 401) {
            useAuthStore.getState().forceLogout();
          }

          throw apiError;
        }

        return await parseResponse<T>(retryResponse);
      } catch (error) {
        if (error instanceof ApiError) {
          throw error;
        }
        throw new ApiError(401, 'Unauthorized', 'Session expired');
      }
    }

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      let errorData;
      if (contentType && contentType.includes('application/json')) {
        errorData = await response.json();
      } else {
        errorData = await response.text();
      }
      throw new ApiError(response.status, response.statusText, errorData);
    }

    return await parseResponse<T>(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get('content-type');
  const contentLength = response.headers.get('content-length');

  if (contentLength === '0') {
    return undefined as T;
  }

  const text = await response.text();

  if (!text || text.trim() === '') {
    return undefined as T;
  }

  if (contentType && contentType.includes('application/json')) {
    try {
      return JSON.parse(text) as T;
    } catch {
      return text as T;
    }
  }

  return text as T;
}

export const get = <T>(endpoint: string): Promise<T> => request<T>(endpoint);
export const post = <T>(endpoint: string, data?: unknown): Promise<T> =>
  request<T>(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
export const patch = <T>(endpoint: string, data?: unknown): Promise<T> =>
  request<T>(endpoint, {
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  });
export const put = <T>(endpoint: string, data?: unknown): Promise<T> =>
  request<T>(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
export const del = <T>(endpoint: string): Promise<T> =>
  request<T>(endpoint, {
    method: 'DELETE',
  });
