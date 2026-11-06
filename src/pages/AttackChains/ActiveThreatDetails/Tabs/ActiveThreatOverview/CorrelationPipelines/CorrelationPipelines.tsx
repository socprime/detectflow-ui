import { CorrelationPipelineDialog } from './CorrelationPipelineDialog';

import { ConditionalTooltip } from '@/components/ConditionalTooltip';
import { DisabledTooltip } from '@/components/Tooltip/DisabledTooltip';
import { EChainStatus } from '@/enums';
import { usePermissions } from '@/hooks';
import { ActiveThreatAttackChainCounts } from '@/models/providers/Types/responses/activeThreats';
import { formatDate, getStatusHexColor } from '@/utils';
import { cn } from '@/utils/mergeClass';
import { ConditionalContent, Label, Skeleton, Switch } from '@socprime/react-ui';
import { useCorrelationPipelines } from './useCorrelationPipelines';

const getAttackChainSegments = (counts: ActiveThreatAttackChainCounts) =>
  [
    { status: EChainStatus.New, count: counts.new, label: 'New' },
    { status: EChainStatus.Investigating, count: counts.investigating, label: 'Investigating' },
    { status: EChainStatus.Confirmed, count: counts.confirmed, label: 'Confirmed' },
    { status: EChainStatus.FalsePositive, count: counts.false_positive, label: 'False Positive' },
    { status: EChainStatus.Resolved, count: counts.resolved, label: 'Resolved' },
    { status: EChainStatus.Closed, count: counts.closed, label: 'Closed' },
    { status: EChainStatus.FilteredOut, count: counts.filtered_out, label: 'Filtered Out' },
  ].filter((segment) => segment.count > 0);

export const CorrelationPipelines = () => {
  const {
    loading,
    isBlocked,
    handleConfirm,
    handleTogglePipeline,
    detail,
    pipelines,
    submitting,
    dialog,
    setDialog,
  } = useCorrelationPipelines();

  const { isViewer } = usePermissions();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-default text-sm font-semibold">Running in Chaining Pipelines</h2>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="block-all-pipelines" className="text-silver text-xs">
            Block for all pipelines
          </Label>
          <DisabledTooltip disabled={isViewer}>
            <Switch
              id="block-all-pipelines"
              checked={isBlocked}
              disabled={!detail || submitting || isViewer}
              onCheckedChange={(checked) => setDialog({ variant: checked ? 'block' : 'unblock' })}
            />
          </DisabledTooltip>
        </div>
      </div>
      <ConditionalContent
        loading={loading}
        loadingContent={
          <div className="flex flex-col gap-2">
            <Skeleton className="h-26 w-full" rows={3} />
          </div>
        }
        loadedContent={
          <>
            {pipelines.map((item) => (
              <div
                className="border-border bg-secondary flex items-center gap-6 rounded-md border p-4"
                key={item.correlation_pipeline_id}
              >
                <div className="flex flex-1 items-center gap-6">
                  <DisabledTooltip disabled={isViewer}>
                    <Switch
                      checked={item.monitored}
                      disabled={isBlocked || submitting || isViewer}
                      onCheckedChange={(checked) => handleTogglePipeline(item, checked)}
                    />
                  </DisabledTooltip>
                  <div className="flex flex-col">
                    <h3 className="text-dark-gray text-2xs font-medium uppercase">Pipeline</h3>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'h-1.5 w-1.5 rounded-full',
                          item.runtime_state?.overall === 'running' ? 'bg-success' : 'bg-dark-gray',
                        )}
                      />
                      <p className="text-default text-2xs">{item.name}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <h3 className="text-dark-gray text-2xs font-medium uppercase">Attack Chains</h3>
                  <div className="flex items-center gap-2">
                    <p className="text-default text-2xs">{item.attack_chains_total}</p>
                    <div className="bg-border/50 flex h-2 w-full overflow-hidden rounded-sm">
                      {getAttackChainSegments(item.attack_chain_counts).map((segment) => (
                        <div
                          key={segment.status}
                          className="h-full min-w-0"
                          style={{ flex: segment.count }}
                        >
                          <ConditionalTooltip
                            className="block h-full w-full"
                            content={`${segment.label}: ${segment.count}`}
                          >
                            <div
                              className="h-full w-full"
                              style={{
                                backgroundColor: getStatusHexColor(segment.status),
                              }}
                            />
                          </ConditionalTooltip>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex min-w-27 flex-col">
                  <h3 className="text-dark-gray text-2xs font-medium uppercase">First Seen</h3>
                  <p className="text-default text-2xs">
                    {item.first_seen ? formatDate(item.first_seen, 'datetime') : '-'}
                  </p>
                </div>
                <div className="flex min-w-27 flex-col">
                  <h3 className="text-dark-gray text-2xs font-medium uppercase">Last Seen</h3>
                  <p className="text-default text-2xs">
                    {item.last_seen ? formatDate(item.last_seen, 'datetime') : '-'}
                  </p>
                </div>
              </div>
            ))}
            {!loading && pipelines.length === 0 && (
              <p className="text-gray-chateau text-2xs">No correlation pipelines available</p>
            )}
          </>
        }
      />
      {dialog && detail && (
        <CorrelationPipelineDialog
          isOpen
          variant={dialog.variant}
          threatName={detail.name}
          pipelineName={dialog.variant === 'suppress' ? dialog.pipeline.name : undefined}
          loading={submitting}
          onClose={() => setDialog(null)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
};
