import { Button } from '@/components/Button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@radix-ui/react-navigation-menu';
import { LucideIcon } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Tooltip } from '../Tooltip';

interface Tab {
  id: string;
  label: React.ReactNode;
  icon: LucideIcon;
  tooltip?: string;
}

interface AsideProps {
  tabs: Tab[];
}

export const Aside: React.FC<AsideProps> = ({ tabs = [] }) => {
  const { pathname } = useLocation();

  return (
    <aside className="w-full">
      <NavigationMenu>
        <NavigationMenuList className="flex w-full flex-col gap-2">
          {tabs.map(({ id, label, icon, tooltip }) => {
            const Icon = icon;
            const isActive = pathname.startsWith(id);
            const button = (
              <Button
                className={`w-full justify-start text-xs [&.is-active]:bg-transparent ${isActive ? 'is-active' : ''}`}
                to={id}
                variant="ghost"
                size="l"
              >
                <Icon className="size-6" />
                <span>{label}</span>
              </Button>
            );

            return (
              <NavigationMenuItem key={id}>
                {tooltip ? <Tooltip content={tooltip}>{button}</Tooltip> : button}
              </NavigationMenuItem>
            );
          })}
        </NavigationMenuList>
      </NavigationMenu>
    </aside>
  );
};
