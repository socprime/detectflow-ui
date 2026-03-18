import { useThemeColors } from '@/hooks/useThemeColors';
import { useDashboardStore } from '@/store/dashboard';
import { type Edge } from '@xyflow/react';
import { useMemo, useRef } from 'react';
import { LAYOUT } from '../utils/constants';

const MIN_WIDTH = 1;
const MAX_WIDTH = 10;
const EMPTY_PIPELINES: never[] = [];

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const safeMetric = (value: unknown) => {
  const num = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(num) && num >= 0 ? num : 0;
};

const scaleWidth = (value: number, maxValue: number) => {
  const safeValue = safeMetric(value);
  const safeMax = safeMetric(maxValue);
  if (safeMax <= 0) return MIN_WIDTH;
  const scaled = MIN_WIDTH + (safeValue / safeMax) * (MAX_WIDTH - MIN_WIDTH);
  return clamp(Math.round(scaled), MIN_WIDTH, MAX_WIDTH);
};

export const useDashboardEdges = () => {
  const { lightBlue, success, purple } = useThemeColors();
  const isFirstLoadForEdgesRef = useRef(true);
  const prevCacheKeyRef = useRef<string>('');
  const dashboardStructure = useDashboardStore((state) => state.dashboardStructure);
  const pipelineStatistics = useDashboardStore(
    (state) => state.dashboardData?.pipelines_stats ?? EMPTY_PIPELINES,
  );
  const structure = dashboardStructure;

  const allPipelinesFailedOrWarning = useMemo(() => {
    if (pipelineStatistics.length === 0) return false;

    return pipelineStatistics.every((pipeline) => {
      const level = pipeline.status_details?.level;
      const status = pipeline.status?.toLowerCase();

      const isBadLevel = level === 'error' || level === 'warning';
      const isBadStatus = status === 'failed' || status === 'warning' || status === 'error';
      const hasLag = pipeline.topic_lag > 0;

      return isBadLevel || isBadStatus || hasLag;
    });
  }, [pipelineStatistics]);

  const prevEdgesRef = useRef<Edge[]>([]);
  const structureKey = useMemo(() => {
    if (!structure) return '';
    return `${structure.sourceTopics
      .map((t) => `${t.id}:${safeMetric(t.eps)}`)
      .sort()
      .join(',')}_${structure.repositories
      .map((r) => `${r.id}:${safeMetric(r.rulesCount)}`)
      .sort()
      .join(',')}_${structure.destinationTopics
      .map((t) => `${t.id}:${safeMetric(t.taggedEps) + safeMetric(t.untaggedEps)}`)
      .sort()
      .join(',')}`;
  }, [structure]);

  const cacheKey = `${structureKey}_${lightBlue}_${success}_${purple}_${allPipelinesFailedOrWarning}`;

  const edges = useMemo<Edge[]>(() => {
    if (cacheKey === prevCacheKeyRef.current && prevEdgesRef.current.length > 0) {
      return prevEdgesRef.current;
    }

    if (!structure) {
      prevEdgesRef.current = [];
      prevCacheKeyRef.current = cacheKey;
      return [];
    }

    const list: Edge[] = [];
    const animateOnMount = isFirstLoadForEdgesRef.current;

    const add = (
      id: string,
      source: string,
      target: string,
      color: string,
      width: number,
      particleCount = 2,
      shape: 'circle' | 'square' | 'triangle' = 'circle',
      delay = 0,
      disableAnimation = false,
    ) => {
      list.push({
        id,
        source,
        target,
        type: 'animated',
        style: {
          stroke: color,
          strokeWidth: width,
          opacity: id.includes('agg') || id.includes('pipelines') ? 0.63 : 0.42,
        },
        data: {
          color,
          particleCount,
          shape,
          animationDelay: delay,
          shouldAnimateOnMount: animateOnMount,
          disableAnimation,
        },
      });
    };

    const sourceValues = structure.sourceTopics.map((t) => safeMetric(t.eps));
    const maxSourceValue = Math.max(0, ...sourceValues);
    let sourceAggWidth = 0;
    const visibleSources = structure.sourceTopics.slice(0, LAYOUT.maxVisibleNodes);

    visibleSources.forEach((t, i) => {
      const w = scaleWidth(safeMetric(t.eps), maxSourceValue);
      sourceAggWidth += w;
      add(
        `e-source-${t.id}`,
        `source-${t.id}`,
        'source-aggregation',
        lightBlue,
        w,
        2,
        'square',
        i * 100,
      );
    });

    if (structure.sourceTopics.length > LAYOUT.maxVisibleNodes) {
      const collapsedValue = structure.sourceTopics
        .slice(LAYOUT.maxVisibleNodes)
        .reduce((sum, t) => sum + safeMetric(t.eps), 0);
      const collapsedW = scaleWidth(collapsedValue, maxSourceValue);
      sourceAggWidth += collapsedW;
      add(
        'e-source-more',
        'source-more',
        'source-aggregation',
        lightBlue,
        collapsedW,
        2,
        'square',
        visibleSources.length * 100,
      );
    }
    add(
      'e-source-agg-pipelines',
      'source-aggregation',
      'central-pipelines',
      lightBlue,
      clamp(sourceAggWidth, MIN_WIDTH, MAX_WIDTH),
      4,
      'square',
      500,
    );

    const repoValues = structure.repositories.map((r) => safeMetric(r.rulesCount));
    const maxRepoValue = Math.max(0, ...repoValues);
    let repoAggWidth = 0;
    const visibleRepos = structure.repositories.slice(0, LAYOUT.maxVisibleNodes);

    visibleRepos.forEach((r, i) => {
      const w = scaleWidth(safeMetric(r.rulesCount), maxRepoValue);
      repoAggWidth += w;
      add(
        `e-repo-${r.id}`,
        `repo-${r.id}`,
        'repo-aggregation',
        success,
        w,
        2,
        'circle',
        500 + i * 100,
      );
    });

    if (structure.repositories.length > LAYOUT.maxVisibleNodes) {
      const collapsedValue = structure.repositories
        .slice(LAYOUT.maxVisibleNodes)
        .reduce((sum, r) => sum + safeMetric(r.rulesCount), 0);
      const collapsedW = scaleWidth(collapsedValue, maxRepoValue);
      repoAggWidth += collapsedW;
      add(
        'e-repo-more',
        'repo-more',
        'repo-aggregation',
        success,
        collapsedW,
        2,
        'circle',
        500 + visibleRepos.length * 100,
      );
    }
    add(
      'e-repo-agg-pipelines',
      'repo-aggregation',
      'central-pipelines',
      success,
      clamp(repoAggWidth, MIN_WIDTH, MAX_WIDTH),
      4,
      'circle',
      1000,
    );

    const destValues = structure.destinationTopics.map(
      (t) => safeMetric(t.taggedEps) + safeMetric(t.untaggedEps),
    );
    const maxDestValue = Math.max(0, ...destValues);
    const visibleDests = structure.destinationTopics.slice(0, LAYOUT.maxVisibleNodes);
    const destWidths = visibleDests.map((t) =>
      scaleWidth(safeMetric(t.taggedEps) + safeMetric(t.untaggedEps), maxDestValue),
    );
    const collapsedDestValue = structure.destinationTopics
      .slice(LAYOUT.maxVisibleNodes)
      .reduce((sum, t) => sum + safeMetric(t.taggedEps) + safeMetric(t.untaggedEps), 0);
    const collapsedDestWidth =
      structure.destinationTopics.length > LAYOUT.maxVisibleNodes
        ? scaleWidth(collapsedDestValue, maxDestValue)
        : 0;
    const destAggWidth = destWidths.reduce((sum, w) => sum + w, 0) + collapsedDestWidth;
    const totalToDest = clamp(destAggWidth, MIN_WIDTH, MAX_WIDTH);
    add(
      'e-pipelines-dest-agg',
      'central-pipelines',
      'destination-aggregation',
      purple,
      totalToDest,
      4,
      'triangle',
      1500,
      allPipelinesFailedOrWarning,
    );

    visibleDests.forEach((t, i) => {
      const w = destWidths[i] ?? MIN_WIDTH;
      add(
        `e-dest-${t.id}`,
        'destination-aggregation',
        `dest-${t.id}`,
        purple,
        w,
        2,
        'triangle',
        2000 + i * 150,
        allPipelinesFailedOrWarning,
      );
    });
    if (structure.destinationTopics.length > LAYOUT.maxVisibleNodes) {
      const w = collapsedDestWidth;
      add(
        'e-dest-more',
        'destination-aggregation',
        'dest-more',
        purple,
        w,
        2,
        'triangle',
        2000 + visibleDests.length * 150,
        allPipelinesFailedOrWarning,
      );
    }

    isFirstLoadForEdgesRef.current = false;
    prevEdgesRef.current = list;
    prevCacheKeyRef.current = cacheKey;
    return list;
  }, [cacheKey]);

  return { edges };
};
