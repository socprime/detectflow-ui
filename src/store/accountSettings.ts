import { create } from 'zustand';
import { api, UpdateUserRequest } from '../models/providers';
import type { ResetPasswordResponse, UserInfo } from '../models/providers/Types/Response';
import { createBaseActions, handleAsyncAction } from './middleware';

interface UsersState {
  loading: boolean;
  error: string | null;
  user: UserInfo | null;
  editingUserId: string | null;
  fetchUser: (userId: string) => Promise<UserInfo>;
  updateUser: (userId: string, data: UpdateUserRequest) => Promise<UserInfo>;
  resetPassword: (userId: string) => Promise<ResetPasswordResponse>;
}

const initialState: Omit<UsersState, 'fetchUser' | 'updateUser' | 'resetPassword'> = {
  loading: false,
  error: null,
  user: null,
  editingUserId: null,
};

export const useUsersStore = create<UsersState>((set, get) => ({
  ...initialState,

  fetchUser: (userId: string, isReload: boolean = false) =>
    handleAsyncAction(
      async () => {
        const user = await api.users.getUser(userId);
        set({ user });
        return user;
      },
      set,
      'Failed to get user',
      isReload,
    ),

  updateUser: (userId: string, data: UpdateUserRequest) =>
    handleAsyncAction(
      async () => await api.users.updateUser(userId, data),
      set,
      'Failed to update user',
    ),

  resetPassword: (userId: string) =>
    handleAsyncAction(
      async () => await api.users.resetPassword(userId),
      set,
      'Failed to reset password',
    ),

  ...createBaseActions(initialState, set),
}));
