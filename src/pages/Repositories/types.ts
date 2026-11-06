import type { Rule } from '@/models/providers/Types/responses/rules';

export type RepositoryBrowseRow =
  | {
      kind: 'folder';
      path: string;
      label: string;
      rulesCount: number;
    }
  | {
      kind: 'rule';
      rule: Rule;
    };
