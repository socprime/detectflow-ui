import { ReactFlowProvider } from '@xyflow/react';
import { DashboardContent } from './DashboardContent';
import { DashboardMetricMode } from './DashboardMetricMode';
import { RecentActivity } from './RecentActivity';
import { TablePiplines } from './components/nodes/PipelineNode/TablePiplines';

export const Dashboard: React.FC = () => {
  return (
    <ReactFlowProvider>
      <div className="relative w-full">
        <div className="absolute top-6 right-12 z-10 flex items-center gap-4">
          <DashboardMetricMode />
        </div>
        <div className="relative h-[calc(100vh-200px)] w-full max-w-full overflow-hidden">
          <DashboardContent />
        </div>
        <div className="w-full px-6 pb-8">
          <RecentActivity />
        </div>
        <TablePiplines />
      </div>
    </ReactFlowProvider>
  );
};
