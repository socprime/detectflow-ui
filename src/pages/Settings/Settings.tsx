import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { settingsTabs } from './settingsTabs';

import { Aside, AsideHorizontal } from '@socprime/react-ui';

export const Settings: FC = () => {
  return (
    <div className="flex h-full min-w-0 flex-1 flex-col gap-4 p-4 sm:p-6 lg:flex-row lg:gap-6">
      <AsideHorizontal className="lg:hidden" tabs={settingsTabs} />
      <div className="sticky top-4 hidden max-w-60 min-w-[190px] flex-1 self-start lg:block">
        <Aside tabs={settingsTabs} />
      </div>
      <div className="min-w-0 flex-6">
        <Outlet />
      </div>
    </div>
  );
};
