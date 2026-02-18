import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/Dropdowns';
import { routes } from '@/models/router/routes';
import { LogOut, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUserMenu } from './useUserMenu';

export const UserMenu: React.FC = () => {
  const { initials, handleLogout } = useUserMenu();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="border-border flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 transition-colors hover:border-gray-500">
          <span className="text-foreground text-xs font-semibold">{initials}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="border-border bg-primary w-48">
        <Link to={routes.accountSettings}>
          <DropdownMenuItem className="hover:bg-hover cursor-pointer gap-2">
            <Settings size={16} className="text-subdued" />
            <span className="text-foreground text-xs">Account Settings</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem onClick={handleLogout} className="hover:bg-hover cursor-pointer gap-2">
          <LogOut size={16} className="text-subdued" />
          <span className="text-foreground text-xs">Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
