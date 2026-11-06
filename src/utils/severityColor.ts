import {
  ArrowDownRightIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ArrowUpRightIcon,
  type LucideIcon,
} from 'lucide-react';

export type TSeverity = 'Critical' | 'High' | 'Medium' | 'Low';
export type TLevel = 'critical' | 'high' | 'medium' | 'low' | 'informational';

export const levelToSeverity = (level: TLevel): TSeverity => {
  const normalized = level?.trim().toLowerCase();

  switch (normalized) {
    case 'critical':
      return 'Critical';
    case 'high':
      return 'High';
    case 'medium':
      return 'Medium';
    case 'low':
    default:
      return 'Low';
  }
};

export const severityColor = (severity: TSeverity) => {
  switch (severity) {
    case 'Low':
      return 'success';
    case 'Medium':
      return 'yellow';
    case 'High':
      return 'warning';
    case 'Critical':
      return 'critical';
    default:
      return 'success';
  }
};

export const severityTextColor = (severity: TSeverity) => {
  switch (severity) {
    case 'Low':
      return 'text-light-blue';
    case 'Medium':
      return 'text-yellow';
    case 'High':
      return 'text-warning';
    case 'Critical':
      return 'text-critical';
    default:
      return 'text-gray-chateau';
  }
};

export const arrowIcon = (severity: TSeverity): LucideIcon => {
  switch (severity) {
    case 'Low':
      return ArrowDownRightIcon;
    case 'Medium':
      return ArrowRightIcon;
    case 'High':
      return ArrowUpRightIcon;
    case 'Critical':
      return ArrowUpIcon;
    default:
      return ArrowDownRightIcon;
  }
};
