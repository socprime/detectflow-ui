import { ApiError } from '@/models/providers/ApiError';
import { useLogSourcesStore } from '@/store/logSources';
import { useRepositoriesStore } from '@/store/repositories';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

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
  const { generateMapping, generateMappingPrompt, loading } = useLogSourcesStore();
  const { repositories } = useRepositoriesStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isShowAfterCopy, setIsShowAfterCopy] = useState(false);
  const [aiResponse, setAiResponse] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setAiResponse('');
      setIsCopied(false);
      setIsShowAfterCopy(false);
    }
  }, [isOpen]);

  const handleGenerateWithUncoderAI = async () => {
    if (!repositoryIds.length || !sourceTopics.length || !parsingScript) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateMapping({
        repository_ids: repositoryIds,
        topics: sourceTopics,
        parser_query: parsingScript,
      });

      setAiResponse(result.mapping || '');
      toast.success('Mapping generated successfully');
    } catch (error) {
      const errorMessage =
        error instanceof ApiError || error instanceof Error ? error.message : 'Unknown error';
      toast.error('Failed to generate mapping: ' + errorMessage);
      console.error('Failed to generate mapping:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyPrompt = async () => {
    try {
      setIsCopied(true);
      const result = await generateMappingPrompt({
        repository_ids: repositoryIds,
        topics: sourceTopics,
        parser_query: parsingScript,
      });

      try {
        await navigator.clipboard.writeText(result.prompt || '');
      } catch {
        const textArea = document.createElement('textarea');
        textArea.value = result.prompt || '';
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

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
    loading,
    isGenerating,
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
