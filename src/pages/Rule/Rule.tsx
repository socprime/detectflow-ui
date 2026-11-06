import { Edit2Icon, ExternalLinkIcon } from 'lucide-react';
import { useRule } from './hooks/useRule';

import { RuleDetailsContent } from '@/components/RuleDetails';
import { DisabledTooltip } from '@/components/Tooltip/DisabledTooltip';
import { usePermissions } from '@/hooks';
import { buildExternalUrl } from '@/utils';
import { Button, DefaultDialog, DeleteButtonConfirm, PageHeader } from '@socprime/react-ui';

export const Rule: React.FC = () => {
  const {
    loading,
    rule,
    repositoryId,
    isDeleteDialogOpen,
    isDeleteConflictDialogOpen,
    features,
    editLink,
    showUncoder,
    showDelete,
    backLink,
    handleOpenDeleteDialog,
    handleCloseDeleteDialog,
    handleCloseDeleteConflictDialog,
    handleDeleteRule,
    handleForceDeleteRule,
  } = useRule();
  const { isViewer } = usePermissions();

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <PageHeader
        className="flex-nowrap"
        loading={loading}
        title={rule?.name}
        description={rule?.repository_name}
        backLink={backLink}
      >
        <div className="flex items-center gap-2 max-lg:flex-wrap">
          {rule?.id && repositoryId && (
            <div className="flex items-center gap-2 max-lg:flex-wrap">
              {showUncoder && (
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
                      cId: rule.id,
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
              {editLink && (
                <DisabledTooltip disabled={isViewer}>
                  <Button
                    loading={loading}
                    size="l"
                    className="gap-2 text-xs"
                    variant="secondaryOutline"
                    {...(isViewer ? { disabled: true } : { to: editLink })}
                  >
                    <Edit2Icon className="size-4" />
                    Edit rule
                  </Button>
                </DisabledTooltip>
              )}
            </div>
          )}
        </div>
      </PageHeader>
      <RuleDetailsContent
        loading={loading}
        data={rule}
        showPSC={features.showPSC}
        footer={
          showDelete && rule?.id && repositoryId ? (
            <DisabledTooltip disabled={isViewer}>
              <DeleteButtonConfirm
                isOpen={isDeleteDialogOpen}
                onOpen={handleOpenDeleteDialog}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleDeleteRule}
                title="Delete Rule"
                message={
                  <>
                    <span className="break-all">{rule?.name || 'this rule'}</span>{' '}
                    {rule?.repository_type === 'gitlab' ? ' from GitLab' : ''}
                  </>
                }
                loading={loading}
              />
            </DisabledTooltip>
          ) : undefined
        }
      />
      <DefaultDialog
        className="sm:max-w-[600px]"
        title="Conflicting Changes"
        confirmText="Force Delete"
        confirmVariant="criticalOutline"
        isOpen={isDeleteConflictDialogOpen}
        loading={loading}
        hideFooter={false}
        onClose={handleCloseDeleteConflictDialog}
        onConfirm={handleForceDeleteRule}
      >
        <div className="text-subdued text-xs">
          There are conflicting changes on GitLab. To permanently delete the remote file and the
          local rule, use Force Delete.
        </div>
      </DefaultDialog>
    </div>
  );
};
