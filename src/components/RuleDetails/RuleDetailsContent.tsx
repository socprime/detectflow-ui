import { CopyIcon, DownloadIcon } from 'lucide-react';
import { useRuleActions } from './useRuleActions';

import { formatDate } from '@/utils/format';
import { Badge, Button, ConditionalContent, Label, Skeleton } from '@socprime/react-ui';
import { Editor } from '@socprime/react-ui/editor';

export interface RuleDetailsData {
  name?: string;
  body?: string;
  created?: string;
  updated?: string;
  product?: string | null;
  service?: string | null;
  category?: string | null;
}

interface RuleDetailsContentProps {
  loading?: boolean;
  data?: RuleDetailsData | null;
  showPSC?: boolean;
  footer?: React.ReactNode;
}

export const RuleDetailsContent: React.FC<RuleDetailsContentProps> = ({
  loading,
  data,
  showPSC = false,
  footer,
}) => {
  const { handleCopy, handleDownload } = useRuleActions({ name: data?.name, body: data?.body });

  return (
    <div className="border-border bg-secondary flex flex-col gap-6 rounded-sm border p-6 shadow-md">
      <div className="flex justify-between gap-8">
        {showPSC ? (
          <div className="flex flex-1">
            <span className="flex flex-0 flex-col items-start gap-2">
              <h6 className="text-subdued text-xs font-medium">Product/Service/Category</h6>
              <ConditionalContent
                loading={!!loading}
                loadingContent={<Skeleton className="h-4 w-24" />}
                loadedContent={
                  data?.product || data?.service || data?.category ? (
                    <Badge
                      className="fit-content text-success text-2xs pointer-events-none flex-0 rounded-3xl font-light"
                      variant="success"
                    >
                      {`${data.product || '-'}/${data.service || '-'}/${data.category || '-'}`}
                    </Badge>
                  ) : (
                    <span className="text-gray-chateau text-xs">—</span>
                  )
                }
              />
            </span>
          </div>
        ) : (
          <div className="flex-1" />
        )}
        <div className="flex flex-col gap-2">
          <h6 className="text-subdued text-xs font-medium">Created</h6>
          <ConditionalContent
            loading={!!loading}
            loadingContent={<Skeleton className="h-4 w-24" />}
            loadedContent={
              <div className="text-gray-chateau text-xs whitespace-nowrap">
                {formatDate(data?.created || '')}
              </div>
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <h6 className="text-subdued text-xs font-medium">Updated</h6>
          <ConditionalContent
            loading={!!loading}
            loadingContent={<Skeleton className="h-4 w-24" />}
            loadedContent={
              <div className="text-gray-chateau text-xs whitespace-nowrap">
                {formatDate(data?.updated || '')}
              </div>
            }
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label className="text-silver text-xs">Rule (YAML)</Label>
        <ConditionalContent
          loading={!!loading}
          loadingContent={<Skeleton className="h-64 w-full" />}
          loadedContent={
            <Editor
              header={
                <div className="border-border flex items-center gap-2 border-b px-4 py-2">
                  <Button
                    variant="secondaryOutline"
                    size="xs"
                    className="text-2xs"
                    onClick={handleCopy}
                  >
                    <CopyIcon className="size-4" />
                    Copy
                  </Button>
                  <Button
                    variant="secondaryOutline"
                    size="xs"
                    className="text-2xs"
                    onClick={handleDownload}
                  >
                    <DownloadIcon className="size-4" />
                    Download
                  </Button>
                </div>
              }
              className="bg-primary"
              value={data?.body || ''}
              readOnly
              autoHeight
              options={{
                automaticLayout: false,
                lineNumbers: 'off',
                minimap: { enabled: false },
                wordWrap: 'off',
                scrollBeyondLastLine: false,
                scrollbar: {
                  horizontal: 'hidden',
                  vertical: 'hidden',
                  alwaysConsumeMouseWheel: false,
                },
              }}
            />
          }
        />
      </div>
      {footer}
    </div>
  );
};
