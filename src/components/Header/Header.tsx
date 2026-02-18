// import { ThemeToggle } from '../Theme/ThemeToggle';
import { routes } from '@/models/router';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { Navigation } from './Navigation';
import { UserMenu } from './UserMenu';

export const Header: React.FC = () => {
  return (
    <header className="border-border bg-secondary flex h-[56px] items-center justify-between border-b px-6">
      <div className="flex items-center gap-8">
        <Link className="flex items-center gap-3" to={routes.dashboard}>
          <Logo className="size-20" />
          <span className="flex flex-col">
            <h2 className="line-height-1 text-l font-bold">DetectFlow</h2>
            <span className="text-silver line-height-1 text-2xs">Open Source Edition</span>
          </span>
        </Link>
        <Navigation />
      </div>
      <div className="flex items-center gap-2">
        {/* <ThemeToggle /> */}
        <UserMenu />
      </div>
    </header>
  );
};
