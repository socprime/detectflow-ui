import { ConditionalContent } from '@/components/ConditionalContent';
import { Skeleton } from '@/components/Loading';
import { PageHeader } from '@/components/PageHeader';
import { SystemStatus as SystemStatusEnum } from '@/enums';
import { AlertCircleIcon, CircleCheckIcon, Clock4Icon, XCircleIcon } from 'lucide-react';
import { MatchNodeDialog } from './MatchNodeDialog';
import { useSystemStatus } from './useSystemStatus';

export const SystemStatus = () => {
  const {
    loading,
    platforms,
    isErrorOrWarning,
    versions,
    matchNodeVersionDialogOpen,
    handleMatchNodeVersionDialog,
  } = useSystemStatus();

  return (
    <div className="flex w-full flex-col gap-6">
      <PageHeader
        loading={loading}
        title="System Status"
        description="Monitor the health and status of all system components"
      />
      <div className="flex flex-col items-center justify-center gap-6 py-6">
        <div className="flex flex-col items-center justify-center gap-4">
          {loading ? (
            <Clock4Icon className="text-disabled size-4" />
          ) : isErrorOrWarning ? (
            <AlertCircleIcon className="text-warning size-16" />
          ) : (
            <CircleCheckIcon className="text-success size-16" />
          )}
          <h3 className="text-default text-lg font-medium">
            {loading
              ? 'Checking system status...'
              : isErrorOrWarning
                ? 'System Warnings'
                : 'All Systems works'}
          </h3>
          {isErrorOrWarning && (
            <p className="text-gray-chateau text-xs">Some components require attention</p>
          )}
        </div>
        {loading ? (
          <div className="text-comet text-2xs flex items-center gap-3">
            Some issues affecting a small percentage of services may not be reflected here.
          </div>
        ) : (
          <ul className="text-comet text-2xs flex list-none flex-wrap items-center justify-center gap-3">
            <li>Detect Flow UI: v{__APP_VERSION__}</li>
            <span className="text-3xs">•</span>
            <li>Detect Flow Backend: v{versions?.detectflow_backend_version}</li>
            <span className="text-3xs">•</span>
            <li className="cursor-pointer underline" onClick={handleMatchNodeVersionDialog}>
              Match Node Version
            </li>
          </ul>
        )}
      </div>
      <ConditionalContent
        loading={loading}
        loadingContent={Array.from({ length: 6 }).map((_, index) => (
          <Skeleton className="h-24 w-full" key={index} />
        ))}
        loadedContent={
          <>
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="text-m flex flex-col items-center justify-center gap-4 font-medium">
                STATUS PER SERVICE AREAS
              </div>
              <ul className="text-gray-chateau flex list-none flex-wrap items-center gap-6 text-xs">
                <li className="flex items-center gap-2">
                  <CircleCheckIcon className="text-success size-4" /> {SystemStatusEnum.Operational}
                </li>
                <li className="flex items-center gap-2">
                  <AlertCircleIcon className="text-warning size-4" /> {SystemStatusEnum.Warning}
                </li>
                <li className="flex items-center gap-2">
                  <XCircleIcon className="text-critical size-4" /> {SystemStatusEnum.Error}
                </li>
                <li className="flex items-center gap-2">
                  <Clock4Icon className="text-disabled size-4" /> {SystemStatusEnum.NotEnabled}
                </li>
              </ul>
            </div>
            {platforms?.map((platform) => (
              <div
                className="border-border bg-secondary flex flex-col rounded-sm border shadow-md"
                key={platform.name}
              >
                <div className="flex h-15 items-center justify-between gap-6 px-6">
                  <h4 className="text-sm font-medium">{platform.name}</h4>
                </div>
                <div className="flex flex-wrap">
                  {platform.checks.map((check) => (
                    <div
                      className="border-border flex flex-1/2 items-center justify-between gap-2 border-t-1 p-6 even:border-l-1"
                      key={check.title}
                    >
                      <div className="flex gap-4">
                        <span>
                          {check.status === SystemStatusEnum.Error ? (
                            <XCircleIcon className="text-critical size-5" />
                          ) : check.status === SystemStatusEnum.Warning ? (
                            <AlertCircleIcon className="text-warning size-5" />
                          ) : check.status === SystemStatusEnum.Operational ? (
                            <CircleCheckIcon className="text-success size-5" />
                          ) : check.status === SystemStatusEnum.NotEnabled ? (
                            <Clock4Icon className="text-disabled size-5" />
                          ) : null}
                        </span>
                        <span className="flex flex-col gap-1">
                          <span className="text-default">{check.title}</span>
                          <span className="text-gray-chateau text-xs">
                            {check.descriptions.join(' • ')}
                          </span>
                        </span>
                      </div>
                      {check.status === SystemStatusEnum.Error ? (
                        <div className="bg-critical/15 text-critical text-2xs border-critical flex h-6 items-center justify-center rounded-xs border px-3">
                          Error
                        </div>
                      ) : check.status === SystemStatusEnum.Warning ? (
                        <div className="bg-warning/15 text-warning text-2xs border-warning flex h-6 items-center justify-center rounded-xs border px-3">
                          Warning
                        </div>
                      ) : check.status === SystemStatusEnum.Operational ? (
                        <div className="bg-success/15 text-success text-2xs border-success flex h-6 items-center justify-center rounded-xs border px-3">
                          Operational
                        </div>
                      ) : check.status === SystemStatusEnum.NotEnabled ? (
                        <div className="bg-disabled/15 text-disabled text-2xs border-disabled flex h-6 items-center justify-center rounded-xs border px-3">
                          Not Enabled
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        }
      />
      {matchNodeVersionDialogOpen && (
        <MatchNodeDialog
          isOpen={matchNodeVersionDialogOpen}
          onClose={handleMatchNodeVersionDialog}
          versions={versions?.match_node}
        />
      )}
    </div>
  );
};
