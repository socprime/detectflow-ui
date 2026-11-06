// import { ThemeToggle } from '../Theme/ThemeToggle';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { MobileNav } from './MobileNav';
import { Navigation } from './Navigation';
import { UserMenu } from './UserMenu';

import { routes } from '@/models/router';

export const Header: React.FC = () => {
  return (
    <header className="border-border bg-secondary flex h-[56px] items-center justify-between gap-3 border-b px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3 lg:gap-8">
        <MobileNav />
        <Link className="flex min-w-0 items-center gap-2 sm:gap-3" to={routes.pipelines}>
          <Logo className="size-14 shrink-0 sm:size-20" />
          <h2 className="truncate text-lg font-semibold sm:text-xl">Detect</h2>
        </Link>
        <div className="hidden lg:block">
          <Navigation />
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <UserMenu />
      </div>
    </header>
  );
};
