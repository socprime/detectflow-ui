import type { UserRole } from '@/enums';
import type { PaginatedResponse } from './common';

export interface UserInfo {
  id: string;
  full_name: string;
  email: string;
  is_active: boolean;
  role: UserRole;
  must_change_password: boolean;
  created: string;
  updated: string;
}

export interface UsersResponse extends PaginatedResponse<UserInfo> {}
export interface UserResponse extends UserInfo {}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: UserInfo;
}

export interface RefreshTokenResponse {
  access_token: string;
  token_type: string;
}

export interface LogoutResponse {
  message: string;
}

export interface ChangePasswordResponse {
  message: string;
}

export interface ResetPasswordResponse {
  temporary_password: string;
  message: string;
}
