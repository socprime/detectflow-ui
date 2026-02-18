import { routes } from '@/models/router/routes';
import { useAuthStore } from '@/store/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useUserMenu = () => {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate(routes.login, { replace: true });
      toast.success('Successfully logged out');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  const getInitials = (fullName: string): string => {
    if (!fullName) return 'U';
    const parts = fullName.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  const initials = user?.full_name ? getInitials(user.full_name) : 'U';

  return {
    user,
    initials,
    handleLogout,
  };
};
