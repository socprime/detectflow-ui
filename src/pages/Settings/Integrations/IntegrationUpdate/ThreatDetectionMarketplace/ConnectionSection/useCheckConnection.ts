import { useState } from 'react';

export type ConnectionStatus = 'idle' | 'checking' | 'success' | 'error';

export const useCheckConnection = () => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('idle');

  const runCheck = async (checkFn: () => Promise<{ success: boolean; message?: string }>) => {
    setConnectionStatus('checking');
    try {
      const result = await checkFn();
      setConnectionStatus(result.success ? 'success' : 'error');
      return result;
    } catch {
      setConnectionStatus('error');
      return null;
    }
  };

  const resetConnection = () => setConnectionStatus('idle');

  return {
    connectionStatus,
    isChecking: connectionStatus === 'checking',
    isConnected: connectionStatus === 'success',
    runCheck,
    resetConnection,
    setConnectionStatus,
  };
};
