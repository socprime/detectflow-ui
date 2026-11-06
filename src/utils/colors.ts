import { EChainStatus } from '@/enums/ChainStatus';

export const getStatusColor = (status: EChainStatus) => {
  switch (status) {
    case EChainStatus.Investigating:
      return 'lightBlue';
    case EChainStatus.Confirmed:
      return 'critical';
    case EChainStatus.FalsePositive:
      return 'warning';
    case EChainStatus.Resolved:
      return 'success';
    case EChainStatus.New:
    case EChainStatus.Closed:
    case EChainStatus.FilteredOut:
      return 'dark';
    default:
      return 'default';
  }
};

export const getStatusTextColor = (status: EChainStatus) => {
  switch (status) {
    case EChainStatus.Investigating:
      return 'text-light-blue';
    case EChainStatus.Confirmed:
      return 'text-critical';
    case EChainStatus.FalsePositive:
      return 'text-warning';
    case EChainStatus.Resolved:
      return 'text-success';
    case EChainStatus.New:
    case EChainStatus.Closed:
    case EChainStatus.FilteredOut:
    default:
      return 'text-gray-chateau';
  }
};

export const getStatusBgColor = (status: EChainStatus) => {
  switch (status) {
    case EChainStatus.Investigating:
      return 'bg-light-blue';
    case EChainStatus.Confirmed:
      return 'bg-critical';
    case EChainStatus.FalsePositive:
      return 'bg-warning';
    case EChainStatus.Resolved:
      return 'bg-success';
    case EChainStatus.New:
    case EChainStatus.Closed:
    case EChainStatus.FilteredOut:
    default:
      return 'bg-gray-chateau';
  }
};

export const getStatusHexColor = (status: EChainStatus) => {
  switch (status) {
    case EChainStatus.Investigating:
      return '#51A2FF';
    case EChainStatus.Confirmed:
      return '#EE3523';
    case EChainStatus.FalsePositive:
      return '#EE9D23';
    case EChainStatus.Resolved:
      return '#4AC18E';
    case EChainStatus.New:
    case EChainStatus.Closed:
    case EChainStatus.FilteredOut:
    default:
      return '#99A1AF';
  }
};

export const getStatusTriggerClassName = (status: EChainStatus) => {
  switch (status) {
    case EChainStatus.Investigating:
      return 'border-light-blue/50 bg-light-blue/90 text-black/90 ring-light-blue/40 focus-visible:border-light-blue/40';
    case EChainStatus.Confirmed:
      return 'border-critical/50 bg-critical/90 text-black/90 ring-critical/40 focus-visible:border-critical/40';
    case EChainStatus.FalsePositive:
      return 'border-warning/50 bg-warning/90 text-black/90 ring-warning/40 focus-visible:border-warning/40';
    case EChainStatus.Resolved:
      return 'border-success/50 bg-success/90 text-black/90 ring-success/40 focus-visible:border-success/40';
    case EChainStatus.New:
    case EChainStatus.Closed:
    case EChainStatus.FilteredOut:
      return 'border-border bg-secondary text-gray-black/90 ring-border/40 focus-visible:border-border/40';
    default:
      return 'border-border bg-secondary text-gray-black/90 ring-border/40 focus-visible:border-border/40';
  }
};
