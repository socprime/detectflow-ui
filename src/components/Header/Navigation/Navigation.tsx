import { Button } from '@socprime/react-ui';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@radix-ui/react-navigation-menu';
import { useLocation } from 'react-router-dom';
import { isNavItemActive, navItems } from '../navItems';

export const Navigation: React.FC = () => {
  const { pathname } = useLocation();

  return (
    <NavigationMenu>
      <NavigationMenuList className="flex items-center gap-2">
        {navItems.map(({ id, label, icon }) => {
          const Icon = icon;
          const isActive = isNavItemActive(id, pathname);

          return (
            <NavigationMenuItem key={id}>
              <Button className={isActive ? 'is-active' : ''} to={id} variant="ghost" size="l">
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
