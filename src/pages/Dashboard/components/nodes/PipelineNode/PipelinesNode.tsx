import { useThemeColors } from '@/hooks';
import { useDashboardStore } from '@/store/dashboard';
import { Handle, Position } from '@xyflow/react';
import { motion } from 'motion/react';
import { memo } from 'react';
import { ANIMATION } from '../../../utils/constants';

export const PipelinesNode = memo(() => {
  const { success, warning, critical, default: textDefault } = useThemeColors();
  const pipelines = useDashboardStore((state) => state.dashboardValues?.pipelines ?? 0);
  const setTablePiplinesOpen = useDashboardStore((state) => state.setTablePiplinesOpen);
  const pipelineStatistics = useDashboardStore(
    (state) => state.dashboardData?.pipelines_stats ?? [],
  );
  const successCount = pipelineStatistics.filter(
    (pipeline) => pipeline.status_details?.level === 'info',
  ).length;
  const warningCount = pipelineStatistics.filter(
    (pipeline) => pipeline.topic_lag > 0 || pipeline.status_details?.level === 'warning',
  ).length;
  const errorCount = pipelineStatistics.filter(
    (pipeline) => pipeline.status_details.level === 'error',
  ).length;

  const statusColor =
    successCount > 0 ? success : warningCount > 0 ? warning : errorCount > 0 ? critical : success;

  return (
    <motion.div
      className="relative flex items-center justify-center"
      style={{ width: '250px', height: '250px' }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 1 }}
      onClick={() => setTablePiplinesOpen(true)}
    >
      <Handle
        className="opacity-0"
        type="target"
        position={Position.Left}
        style={{ background: statusColor }}
      />
      <Handle
        className="opacity-0"
        type="source"
        position={Position.Right}
        style={{ background: statusColor }}
      />
      <motion.div
        className="absolute"
        style={{
          width: '208px',
          height: '208px',
          left: '50%',
          top: '50%',
          marginLeft: '-104px',
          marginTop: '-104px',
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: ANIMATION.pipelinesRotationDuration,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {[...Array(60)].map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              width: '2.6px',
              height: '10.4px',
              background: statusColor,
              opacity: 0.3 - (i % 10) * 0.03,
              left: '50%',
              top: '50%',
              transformOrigin: '0 0',
              transform: `rotate(${i * 6}deg) translate(104px, -5.2px)`,
            }}
          />
        ))}
      </motion.div>
      <motion.div
        className="absolute"
        style={{
          width: '299px',
          height: '299px',
          left: '50%',
          top: '50%',
          marginLeft: '-149.5px',
          marginTop: '-149.5px',
        }}
        animate={{ rotate: -360 }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {[...Array(120)].map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              width: '1px',
              height: '16px',
              background: statusColor,
              left: '50%',
              top: '50%',
              transformOrigin: '0.5px 0px',
              transform: `rotate(${i * 3}deg) translateY(-149.5px)`,
              opacity: 0.4,
            }}
          />
        ))}
      </motion.div>
      <motion.div
        className="relative flex items-center justify-center rounded-full border-2 bg-gradient-to-br"
        style={{
          width: '166px',
          height: '166px',
          borderColor: statusColor,
          backgroundImage: `linear-gradient(to bottom right, ${statusColor}20, ${statusColor}10)`,
        }}
        animate={{
          boxShadow: [
            `0 0 52px ${statusColor}66`,
            `0 0 104px ${statusColor}99`,
            `0 0 52px ${statusColor}66`,
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="relative z-10 text-center">
          <motion.div
            className="text-4xl font-bold"
            key={pipelines}
            initial={{ scale: 1.15, opacity: 0.6 }}
            animate={{
              scale: 1,
              opacity: 1,
              color: statusColor,
            }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-[38px] font-bold">{pipelines}</span>
              <span className="flex flex-col gap-1">
                <span className="flex items-center gap-1">
                  <span className="bg-warning h-1.5 w-1.5 rounded-full"></span>
                  <span className="text-2xs" style={{ color: textDefault }}>
                    {warningCount}
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="bg-critical h-1.5 w-1.5 rounded-full"></span>
                  <span className="text-2xs" style={{ color: textDefault }}>
                    {errorCount}
                  </span>
                </span>
              </span>
            </div>
          </motion.div>
          <div className="mt-1 text-sm tracking-wider uppercase">Pipelines</div>
        </div>
        <motion.div
          className="absolute inset-0 rounded-full border-2"
          style={{ borderColor: statusColor }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      </motion.div>
    </motion.div>
  );
});
