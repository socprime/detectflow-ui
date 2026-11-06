import { useMemo } from 'react';
import { useAttackChainsTab } from './useAttackChainsTab';

import { Statistics } from '../../Statistics';
import { FilteredOut } from './Filters/FilteredOut';
import { GroupBy } from './Filters/GroupBy';
import { SelectCorrelationPipelines } from './Filters/SelectCorrelationPipelines';
import {
  PaginationWrap,
  SearchInput,
  SelectDefault,
  ServerGroupedTableBody,
  TableWrap,
} from '@socprime/react-ui';

export const AttackChainsTab = () => {
  const {
    loading,
    data,
    table,
    columns,
    page,
    limit,
    totalPages,
    search,
    filters,
    filterSelectOptions,
    isGroupedView,
    serverGroups,
    expandedGroups,
    showFilteredOut,
    handleShowFilteredOut,
    toggleGroupExpansion,
    setSearch,
    handleFilterChange,
    setPage,
    setLimit,
  } = useAttackChainsTab();

  const groupedTableBody = useMemo(
    () =>
      isGroupedView ? (
        <ServerGroupedTableBody
          groups={serverGroups}
          expandedGroups={expandedGroups}
          onToggleGroup={toggleGroupExpansion}
          table={table}
          columnsCount={columns.length}
        />
      ) : undefined,
    [isGroupedView, serverGroups, expandedGroups, toggleGroupExpansion, table, columns.length],
  );

  const filterSelectClassName = 'h-10 w-full sm:flex-0 sm:basis-[180px]';

  return (
    <div className="flex flex-col gap-4">
      <Statistics />
      <div className="flex flex-col flex-wrap gap-4 lg:flex-row">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search chains..."
          className="h-10 w-full max-w-sm"
          classNamesInput="h-10"
          disabled={loading}
        />
        <div className="flex w-full flex-1 flex-col items-stretch justify-end gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
          <FilteredOut
            className={filterSelectClassName}
            showFilteredOut={showFilteredOut}
            loading={loading}
            count={data?.filtered_out_count ?? 0}
            onClick={handleShowFilteredOut}
          />
          <SelectCorrelationPipelines
            className={filterSelectClassName}
            loading={loading}
            value={filters.pipeline}
            options={filterSelectOptions.pipeline}
            onChange={(value) => handleFilterChange(value, 'pipeline')}
          />
          <GroupBy
            className={filterSelectClassName}
            loading={loading}
            options={filterSelectOptions.group}
            value={filters.group}
            onChange={(value) => handleFilterChange(value, 'group')}
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
            options={filterSelectOptions.status}
            placeholder="All Statuses"
            value={filters.status}
            loading={loading}
            disabled={loading}
            onChange={(value) => handleFilterChange(value, 'status')}
          />
        </div>
      </div>
      <TableWrap
        classNameHeader="px-3"
        classNameCell="px-3"
        table={table}
        columns={columns}
        loading={loading}
        loadedContent={groupedTableBody}
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
