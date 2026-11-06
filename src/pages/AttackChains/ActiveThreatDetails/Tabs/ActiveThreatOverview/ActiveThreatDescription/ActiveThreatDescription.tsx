import { ConditionalContent, Skeleton } from '@socprime/react-ui';

interface ActiveThreatDescriptionProps {
  loading?: boolean;
  summary?: string;
  investigation?: string;
  mitigation?: string;
  response?: string;
}

export const ActiveThreatDescription: React.FC<ActiveThreatDescriptionProps> = ({
  loading,
  summary,
  investigation,
  mitigation,
  response,
}) => {
  return (
    <ConditionalContent
      loading={!!loading}
      loadingContent={
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-full" rows={4} />
        </div>
      }
      loadedContent={
        <div className="flex flex-col gap-6">
          {summary && (
            <div className="flex flex-col gap-2">
              <h3 className="text-default text-sm font-semibold uppercase">Summary</h3>
              <p className="text-subdued text-sm">{summary}</p>
            </div>
          )}
          {investigation && (
            <div className="flex flex-col gap-2">
              <h3 className="text-default text-sm font-semibold uppercase">Investigation</h3>
              <p className="text-subdued text-sm">{investigation}</p>
            </div>
          )}
          {mitigation && (
            <div className="flex flex-col gap-2">
              <h3 className="text-default text-sm font-semibold uppercase">Mitigation</h3>
              <p className="text-subdued text-sm">{mitigation}</p>
            </div>
          )}
          {response && (
            <div className="flex flex-col gap-2">
              <h3 className="text-default text-sm font-semibold uppercase">Response</h3>
              <p className="text-subdued text-sm">{response}</p>
            </div>
          )}
        </div>
      }
    />
  );
};
