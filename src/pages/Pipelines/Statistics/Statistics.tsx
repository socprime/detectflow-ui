import { Skeleton } from '@/components/Loading/Skeleton';
import {
  AlertCircle,
  ArrowDownToLine,
  ArrowUpFromLine,
  CheckCircle2,
  Hash,
  Layers,
  Server,
} from 'lucide-react';
import { useStatistics } from './useStatistics';

export const Statistics: React.FC = () => {
  const { loading, stats } = useStatistics();

  return (
    <div className="flex flex-wrap gap-6">
      <div className="border-border bg-secondary flex flex-1 flex-col gap-4 rounded-lg border p-6">
        <h6 className="text-subdued text-xs">Topics</h6>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-success/10 rounded-lg p-3">
              <ArrowUpFromLine size={24} className="text-success" />
            </div>
            <div className="flex flex-1 items-center justify-between gap-2">
              <p className="text-default text-xs">Source</p>
              <div className="text-default text-m font-semibold">
                {loading ? <Skeleton className="h-4 w-10" /> : stats.topics.source}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-success/10 rounded-lg p-3">
              <ArrowDownToLine size={24} className="text-success" />
            </div>
            <div className="flex flex-1 items-center justify-between gap-2">
              <p className="text-default text-xs">Destination</p>
              <div className="text-default text-m font-semibold">
                {loading ? <Skeleton className="h-4 w-10" /> : stats.topics.destination}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-border bg-secondary flex flex-1 flex-col gap-4 rounded-lg border p-6">
        <h6 className="text-subdued text-xs">Events</h6>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-success/10 rounded-lg p-3">
              <CheckCircle2 size={24} className="text-success" />
            </div>
            <div className="flex flex-1 items-center justify-between gap-2">
              <p className="text-default text-xs">Tagged</p>
              <div className="text-default text-m font-semibold">
                {loading ? <Skeleton className="h-4 w-10" /> : stats.events.tagged}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-warning/10 rounded-lg p-3">
              <AlertCircle size={24} className="text-warning" />
            </div>
            <div className="flex flex-1 items-center justify-between gap-2">
              <p className="text-default text-xs">Not Tagged</p>
              <div className="text-default text-m font-semibold">
                {loading ? <Skeleton className="h-4 w-10" /> : stats.events.untagged}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-border bg-secondary flex flex-1 flex-col gap-4 rounded-lg border p-6">
        <h6 className="text-subdued text-xs">Network</h6>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-purple/10 rounded-lg p-3">
              <Server size={24} className="text-purple" />
            </div>
            <div className="flex flex-1 items-center justify-between gap-2">
              <p className="text-default text-xs">Nodes</p>
              <div className="text-default text-m font-semibold">
                {loading ? <Skeleton className="h-4 w-10" /> : stats.networks.nodes}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-purple/10 rounded-lg p-3">
              <Layers size={24} className="text-purple" />
            </div>
            <div className="flex flex-1 items-center justify-between gap-2">
              <p className="text-default text-xs">Clusters</p>
              <div className="text-default text-m font-semibold">
                {loading ? <Skeleton className="h-4 w-10" /> : stats.networks.clusters}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-border bg-secondary flex flex-1 flex-col gap-4 rounded-lg border p-6">
        <h6 className="text-subdued text-xs">Rules</h6>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-light-blue/10 rounded-lg p-3">
              <CheckCircle2 size={24} className="text-light-blue" />
            </div>
            <div className="flex flex-1 items-center justify-between gap-2">
              <p className="text-default text-xs">Active</p>
              <div className="text-default text-m font-semibold">
                {loading ? <Skeleton className="h-4 w-10" /> : stats.rules.active}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-light-blue/10 rounded-lg p-3">
              <Hash size={24} className="text-light-blue" />
            </div>
            <div className="flex flex-1 items-center justify-between gap-2">
              <p className="text-default text-xs">Matched</p>
              <div className="text-default text-m font-semibold">
                {loading ? <Skeleton className="h-4 w-10" /> : stats.rules.matched}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
