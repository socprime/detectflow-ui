import { CopyIcon, EllipsisVerticalIcon, EyeIcon, SettingsIcon, TrashIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

import { DisabledTooltip } from '@/components/Tooltip/DisabledTooltip';
import { useModal, usePermissions } from '@/hooks';
import {
  Button,
  ConfirmDialog,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Tooltip,
} from '@socprime/react-ui';

interface TableActionsProps {
  isDuplicating?: boolean;
  detailsUrl?: string;
  updateUrl?: string;
  configureUrl?: string;
  pipelineName?: string;
  deleteTitle?: string;
  onDuplicate?: () => void;
  onDelete?: () => void | Promise<void>;
}

export const TableActions: React.FC<TableActionsProps> = ({
  isDuplicating,
  detailsUrl,
  updateUrl,
  configureUrl,
  pipelineName,
  deleteTitle = 'Delete Pipeline',
  onDuplicate,
  onDelete,
}) => {
  const { isOpen, openModal, closeModal } = useModal();
  const { isViewer } = usePermissions();

  const handleConfirm = async () => {
    if (!onDelete) {
      return;
    }

    try {
      await onDelete();
      closeModal();
    } catch {
      return;
    }
  };

  return (
    <span className="flex items-center justify-end gap-2">
      {detailsUrl && (
        <Tooltip content="View Pipeline">
          <Button variant="icon" size="s" to={detailsUrl}>
            <EyeIcon className="size-4" />
          </Button>
        </Tooltip>
      )}
      {configureUrl && (
        <Tooltip content="Configure Pipeline">
          <Button variant="icon" size="s" to={configureUrl}>
            <SettingsIcon className="size-4" />
          </Button>
        </Tooltip>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="icon" size="s" aria-label="Pipeline actions">
            <EllipsisVerticalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="border-border bg-secondary w-[160px]">
          {onDuplicate && (
            <DisabledTooltip className="block" disabled={isViewer}>
              <DropdownMenuItem
                className="flex items-center gap-2 text-xs"
                onSelect={onDuplicate}
                disabled={isDuplicating || isViewer}
              >
                <CopyIcon className="size-4" />
                Duplicate
              </DropdownMenuItem>
            </DisabledTooltip>
          )}
          {updateUrl && (
            <DropdownMenuItem asChild>
              <Link className="flex items-center gap-2 text-xs" to={updateUrl}>
                <SettingsIcon className="size-4" />
                Configure
              </Link>
            </DropdownMenuItem>
          )}
          {onDelete && (
            <DisabledTooltip className="block" disabled={isViewer}>
              <DropdownMenuItem
                className="text-critical flex items-center gap-2 text-xs"
                onSelect={openModal}
                disabled={isViewer}
              >
                <TrashIcon className="size-4" />
                Delete
              </DropdownMenuItem>
            </DisabledTooltip>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {onDelete && isOpen && (
        <ConfirmDialog
          isOpen={isOpen}
          title={deleteTitle}
          message={
            <p className="text-default text-xs">
              Are you sure you want to delete "<span className="break-all">{pipelineName}</span>
              "? This action cannot be undone.
            </p>
          }
          onClose={closeModal}
          onConfirm={handleConfirm}
        />
      )}
    </span>
  );
};
