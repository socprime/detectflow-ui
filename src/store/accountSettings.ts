import { api, CreateUserRequest, PaginationParams, UpdateUserRequest } from '@/models/providers';
import type {
  ResetPasswordResponse,
  UserInfo,
  UsersResponse,
} from '@/models/providers/Types/responses/auth';
import { createBaseActions, handleAsyncAction } from '@/store/middleware';
import { create } from 'zustand';

interface UsersState {
  loading: boolean;
  error: string | null;
  users: UsersResponse | null;
  user: UserInfo | null;
  isOpenEditDialog: boolean;
  editingUserId: string | null;
  fetchUsers: (params?: PaginationParams) => Promise<UsersResponse>;
  fetchUser: (userId: string) => Promise<UserInfo>;
  createUser: (data: CreateUserRequest) => Promise<UserInfo>;
  updateUser: (userId: string, data: UpdateUserRequest) => Promise<UserInfo>;
  deleteUser: (userId: string) => Promise<void>;
  resetPassword: (userId: string) => Promise<ResetPasswordResponse>;
  handleEditDialog: (status: boolean, userId?: string | null) => void;
}

const initialState: Omit<
  UsersState,
  | 'fetchUsers'
  | 'fetchUser'
  | 'createUser'
  | 'updateUser'
  | 'deleteUser'
  | 'resetPassword'
  | 'handleEditDialog'
> = {
  loading: false,
  error: null,
  users: null,
  user: null,
  isOpenEditDialog: false,
  editingUserId: null,
};

export const useUsersStore = create<UsersState>((set, get) => ({
  ...initialState,

  fetchUsers: (params) =>
    handleAsyncAction(
      async () => {
        const users = await api.users.getList(params);
        set({ users });
        return users;
      },
      set,
      'Failed to fetch users',
    ),

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

  createUser: (data: CreateUserRequest) =>
    handleAsyncAction(async () => api.users.createUser(data), set, 'Failed to create user'),

  updateUser: (userId: string, data: UpdateUserRequest) =>
    handleAsyncAction(async () => api.users.updateUser(userId, data), set, 'Failed to update user'),

  deleteUser: (userId: string) =>
    handleAsyncAction(
      async () => {
        const result = await api.users.deleteUser(userId);
        set({
          users: {
            ...get().users!,
            data: get().users?.data?.filter((user) => user.id !== userId) || [],
          },
        });
        return result;
      },
      set,
      'Failed to delete user',
    ),

  resetPassword: (userId: string) =>
    handleAsyncAction(async () => api.users.resetPassword(userId), set, 'Failed to reset password'),

  handleEditDialog: (status: boolean, userId?: string | null) =>
    set({
      isOpenEditDialog: status,
      editingUserId: status ? userId || null : null,
      ...(status ? {} : { user: null }),
    }),

  ...createBaseActions(initialState, set),
}));
