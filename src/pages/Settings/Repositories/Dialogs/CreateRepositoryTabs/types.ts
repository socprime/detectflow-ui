import { ReactNode } from 'react';

export interface Repository {
  id: string;
  name: string;
  description?: string;
  url?: string;
  isAdded?: boolean;
}

export interface RepositorySelectionProps {
  repositories: Repository[];
  selectedIds: string[];
  loading?: boolean;
  onSelectionChange: (ids: string[]) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

export interface RepositoryListItemProps {
  repository: Repository;
  isSelected: boolean;
  onToggle: (id: string) => void;
  externalLinkTooltip?: ReactNode;
}
