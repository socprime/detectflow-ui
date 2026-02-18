import { Button } from '@/components/Button';
import { routes } from '@/models/router/routes';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@radix-ui/react-navigation-menu';
import { Activity, FolderTree, Settings } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export const Navigation: React.FC = () => {
  const { pathname } = useLocation();
  const navItems = [
    { id: routes.dashboard, label: 'Dashboard', icon: Activity },
    { id: routes.pipelines, label: 'Pipelines', icon: FolderTree },
    { id: routes.settings, label: 'Settings', icon: Settings },
  ];

  return (
    <NavigationMenu>
      <NavigationMenuList className="flex items-center gap-2">
        {navItems.map(({ id, label, icon }) => {
          const Icon = icon;
          const href = pathname.startsWith(id) ? id : `${id}`;
          const isActive = id === routes.dashboard ? pathname === id : pathname.startsWith(id);

          return (
            <NavigationMenuItem key={id}>
              <Button className={isActive ? 'is-active' : ''} to={href} variant="ghost" size="l">
                <Icon className="size-6" />
                {label}
              </Button>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
