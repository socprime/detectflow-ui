import { DatabaseIcon, FolderTreeIcon, Link2Icon, SettingsIcon } from 'lucide-react';

import { routes } from '@/models/router/routes';

export const navItems = [
  { id: routes.pipelines, label: 'Pipelines', icon: FolderTreeIcon },
  { id: routes.attackChains, label: 'Attack Chains', icon: Link2Icon },
  { id: routes.repositories, label: 'Repositories', icon: DatabaseIcon },
  { id: routes.settings, label: 'Settings', icon: SettingsIcon },
];

export const isNavItemActive = (id: string, pathname: string) =>
  id === routes.pipelines ? pathname === id : pathname.startsWith(id);
