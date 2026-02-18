import { Tooltip } from '@/components/Tooltip';
import { useDashboardStore } from '@/store/dashboard';
import { WifiIcon, WifiOffIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface ConnectionStatusProps {
  className?: string;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ className = '' }) => {
  const hasDashboardData = useDashboardStore((state) => state.dashboardData !== null);
  const sseConnected = useDashboardStore((state) => state.sseConnected);
  const sseEnabled = useDashboardStore((state) => state.sseEnabled);
  const setSSEEnabled = useDashboardStore((state) => state.setSSEEnabled);

  const handleToggle = () => {
    setSSEEnabled(!sseEnabled);
  };

  const getStatusColor = () => {
    if (!sseEnabled) return 'text-text-subdued';
    return sseConnected ? 'text-success' : 'text-warning';
  };

  const getStatusText = () => {
    if (!sseEnabled) return 'Live updates disabled';
    return sseConnected ? 'Live updates connected' : 'Connecting to live updates...';
  };

  if (!hasDashboardData) {
    return null;
  }

  return (
    <Tooltip content={getStatusText()}>
      <motion.button
        onClick={handleToggle}
        className={`hover:bg-hover relative flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${className}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {sseEnabled ? (
          <WifiIcon size={18} className={getStatusColor()} />
        ) : (
          <WifiOffIcon size={18} className={getStatusColor()} />
        )}
        {sseEnabled && sseConnected && (
          <motion.div
            className="bg-success absolute -top-1 -right-1 h-2 w-2 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.7, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
        <span className="text-subdued text-xs">
          {sseEnabled ? (sseConnected ? 'Live' : 'Connecting...') : 'Offline'}
        </span>
      </motion.button>
    </Tooltip>
  );
};
