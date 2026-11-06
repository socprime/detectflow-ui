import { Dashboard } from './Dashboard';
import { PipelinesTabs } from './PipelinesTabs';

import { PageHeader } from '@socprime/react-ui';

export const Pipelines: React.FC = () => {
  return (
    <section className="flex w-full flex-col gap-6 p-6">
      <PageHeader title="Pipelines" description="Manage in-line threat detection" />
      <Dashboard />
      <PipelinesTabs />
    </section>
  );
};
