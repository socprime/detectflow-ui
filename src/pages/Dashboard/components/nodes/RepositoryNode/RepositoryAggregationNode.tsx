import { useThemeColors } from '@/hooks';
import { useDashboardStore } from '@/store/dashboard';
import { Handle, Position } from '@xyflow/react';
import { motion } from 'motion/react';
import { memo, useMemo } from 'react';

export const RepositoryAggregationNode = memo(() => {
  const { primary, default: textDefault } = useThemeColors();
  const structure = useDashboardStore((state) => state.dashboardStructure);
  const values = useDashboardStore((state) => state.dashboardValues);
  const selectedNode = useDashboardStore((state) => state.selectedNode);
  const selectedRepos = useDashboardStore((state) => state.selectedRepos);

  const displayValue = useMemo(() => {
    if (!structure || !values) return 0;

    if (!selectedNode) {
      return values.repositoriesTotal;
    }

    let totalRules = 0;
    selectedRepos.forEach((nodeId) => {
      if (nodeId === 'repo-more') {
        const collapsedRepos = structure.repositories.slice(4);
        totalRules += collapsedRepos.reduce((sum, r) => sum + r.rulesCount, 0);
      } else {
        const repoId = nodeId.replace('repo-', '');
        const repo = structure.repositories.find((r) => r.id === repoId);
        if (repo) {
          totalRules += repo.rulesCount;
        }
      }
    });

    if (
      selectedNode.type !== 'repository' &&
      selectedNode.type !== 'repoMore' &&
      selectedRepos.length === 0
    ) {
      return values.repositoriesTotal;
    }

    return totalRules;
  }, [structure, values, selectedNode, selectedRepos]);

  return (
    <motion.div
      className="min-w-[120px] cursor-default rounded-lg shadow-xl"
      style={{ backgroundColor: primary }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      <Handle className="bg-success opacity-0" type="target" position={Position.Left} />
      <Handle className="bg-success opacity-0" type="source" position={Position.Right} />
      <div className="bg-success/20 border-success rounded-lg border py-2 pr-1.5 pl-1.5">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="bg-success h-2 w-2 rounded-full" />
            <div className="bg-success absolute inset-0 h-2 w-2 animate-ping rounded-full opacity-75" />
          </div>
          <div className="text-3xs tracking-wider uppercase" style={{ color: textDefault }}>
            Total Rules
          </div>
        </div>
        <div className="text-success pl-0.5 text-2xl">{displayValue.toLocaleString()}</div>
      </div>
    </motion.div>
  );
});
