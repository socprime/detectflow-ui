import { Aside } from '@/components/Aside';
import { Outlet } from 'react-router-dom';
import { tabs } from './settingsTabs';

export const Settings: React.FC = () => {
  return (
    <div className="flex h-full min-w-0 flex-1 gap-6 p-6">
      <div className="sticky top-4 max-w-64 min-w-[216px] flex-1">
        <Aside tabs={tabs} />
      </div>
      <div className="min-w-0 flex-6">
        <Outlet />
      </div>
    </div>
  );
};
