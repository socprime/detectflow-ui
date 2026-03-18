import { Button } from '@/components/Button';
import { KeyIcon } from 'lucide-react';

interface SocPrimeEmptyStateProps {
  onConnectApi: () => void;
}

export const SocPrimeEmptyState: React.FC<SocPrimeEmptyStateProps> = ({ onConnectApi }) => (
  <div className="flex flex-col items-center justify-center px-6 py-8">
    <div className="bg-hover/30 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
      <KeyIcon size={32} className="text-success" />
    </div>
    <h4 className="text-default text-m mb-3 font-medium">Connect to SOC Prime Platform</h4>
    <p className="text-subdued max-w-sm text-center text-sm">
      Connect your SOC Prime Platform account to access and sync your cloud repositories
    </p>
    <Button variant="primary" size="l" className="mt-8 mb-10" onClick={onConnectApi}>
      Connect to API
    </Button>
  </div>
);

export const SocPrimeConnectedButEmptyState: React.FC<SocPrimeEmptyStateProps> = () => (
  <div className="flex flex-col items-center justify-center px-6 py-8">
    <div className="bg-hover/30 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
      <KeyIcon size={32} className="text-success" />
    </div>
    <h4 className="text-default text-m mb-3 font-medium">No repositories found</h4>
    <p className="text-subdued max-w-sm text-center text-sm">
      Add repositories to your workspace to get started
    </p>
  </div>
);
