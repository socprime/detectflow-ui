import { UserRole } from '@/enums';
import { useAuthStore } from '@/store/auth';

export const usePermissions = () => {
  const role = useAuthStore((s) => s.user?.role);

  return {
    role,
    isViewer: role === UserRole.VIEWER,
    isUser: role === UserRole.USER,
    isAdmin: role === UserRole.ADMIN,
    canWrite: role === UserRole.ADMIN || role === UserRole.USER,
  };
};
