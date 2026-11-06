import { AlertTriangleIcon, CheckIcon, Loader2Icon } from 'lucide-react';
import { FC, ReactNode } from 'react';
import type { ConnectionStatus } from './useCheckConnection';

import { Button } from '@socprime/react-ui';

interface ConnectionSectionProps {
  title: string;
  description: ReactNode;
  children: ReactNode;
  disabled?: boolean;
  connectionStatus?: ConnectionStatus;
  onCheckConnection?: () => void;
}

export const ConnectionSection: FC<ConnectionSectionProps> = ({
  title,
  description,
  children,
  disabled,
  connectionStatus,
  onCheckConnection,
}) => {
  return (
    <div className="border-border bg-secondary flex flex-col gap-6 rounded-lg border p-6">
      <div className="flex flex-col gap-2">
        <h3 className="text-default text-sm font-medium">{title}</h3>
        <p className="text-2xs text-gray-chateau">{description}</p>
      </div>
      {children}
      {!!onCheckConnection && (
        <>
          <div className="divider border-border border-b" />
          <div className="flex items-center gap-3">
            <Button
              className="text-xs"
              size="m"
              variant="primary"
              type="button"
              disabled={disabled}
              onClick={onCheckConnection}
            >
              {connectionStatus === 'checking' && <Loader2Icon className="size-3.5 animate-spin" />}
              Check Connection
            </Button>
            {connectionStatus === 'success' && (
              <span className="text-success flex items-center gap-2 text-xs">
                <CheckIcon className="size-3.5" /> Connected
              </span>
            )}
            {connectionStatus === 'error' && (
              <span className="text-critical flex items-center gap-2 text-xs">
                <AlertTriangleIcon className="size-3.5" /> Connection failed
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
};
