import { ApiError } from '@/models/providers/ApiError';
import { useMappingStore } from '@/store';
import { useRepositoriesStore } from '@/store/repositories';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useMappingGenerationTracking } from './useMappingGenerationTracking';

interface UseAIGenerateDialogProps {
  isOpen: boolean;
  repositoryIds: string[];
  sourceTopics: string[];
  parsingScript: string;
  onApplyMapping: (mapping: string) => void;
  onClose: () => void;
}

export const useAIGenerateDialog = ({
  isOpen,
  repositoryIds,
  sourceTopics,
  parsingScript,
  onApplyMapping,
  onClose,
}: UseAIGenerateDialogProps) => {
  const { generateMappingPrompt, loadingMappingPrompt } = useMappingStore();
  const { repositories } = useRepositoriesStore();
  const [isCopied, setIsCopied] = useState(false);
  const [isShowAfterCopy, setIsShowAfterCopy] = useState(false);
  const [aiResponse, setAiResponse] = useState('');

  const onMappingReady = useCallback((mapping: string) => {
    setAiResponse(mapping);
  }, []);

  const { isGenerating, startGeneration, stopPolling } = useMappingGenerationTracking({
    onMappingReady,
  });

  useEffect(() => {
    if (!isOpen) {
      stopPolling();
      setAiResponse('');
      setIsCopied(false);
      setIsShowAfterCopy(false);
    }
  }, [isOpen, stopPolling]);

  const handleGenerateWithUncoderAI = async () => {
    if (!repositoryIds.length || !sourceTopics.length || !parsingScript) {
      toast.error('Please fill in all required fields');
      return;
    }

    await startGeneration({
      repository_ids: repositoryIds,
      topics: sourceTopics,
      parser_query: parsingScript,
    });
  };

  const handleCopyPrompt = async () => {
    try {
      const result = await generateMappingPrompt({
        repository_ids: repositoryIds,
        topics: sourceTopics,
        parser_query: parsingScript,
      });

      const prompt = result.prompt || '';
      let isCopiedToClipboard = false;

      try {
        await navigator.clipboard.writeText(prompt);
        isCopiedToClipboard = true;
      } catch {
        const textArea = document.createElement('textarea');
        textArea.value = prompt;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        isCopiedToClipboard = document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      if (!isCopiedToClipboard) {
        throw new Error('Failed to copy prompt to clipboard');
      }

      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
      setIsShowAfterCopy(true);
      toast.success('Prompt copied to clipboard');
    } catch (error) {
      setIsCopied(false);
      const errorMessage =
        error instanceof ApiError || error instanceof Error ? error.message : 'Unknown error';
      toast.error('Failed to copy prompt: ' + errorMessage);
      console.error('Failed to copy prompt:', error);
    }
  };

  const handleApplyMapping = () => {
    if (!aiResponse.trim()) {
      return;
    }
    onApplyMapping(aiResponse);
    onClose();
  };

  const repositoryNames = useMemo(() => {
    return repositoryIds.map((id) => {
      return repositories?.data?.find((repository) => repository.id === id)?.name;
    });
  }, [repositoryIds, repositories]);

  return {
    loadingMapping: isGenerating,
    loadingMappingPrompt,
    isCopied,
    isShowAfterCopy,
    aiResponse,
    repositoryNames,
    handleGenerateWithUncoderAI,
    handleCopyPrompt,
    handleApplyMapping,
    setAiResponse,
  };
};
