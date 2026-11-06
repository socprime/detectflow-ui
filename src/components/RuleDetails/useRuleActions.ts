import { useCallback } from 'react';

import { copyToClipboard, downloadFile } from '@/utils';

interface RuleActionsProps {
  name?: string;
  body?: string;
}

export const useRuleActions = ({ name, body }: RuleActionsProps) => {
  const handleCopy = useCallback(async () => {
    if (!body) {
      return;
    }

    await copyToClipboard(body);
  }, [body]);

  const handleDownload = useCallback(() => {
    if (!body || !name) {
      return;
    }

    downloadFile(body, name.replace(/\s+/g, '_'), 'yaml');
  }, [body, name]);

  return {
    handleCopy,
    handleDownload,
  };
};
