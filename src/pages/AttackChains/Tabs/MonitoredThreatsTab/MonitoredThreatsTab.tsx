import { FolderTreeIcon } from 'lucide-react';
import { ActiveThreatsDialog } from './ActiveThreatsDialog';
import { ConfirmCorrelationPipelineDialog } from './ConfirmCorrelationPipelineDialog';
import { useMonitoredThreatsTab } from './useMonitoredThreatsTab';

import { DisabledTooltip } from '@/components/Tooltip/DisabledTooltip';
import { usePermissions } from '@/hooks';
import { Button, PaginationWrap, SearchInput, SelectDefault, TableWrap } from '@socprime/react-ui';

export const MonitoredThreatsTab = () => {
  const {
    isOpen,
    currentThreat,
    loading,
    table,
    tableColumns,
    data,
    rowSelection,
    page,
    limit,
    totalPages,
    search,
    filters,
    filterSelectOptions,
    isConfirmDialogOpen,
    confirmAction,
    correlationPipelines,
    correlationPipelineOptions,
    toggleModal,
    setSearch,
    setPage,
    setLimit,
    handleFilterChange,
    handleCloseConfirmDialog,
    handleOpenConfirmDialog,
    handleDialogConfirm,
  } = useMonitoredThreatsTab();

  const filterSelectClassName = 'h-10 w-full sm:flex-0 sm:basis-[180px]';

  const { isViewer } = usePermissions();

  const selectedRows = table.getSelectedRowModel().rows;
  const selectablePageRowsCount = table
    .getRowModel()
    .rows.filter((row) => row.getCanSelect()).length;
  const hasSelected = selectedRows.length > 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col flex-wrap gap-4 lg:flex-row">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search threats..."
          className="h-10 w-full max-w-sm"
          classNamesInput="h-10"
        />
        <div className="flex w-full flex-1 flex-col items-stretch justify-end gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
          <SelectDefault
            className={filterSelectClassName}
            icon={<FolderTreeIcon className="size-4" />}
            options={filterSelectOptions.pipeline}
            placeholder="All Correlation Pipelines"
            value={filters.pipeline}
            loading={loading}
            disabled={loading}
            onChange={(value) => handleFilterChange(value, 'pipeline')}
          />
          <SelectDefault
            className={filterSelectClassName}
            options={filterSelectOptions.severity}
            placeholder="All Severities"
            value={filters.severity}
            loading={loading}
            disabled={loading}
            onChange={(value) => handleFilterChange(value, 'severity')}
          />
          <SelectDefault
            className={filterSelectClassName}
            options={filterSelectOptions.industry}
            placeholder="All Industries"
            value={filters.industry}
            loading={loading}
            disabled={loading}
            onChange={(value) => handleFilterChange(value, 'industry')}
          />
          <SelectDefault
            className={filterSelectClassName}
            options={filterSelectOptions.threatType}
            placeholder="All Threat Types"
            value={filters.threatType}
            loading={loading}
            disabled={loading}
            onChange={(value) => handleFilterChange(value, 'threatType')}
          />
          <SelectDefault
            className={filterSelectClassName}
            options={filterSelectOptions.region}
            placeholder="All Regions"
            value={filters.region}
            loading={loading}
            disabled={loading}
            onChange={(value) => handleFilterChange(value, 'region')}
          />
        </div>
      </div>
      {hasSelected && (
        <div className="bg-secondary/50 flex items-center gap-4 rounded-lg p-3">
          <span className="text-gray-chateau text-xs">
            {selectedRows.length} selected{' '}
            {selectedRows.length < selectablePageRowsCount && (
              <span
                className="text-success hover:text-success/80 cursor-pointer"
                onClick={() => table.toggleAllPageRowsSelected(true)}
              >
                (Select all {selectablePageRowsCount} items)
              </span>
            )}{' '}
            {selectedRows.length < selectablePageRowsCount && '| '}
            <span
              className="hover:text-default cursor-pointer"
              onClick={() => table.resetRowSelection()}
            >
              Deselect all
            </span>
          </span>
          <div className="flex items-center gap-2">
            <DisabledTooltip disabled={isViewer}>
              <Button
                className="dark:text-success text-xs"
                size="s"
                variant="primaryOutline"
                disabled={isViewer}
                onClick={() =>
                  handleOpenConfirmDialog(
                    selectedRows.map((r) => r.id),
                    'enable',
                  )
                }
              >
                Enable
              </Button>
            </DisabledTooltip>
            <DisabledTooltip disabled={isViewer}>
              <Button
                className="text-xs"
                size="s"
                variant="secondaryOutline"
                disabled={isViewer}
                onClick={() =>
                  handleOpenConfirmDialog(
                    selectedRows.map((r) => r.id),
                    'disable',
                  )
                }
              >
                Disable
              </Button>
            </DisabledTooltip>
          </div>
        </div>
      )}
      <TableWrap
        classNameHeader="px-3"
        classNameCell="px-3"
        table={table}
        columns={tableColumns}
        loading={loading}
        data={data}
        rowSelection={rowSelection}
      />
      <PaginationWrap
        page={page}
        totalPages={totalPages}
        limit={limit}
        setLimit={setLimit}
        onPageChange={setPage}
      />
      {isOpen && (
        <ActiveThreatsDialog isOpen={isOpen} onClose={toggleModal} threat={currentThreat} />
      )}
      {confirmAction && (
        <ConfirmCorrelationPipelineDialog
          isOpen={isConfirmDialogOpen}
          mode={confirmAction.mode}
          threatCount={confirmAction.threatIds.length}
          options={correlationPipelineOptions}
          pipelinesLoading={!correlationPipelines}
          onClose={handleCloseConfirmDialog}
          onConfirm={handleDialogConfirm}
        />
      )}
    </div>
  );
};
