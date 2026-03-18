import { ApiError } from '@/models/providers/ApiError';
import type { GenerateMappingRequest } from '@/models/providers/Types/Request';
import { useMappingStore } from '@/store';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

const POLLING_INTERVAL = 3000;

interface UseMappingGenerationTrackingProps {
  onMappingReady: (mapping: string) => void;
}

export const useMappingGenerationTracking = ({
  onMappingReady,
}: UseMappingGenerationTrackingProps) => {
  const { generateMapping, getMappingStatus } = useMappingStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const jobIdRef = useRef<string | null>(null);

  const clearPollingInterval = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  const stopPolling = useCallback(() => {
    clearPollingInterval();
    jobIdRef.current = null;
    setIsGenerating(false);
  }, [clearPollingInterval]);

  const pollStatus = useCallback(async () => {
    if (!jobIdRef.current) {
      return;
    }

    try {
      const status = await getMappingStatus(jobIdRef.current);

      if (status.status === 'queued' || status.status === 'running') {
        return;
      }

      stopPolling();

      if (status.status === 'completed') {
        onMappingReady(status.mapping || '');
        toast.success('Mapping generated successfully');
      } else if (status.status === 'failed') {
        toast.error(status.error || 'Mapping generation failed');
      }
    } catch (error) {
      stopPolling();

      if (error instanceof ApiError && error.status === 404) {
        toast.error('Mapping generation job not found');
        return;
      }

      const message =
        error instanceof ApiError || error instanceof Error ? error.message : 'Unknown error';
      toast.error('Failed to check mapping status: ' + message);
      console.error('Failed to poll mapping status:', error);
    }
  }, [getMappingStatus, onMappingReady, stopPolling]);

  const startGeneration = useCallback(
    async (data: GenerateMappingRequest) => {
      try {
        const result = await generateMapping(data);

        clearPollingInterval();
        jobIdRef.current = result.job_id;
        setIsGenerating(true);
        toast.info('Mapping generation started');

        pollingIntervalRef.current = setInterval(pollStatus, POLLING_INTERVAL);
      } catch (error) {
        setIsGenerating(false);
        const message =
          error instanceof ApiError || error instanceof Error ? error.message : 'Unknown error';
        toast.error('Failed to start mapping generation: ' + message);
        console.error('Failed to start mapping generation:', error);
      }
    },
    [generateMapping, clearPollingInterval, pollStatus],
  );

  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  return {
    isGenerating,
    startGeneration,
    stopPolling,
  };
};
