import { Outlet } from 'react-router-dom';
import { tabs } from './accountSettingsTabs';

import { Aside } from '@socprime/react-ui';

export const AccountSettings = () => {
  return (
    <div className="flex h-full min-w-0 flex-1 gap-6 p-6">
      <div className="max-w-80 min-w-[200px] flex-1">
        <Aside tabs={tabs} />
      </div>
      <div className="min-w-0 flex-6">
        <Outlet />
      </div>
    </div>
  );
};
