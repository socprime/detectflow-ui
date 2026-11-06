import React from 'react';
import { Outlet } from 'react-router-dom';
import { RepositoriesAside } from './RepositoriesAside';

export const Repositories: React.FC = () => {
  return (
    <div className="flex h-full w-full gap-x-6 gap-y-6 p-6">
      <RepositoriesAside />
      <Outlet />
    </div>
  );
};
