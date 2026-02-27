import { RefreshCw } from 'lucide-react';

export const SyncProcessBar = () => {
  return (
    <div className="border-border bg-secondary overflow-hidden rounded-lg border">
      <div className="flex items-center gap-3 px-4 py-3">
        <RefreshCw className="text-success size-4 animate-spin" />
        <span className="text-gray-chateau text-xs">Synchronization In Progress</span>
      </div>
      <div className="bg-primary relative h-1 overflow-hidden">
        <div className="animate-progress from-success/50 via-success to-success/50 absolute inset-0 bg-gradient-to-r"></div>
      </div>
    </div>
  );
};
