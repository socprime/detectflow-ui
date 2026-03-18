import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { ConditionalContent } from '@/components/ConditionalContent';
import { ConfirmDeleteDialog } from '@/components/Dialog';
import { Editor, Label } from '@/components/Form';
import { Skeleton } from '@/components/Loading/Skeleton';
import { PageHeader } from '@/components/PageHeader';
import { routeHelpers, routes } from '@/models/router/routes';
import { buildExternalUrl, buildUrl } from '@/utils';
import { formatDate } from '@/utils/format';
import { Edit2Icon, ExternalLinkIcon, TrashIcon, XIcon } from 'lucide-react';
import { useRule } from './useRule';

interface RuleProps {
  backLink?: boolean;
  onClose?: () => void;
}

export const Rule: React.FC<RuleProps> = ({ backLink = true, onClose }) => {
  const {
    loading,
    ruleDetails,
    repositoryId,
    isDeleteDialogOpen,
    handleOpenDeleteDialog,
    handleCloseDeleteDialog,
    handleDeleteRule,
  } = useRule();

  return (
    <div className="flex flex-1 flex-col gap-6">
      <PageHeader
        className="flex-nowrap"
        loading={loading}
        title={ruleDetails?.name}
        description={ruleDetails?.repository_name}
        backLink={
          backLink
            ? buildUrl(routes.settingsRepositories, { repositoryId: repositoryId || 'all' })
            : undefined
        }
      >
        <div className="flex items-center gap-2 max-lg:flex-wrap">
          {ruleDetails?.id && repositoryId && (
            <div className="flex items-center gap-2 max-lg:flex-wrap">
              {ruleDetails?.repository_type !== 'local' &&
                ruleDetails?.repository_type !== 'external' && (
                  <Button
                    loading={loading}
                    size="l"
                    className="gap-2 text-xs"
                    variant="secondaryOutline"
                    href={buildExternalUrl({
                      path: '/uncoder-ai/translate/',
                      queryParams: {
                        open_code: true,
                        siemType: 'sigma',
                        rId: repositoryId,
                        cId: ruleDetails.id,
                        rType: 'custom',
                      },
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLinkIcon className="size-4" />
                    Open in Uncoder AI
                  </Button>
                )}
              <Button
                loading={loading}
                size="l"
                className="gap-2 text-xs"
                variant="secondaryOutline"
                to={routeHelpers.settingsRepositoriesRuleEdit(repositoryId, ruleDetails.id)}
              >
                <Edit2Icon className="size-4" />
                Edit rule
              </Button>
            </div>
          )}
          {onClose && (
            <Button
              loading={loading}
              size="l"
              className="border-transparent p-2 text-xs"
              variant="secondaryOutline"
              onClick={onClose}
            >
              <XIcon className="size-5" />
            </Button>
          )}
        </div>
      </PageHeader>
      <div className="border-border bg-secondary flex flex-col gap-6 rounded-sm border p-6 shadow-md">
        <div className="flex justify-between gap-8">
          <div className="flex flex-1">
            <span className="flex flex-0 flex-col items-start gap-2">
              <h6 className="text-subdued text-xs font-medium">Product/Service/Category</h6>
              <ConditionalContent
                loading={loading}
                loadingContent={<Skeleton className="h-4 w-24" />}
                loadedContent={
                  ruleDetails?.product || ruleDetails?.service || ruleDetails?.category ? (
                    <Badge
                      className="fit-content text-success text-2xs pointer-events-none flex-0 rounded-3xl font-light"
                      variant="success"
                    >
                      {`${ruleDetails.product || '-'}/${ruleDetails.service || '-'}/${ruleDetails.category || '-'}`}
                    </Badge>
                  ) : (
                    <span className="text-gray-chateau text-xs">—</span>
                  )
                }
              />
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <h6 className="text-subdued text-xs font-medium">Created</h6>
            <ConditionalContent
              loading={loading}
              loadingContent={<Skeleton className="h-4 w-24" />}
              loadedContent={
                <div className="text-gray-chateau text-xs whitespace-nowrap">
                  {formatDate(ruleDetails?.created || '')}
                </div>
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <h6 className="text-subdued text-xs font-medium">Updated</h6>
            <ConditionalContent
              loading={loading}
              loadingContent={<Skeleton className="h-4 w-24" />}
              loadedContent={
                <div className="text-gray-chateau text-xs whitespace-nowrap">
                  {formatDate(ruleDetails?.updated || '')}
                </div>
              }
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-silver text-xs">Rule (YAML)</Label>
          <ConditionalContent
            loading={loading}
            loadingContent={<Skeleton className="h-64 w-full" />}
            loadedContent={
              <Editor
                className="bg-primary"
                value={ruleDetails?.body || ''}
                readOnly
                autoHeight
                options={{
                  automaticLayout: true,
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
        {ruleDetails?.id && repositoryId && ruleDetails?.repository_type === 'local' && (
          <div className="flex justify-end gap-2">
            <Button
              loading={loading}
              size="l"
              className="gap-2 text-xs"
              variant="criticalOutline"
              onClick={handleOpenDeleteDialog}
            >
              <TrashIcon className="size-4" />
              Delete
            </Button>
          </div>
        )}
      </div>
      <ConfirmDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteRule}
        title="Delete Rule"
        message={
          <>
            Are you sure you want to delete "
            <span className="break-all">{ruleDetails?.name || 'this rule'}</span>
            "? This action cannot be undone.
          </>
        }
        loading={loading}
      />
    </div>
  );
};
