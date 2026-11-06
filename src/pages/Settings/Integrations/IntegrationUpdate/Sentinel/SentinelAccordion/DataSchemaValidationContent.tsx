import { CheckIcon, InfoIcon, Loader2Icon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button, EmptyState } from '@socprime/react-ui';

const CONTENT_HEIGHT_CLASS = 'h-[650px]';

interface DataSchemaValidationProps {
  isConnected: boolean;
}

export const DataSchemaValidation: React.FC<DataSchemaValidationProps> = ({ isConnected }) => {
  const [fetchStatus, setFetchStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const fetchFieldsFromSiem = () => {
    setFetchStatus('loading');
    // TODO: connect to real API
    timeoutRef.current = setTimeout(() => {
      setFetchStatus('success');
    }, 2000);
  };

  if (fetchStatus === 'loading') {
    return (
      <div
        className={`flex ${CONTENT_HEIGHT_CLASS} flex-col items-center justify-center gap-4 p-6`}
      >
        <Loader2Icon className="text-gray-chateau size-12 animate-spin" />
        <p className="text-gray-chateau text-sm">Fetching fields from SIEM</p>
      </div>
    );
  }

  if (fetchStatus === 'success') {
    return (
      <div
        className={`flex ${CONTENT_HEIGHT_CLASS} flex-col items-center justify-center gap-4 p-6`}
      >
        <p className="text-gray-chateau text-sm">Field mapping table — TBD</p>
      </div>
    );
  }

  return (
    <div className={`flex ${CONTENT_HEIGHT_CLASS} flex-col items-center justify-center gap-6 p-6`}>
      <EmptyState
        IconNode={
          isConnected ? (
            <div className="bg-success/10 mb-6 flex h-24 w-24 items-center justify-center rounded-full">
              <CheckIcon size={48} className="text-success" />
            </div>
          ) : (
            <div className="bg-border/30 mb-6 flex h-24 w-24 items-center justify-center rounded-full">
              <InfoIcon size={48} className="text-gray-chateau" />
            </div>
          )
        }
        title={isConnected ? 'Connection Successful' : 'Connection Required'}
        description={
          isConnected
            ? 'Your connection has been verified. Click the button below to fetch fields from your SIEM.'
            : 'Please fill in your credentials and click "Check Connection" to start working with field mapping.'
        }
        actions={
          isConnected ? (
            <Button onClick={fetchFieldsFromSiem} variant="primary" size="l">
              Fetch fields from SIEM
            </Button>
          ) : null
        }
      />
    </div>
  );
};
