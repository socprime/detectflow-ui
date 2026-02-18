export const AUTH_PATHS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  ME: '/auth/me',
  PROFILE: '/auth/profile',
  CHANGE_PASSWORD: '/auth/change-password',
} as const;

export const isAuthEndpoint = (endpoint: string): boolean => endpoint.startsWith('/auth/');
export const isRefreshEndpoint = (endpoint: string): boolean => endpoint === AUTH_PATHS.REFRESH;
export const isLoginEndpoint = (endpoint: string): boolean => endpoint === AUTH_PATHS.LOGIN;
export const isLogoutEndpoint = (endpoint: string): boolean => endpoint === AUTH_PATHS.LOGOUT;
