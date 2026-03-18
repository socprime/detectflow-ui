import { useCallback, useState } from 'react';
import { toast } from 'sonner';

export interface FileWithContent {
  file?: File;
  name: string;
  content: string;
  ruleName?: string;
}

const getFileKey = (file: FileWithContent): string => {
  if (file.file) {
    const path = (file.file as any).webkitRelativePath || file.file.name;
    return `${path}-${file.file.size}-${file.file.lastModified}`;
  }
  return `${file.name}-${file.content.length}`;
};

export const useFileList = (maxFiles?: number) => {
  const [files, setFiles] = useState<FileWithContent[]>([]);

  const addFiles = useCallback(
    (incomingFiles: FileWithContent[]) => {
      if (incomingFiles.length === 0) {
        return;
      }
      setFiles((prev) => {
        const existingKeys = new Set(prev.map(getFileKey));
        const newFiles = incomingFiles.filter((f) => !existingKeys.has(getFileKey(f)));

        if (newFiles.length === 0) {
          toast.info('All selected files are already in the list.');
          return prev;
        }

        const duplicatesSkipped = incomingFiles.length - newFiles.length;

        if (maxFiles !== undefined && prev.length + newFiles.length > maxFiles) {
          toast.error(
            `Cannot add ${newFiles.length.toLocaleString()} file(s): total would be ${(prev.length + newFiles.length).toLocaleString()}, exceeding the limit of ${maxFiles.toLocaleString()}. Currently ${prev.length.toLocaleString()} file(s) in the list.`,
          );
          return prev;
        }

        if (duplicatesSkipped > 0) {
          toast.info(`Added ${newFiles.length} new file(s). ${duplicatesSkipped} duplicate(s) skipped.`);
        }

        return [...prev, ...newFiles];
      });
    },
    [maxFiles],
  );

  const handleRemoveFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleClearFiles = useCallback(() => {
    setFiles([]);
  }, []);

  return {
    files,
    addFiles,
    handleRemoveFile,
    handleClearFiles,
  };
};
