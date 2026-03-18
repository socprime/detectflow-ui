import { Button } from '@/components/Button';
import { Label, SearchInput, Switch } from '@/components/Form';
import { Skeleton } from '@/components/Loading/Skeleton';
import { PageHeader } from '@/components/PageHeader';
import { PaginationWrap } from '@/components/Pagination';
import { TableWrap } from '@/components/Table';
import { routeHelpers, routes } from '@/models/router/routes';
import { Rule } from '@/pages/Settings/Repositories/Rule';
import { ActivityIcon, AlertCircle, CheckCircle2, HashIcon, SettingsIcon } from 'lucide-react';
import { PipelineDescription } from './PipelineDescription';
import { usePipelineDetails } from './usePipelineDetails';

export const PipelineDetails = () => {
  const {
    loading,
    loadingRules,
    checkboxLoading,
    pipeline,
    table,
    page,
    rules,
    totalPages,
    search,
    selectedRules,
    rowSelection,
    isRuleDialogOpen,
    columns,
    hideUnmatchedRules,
    limit,
    setHideUnmatchedRules,
    setPage,
    setSearch,
    setLimit,
    handleCloseRuleDialog,
    handleActivateRules,
  } = usePipelineDetails();

  if (isRuleDialogOpen) {
    return (
      <div className="flex-colbg-primary flex w-full gap-6 p-6">
        <Rule backLink={false} onClose={handleCloseRuleDialog} />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6 p-6">
      <PageHeader
        loading={loading}
        title={pipeline?.name}
        description={pipeline ? <PipelineDescription pipeline={pipeline} /> : 'Pipeline Details'}
        backLink={routes.pipelines}
      >
        <Button
          className="text-xs"
          size="l"
          to={routeHelpers.pipelinesEdit(pipeline?.id || '')}
          variant="secondaryOutline"
        >
          <SettingsIcon className="size-4" />
          Configure Pipeline
        </Button>
      </PageHeader>
      <div className="flex flex-wrap gap-6">
        <div className="border-border bg-secondary align-center flex flex-1 rounded-lg border p-6">
          <div className="flex items-center gap-3">
            <div className="bg-warning/10 flex items-center justify-center rounded-lg p-3">
              <ActivityIcon size={24} className="text-warning" />
            </div>
            <div className="flex flex-col">
              <p className="text-gray-chateau text-xs">Tagged Events</p>
              <div className="text-default text-lg font-semibold">
                {loading ? <Skeleton className="h-4 w-10" /> : pipeline?.events_tagged}
              </div>
            </div>
          </div>
        </div>
        <div className="border-border bg-secondary align-center flex flex-1 rounded-lg border p-6">
          <div className="flex items-center gap-3">
            <div className="bg-gray-chateau/10 flex items-center justify-center rounded-lg p-3">
              <AlertCircle size={24} className="text-subdued" />
            </div>
            <div className="flex flex-col">
              <p className="text-gray-chateau text-xs">Not Tagged Events</p>
              <div className="text-default text-lg font-semibold">
                {loading ? <Skeleton className="h-4 w-10" /> : pipeline?.events_untagged}
              </div>
            </div>
          </div>
        </div>
        <div className="border-border bg-secondary align-center flex flex-1 rounded-lg border p-6">
          <div className="flex items-center gap-3">
            <div className="bg-success/10 flex items-center justify-center rounded-lg p-3">
              <CheckCircle2 size={24} className="text-success" />
            </div>
            <div className="flex flex-col">
              <p className="text-gray-chateau text-xs">Active Rules</p>
              <div className="text-default text-lg font-semibold">
                {loading ? <Skeleton className="h-4 w-10" /> : pipeline?.active_rules}
              </div>
            </div>
          </div>
        </div>
        <div className="border-border bg-secondary align-center flex flex-1 rounded-lg border p-6">
          <div className="flex items-center gap-3">
            <div className="bg-light-blue/10 flex items-center justify-center rounded-lg p-3">
              <HashIcon size={24} className="text-light-blue" />
            </div>
            <div className="flex flex-col">
              <p className="text-gray-chateau text-xs">Matched Rules</p>
              <div className="text-default text-lg font-semibold">
                {loading ? <Skeleton className="h-4 w-10" /> : pipeline?.matched_rules}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="align-center flex justify-between gap-6">
        <div className="flex flex-1 items-center gap-4">
          {selectedRules.length > 0 && (
            <>
              <span className="text-gray-chateau text-2xs">
                {selectedRules.length} rules selected
              </span>
              <div className="flex items-center gap-3">
                <Button
                  variant="secondaryOutline"
                  className="text-xs"
                  onClick={() => handleActivateRules('enable')}
                  disabled={checkboxLoading}
                >
                  Activate
                </Button>
                <Button
                  variant="secondaryOutline"
                  className="text-xs"
                  onClick={() => handleActivateRules('disable')}
                  disabled={checkboxLoading}
                >
                  Deactivate
                </Button>
              </div>
            </>
          )}
        </div>
        <>
          <div className="flex items-center gap-3">
            <Switch
              disabled={loading}
              id="hide-unmatched-rules"
              name="hide_unmatched_rules"
              checked={hideUnmatchedRules}
              onCheckedChange={setHideUnmatchedRules}
            />
            <div className="flex flex-col">
              <Label htmlFor="save-untagged-events" className="text-subdued text-xs">
                Hide unmatched rules
              </Label>
            </div>
          </div>
          <SearchInput
            className="text-xs"
            classNamesInput="h-10"
            placeholder="Search rules..."
            value={search}
            onChange={setSearch}
          />
        </>
      </div>
      <TableWrap
        table={table}
        columns={columns}
        loading={loadingRules}
        data={rules}
        rowSelection={rowSelection}
      />
      <PaginationWrap
        page={page}
        totalPages={totalPages}
        limit={limit}
        setLimit={setLimit}
        onPageChange={setPage}
      />
    </div>
  );
};
