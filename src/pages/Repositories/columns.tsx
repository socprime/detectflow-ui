import { Button, Tooltip } from '@socprime/react-ui';
import type { ColumnDef } from '@tanstack/react-table';
import { ChevronRightIcon, Edit2Icon, EyeIcon, FolderIcon, FolderOpenIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { RepositoryBrowseRow } from './types';
import { getRepositoryIcon } from './utils';

import { SeverityLevel } from '@/components/SeverityLevel';
import { formatDate, normalizeFolderPath } from '@/utils';

interface CreateRepositoryBrowseColumnsProps {
  isViewer: boolean;
  buildFolderLink: (folderPath: string) => string;
  buildRuleViewLink: (repositoryId: string, ruleId: string, folderPath?: string) => string;
  buildRuleEditLink: (repositoryId: string, ruleId: string, folderPath?: string) => string;
}

export const createRepositoryBrowseColumns = ({
  isViewer,
  buildFolderLink,
  buildRuleViewLink,
  buildRuleEditLink,
}: CreateRepositoryBrowseColumnsProps): ColumnDef<RepositoryBrowseRow>[] => [
  {
    header: 'Name',
    id: 'name',
    size: 40,
    meta: { width: '350px' },
    enableSorting: true,
    cell: ({ row }) => {
      if (row.original.kind === 'folder') {
        return (
          <Link
            to={buildFolderLink(row.original.path)}
            className="text-default flex items-center justify-between gap-2 text-xs font-medium hover:underline"
          >
            <span className="flex min-w-0 items-center gap-3">
              <span className="bg-light-blue/10 text-light-blue/90 relative h-8 w-8 shrink-0 rounded-md p-1">
                <FolderIcon className="absolute top-1/2 left-1/2 size-4 -translate-x-1/2 -translate-y-1/2 transition-opacity group-hover:opacity-0" />
                <FolderOpenIcon className="absolute top-1/2 left-1/2 size-4 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100" />
              </span>
              <span className="flex flex-col" title={row.original.path}>
                <span className="truncate">{row.original.label}</span>
                <span className="text-dark-gray text-2xs shrink-0">
                  {row.original.rulesCount} rules
                </span>
              </span>
            </span>
          </Link>
        );
      }

      const { rule } = row.original;
      const ruleFolderPath = normalizeFolderPath(rule.folder_path) || undefined;

      return (
        <span className="flex items-center gap-2">
          <SeverityLevel severity={rule.level} />
          <Link
            to={buildRuleViewLink(rule.repository_id, rule.id, ruleFolderPath)}
            className="text-default flex items-center gap-2 text-xs hover:underline"
          >
            {rule.name}
          </Link>
        </span>
      );
    },
  },
  {
    header: 'Created',
    id: 'created',
    size: 15,
    meta: { width: '15%' },
    enableSorting: true,
    cell: ({ row }) => {
      if (row.original.kind === 'folder') {
        return null;
      }

      return (
        <span className="text-gray-chateau text-xs whitespace-nowrap">
          {formatDate(row.original.rule.created)}
        </span>
      );
    },
  },
  {
    header: 'Updated',
    id: 'updated',
    size: 15,
    meta: { width: '15%' },
    enableSorting: true,
    cell: ({ row }) => {
      if (row.original.kind === 'folder') {
        return null;
      }

      return (
        <span className="text-gray-chateau text-xs whitespace-nowrap">
          {formatDate(row.original.rule.updated)}
        </span>
      );
    },
  },
  {
    header: 'Repository',
    id: 'repository',
    size: 30,
    meta: { width: '200px' },
    enableSorting: true,
    cell: ({ row }) => {
      if (row.original.kind === 'folder') {
        return null;
      }

      const { rule } = row.original;

      return (
        <span className="text-gray-chateau flex items-center gap-2 text-xs">
          {getRepositoryIcon({
            id: rule.repository_id,
            type: rule.repository_type,
            className: 'size-4 min-w-4',
          })}
          <span className="truncate-1 break-all" title={rule.repository_name}>
            {rule.repository_name}
          </span>
        </span>
      );
    },
  },
  {
    header: () => <span className="flex w-full justify-end">Actions</span>,
    id: 'actions',
    size: 10,
    meta: { width: '10%' },
    enableSorting: false,
    cell: ({ row }) => {
      if (row.original.kind === 'folder') {
        return (
          <Link to={buildFolderLink(row.original.path)} className="flex w-full justify-end">
            <ChevronRightIcon className="text-gray-chateau size-4" />
          </Link>
        );
      }

      const { rule } = row.original;
      const ruleFolderPath = normalizeFolderPath(rule.folder_path) || undefined;

      return (
        <span className="flex items-center justify-end gap-2">
          <Tooltip content="View rule">
            <Button
              variant="icon"
              size="s"
              to={buildRuleViewLink(rule.repository_id, rule.id, ruleFolderPath)}
            >
              <EyeIcon className="size-4" />
            </Button>
          </Tooltip>
          <Tooltip
            content={
              isViewer ? 'This functionality is not available under your Viewer role' : 'Edit rule'
            }
          >
            <Button
              variant="icon"
              size="s"
              {...(isViewer
                ? { disabled: true }
                : { to: buildRuleEditLink(rule.repository_id, rule.id, ruleFolderPath) })}
            >
              <Edit2Icon className="size-4" />
            </Button>
          </Tooltip>
        </span>
      );
    },
  },
];
