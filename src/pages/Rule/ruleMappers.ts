import type { HighOrderSigma } from '@/models/providers/Types/responses/highOrderSigma';
import type { RepositoryType } from '@/models/providers/Types/responses/repositories';
import type { RuleDetailsResponse } from '@/models/providers/Types/responses/rules';

export interface RuleViewModel {
  id: string;
  name: string;
  body: string;
  repository_name: string;
  created: string;
  updated: string;
  repository_type?: RepositoryType;
  product?: string | null;
  service?: string | null;
  category?: string | null;
  is_user_edited?: boolean;
}

export function mapRuleDetailsToViewModel(rule: RuleDetailsResponse): RuleViewModel {
  return {
    id: rule.id,
    name: rule.name,
    body: rule.body,
    repository_name: rule.repository_name,
    created: rule.created,
    updated: rule.updated,
    repository_type: rule.repository_type,
    product: rule.product,
    service: rule.service,
    category: rule.category,
  };
}

export function mapHOSDetailToViewModel(rule: HighOrderSigma): RuleViewModel {
  return {
    id: rule.id,
    name: rule.name,
    body: rule.body,
    repository_name: 'Higher Order Sigma Rule',
    created: rule.created,
    updated: rule.updated,
    is_user_edited: rule.is_user_edited,
  };
}
