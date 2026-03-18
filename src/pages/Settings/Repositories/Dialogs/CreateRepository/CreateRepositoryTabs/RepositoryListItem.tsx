import { Checkbox } from '@/components/Form';
import { Tooltip } from '@/components/Tooltip';
import { cn } from '@/utils';
import { ExternalLinkIcon } from 'lucide-react';
import type { RepositoryListItemProps } from './types';

export const RepositoryListItem: React.FC<RepositoryListItemProps> = ({
  repository,
  isSelected,
  externalLinkTooltip,
  onToggle,
}) => {
  const { id, name, description, url, isAdded } = repository;

  const linkElement = url && (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className={cn(
        'text-gray-chateau hover:text-success transition-opacity',
        isAdded ? 'pointer-events-auto opacity-100' : 'opacity-0 group-hover:opacity-100',
      )}
    >
      <ExternalLinkIcon className="size-4" />
    </a>
  );

  return (
    <label
      className={cn(
        'group bg-primary flex items-center gap-3 rounded-md border p-3 transition-colors',
        isAdded ? 'border-border pointer-events-none opacity-50' : 'cursor-pointer',
        !isAdded &&
          (isSelected
            ? 'border-success hover:border-success bg-primary/10'
            : 'border-border hover:border-gray-500'),
      )}
    >
      {!isAdded && (
        <Checkbox checked={isSelected} onCheckedChange={() => onToggle(id)} disabled={isAdded} />
      )}
      <div className="flex flex-1 flex-col gap-1">
        <span className="text-default text-xs font-medium">{name}</span>
        {isAdded ? (
          <span className="text-subdued text-2xs">Already added</span>
        ) : (
          description && <span className="text-subdued text-2xs">{description}</span>
        )}
      </div>
      {externalLinkTooltip ? (
        <Tooltip content={externalLinkTooltip}>{linkElement}</Tooltip>
      ) : (
        linkElement
      )}
    </label>
  );
};
