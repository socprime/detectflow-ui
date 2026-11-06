import { ReactFlowProvider } from '@xyflow/react';
import { TablePiplines } from './components/nodes/PipelineNode/TablePiplines';
import { DashboardContent } from './DashboardContent';

export const Dashboard: React.FC = () => {
  return (
    <ReactFlowProvider>
      <div className="w-full">
        <div className="relative h-[calc(100vh-450px)] w-full max-w-full overflow-hidden">
          <DashboardContent />
        </div>
        <TablePiplines />
      </div>
    </ReactFlowProvider>
  );
};
