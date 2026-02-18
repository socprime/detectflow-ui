import { ActionLog } from '@/models/providers/Types/Response';

export const getActionVariant = (action: ActionLog) => {
  switch (action) {
    case 'info':
      return 'success';
    case 'warning':
      return 'warning';
    case 'error':
      return 'critical';
    default:
      return 'secondary';
  }
};

export const getActionTextColor = (action: ActionLog) => {
  switch (action) {
    case 'info':
      return 'text-success';
    case 'warning':
      return 'text-warning';
    case 'error':
      return 'text-critical';
    default:
      return 'text-gray-chateau';
  }
};
