import { ActiveThreatPipelineMonitoring } from '@/models/providers';
import { useActiveThreatsStore } from '@/store';
import { toast } from '@/utils/toast';
import { useState } from 'react';
import { CorrelationPipelineDialogVariant } from './CorrelationPipelineDialog';

type DialogState =
  | { variant: Extract<CorrelationPipelineDialogVariant, 'block' | 'unblock'> }
  | { variant: 'suppress'; pipeline: ActiveThreatPipelineMonitoring }
  | null;

export const useCorrelationPipelines = () => {
  const loading = useActiveThreatsStore((state) => state.loading);
  const detail = useActiveThreatsStore((state) => state.detail);
  const setBlocked = useActiveThreatsStore((state) => state.setBlocked);
  const setPipelineMonitoring = useActiveThreatsStore((state) => state.setPipelineMonitoring);
  const fetchById = useActiveThreatsStore((state) => state.fetchById);

  const [dialog, setDialog] = useState<DialogState>(null);
  const [submitting, setSubmitting] = useState(false);

  const pipelines = detail?.pipelines ?? [];
  const isBlocked = detail?.is_blocked ?? false;

  const handleConfirm = async () => {
    if (!detail || !dialog) {
      return;
    }
    setSubmitting(true);
    try {
      if (dialog.variant === 'suppress') {
        await setPipelineMonitoring(
          detail.tdm_id,
          dialog.pipeline.correlation_pipeline_id,
          { monitored: false },
          false,
        );
      } else {
        await setBlocked(detail.tdm_id, { blocked: dialog.variant === 'block' }, false);
      }
      await fetchById(detail.tdm_id, false);
      setDialog(null);
    } catch (error) {
      toast.error('Failed to update threat monitoring');
      console.error('Failed to update threat monitoring:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePipeline = async (item: ActiveThreatPipelineMonitoring, monitored: boolean) => {
    if (!detail) {
      return;
    }
    if (!monitored) {
      setDialog({ variant: 'suppress', pipeline: item });
      return;
    }
    try {
      await setPipelineMonitoring(
        detail.tdm_id,
        item.correlation_pipeline_id,
        { monitored: true },
        false,
      );
      await fetchById(detail.tdm_id, false);
    } catch (error) {
      toast.error('Failed to enable threat in pipeline');
      console.error('Failed to enable threat in pipeline:', error);
    }
  };
  return {
    loading,
    detail,
    pipelines,
    isBlocked,
    submitting,
    dialog,
    setDialog,
    handleConfirm,
    handleTogglePipeline,
  };
};
