import { useRepositoriesStore } from '@/store/repositories';
import { useRulesStore } from '@/store/rules';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import {
  extractYamlFilesFromZip,
  getAllRuleFiles,
  getAllRuleFilesFromDataTransfer,
  isValidZipFile,
  parseYamlTitle,
  readFileContent,
  ZipPasswordRequiredError,
} from './utils';

interface FileWithContent {
  file?: File;
  name: string;
  content: string;
  ruleName?: string;
}

export const useUploadRules = (repositoryId: string | undefined, onClose: () => void) => {
  const { createRule, fetchRules } = useRulesStore();
  const { fetchRepositories } = useRepositoriesStore();
  const [files, setFiles] = useState<FileWithContent[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [archivePassword, setArchivePassword] = useState('');
  const [archivePasswordError, setArchivePasswordError] = useState<string | null>(null);
  const [pendingArchives, setPendingArchives] = useState<File[]>([]);
  const [isArchiveProcessing, setIsArchiveProcessing] = useState(false);
  const [archiveProgress, setArchiveProgress] = useState<{
    percent: number;
    archiveName: string;
    loadedBytes: number;
    totalBytes: number;
  } | null>(null);

  const handleClose = useCallback(() => {
    setFiles([]);
    setProgress(0);
    setIsDragging(false);
    setArchivePassword('');
    setArchivePasswordError(null);
    setPendingArchives([]);
    setArchiveProgress(null);
    onClose();
  }, [onClose]);

  const addFiles = useCallback((incomingFiles: FileWithContent[]) => {
    if (incomingFiles.length === 0) return;
    setFiles((prev) => {
      const getKey = (file: FileWithContent) => {
        if (file.file) {
          const path = (file.file as any).webkitRelativePath || file.file.name;
          return `${path}-${file.file.size}-${file.file.lastModified}`;
        }

        return `${file.name}-${file.content.length}`;
      };

      const existingKeys = new Set(prev.map(getKey));
      const newFiles = incomingFiles.filter((f) => !existingKeys.has(getKey(f)));

      if (newFiles.length === 0) {
        toast.info('All selected files are already in the list.');
        return prev;
      }

      if (newFiles.length < incomingFiles.length) {
        toast.info(
          `Added ${newFiles.length} new file(s). ${incomingFiles.length - newFiles.length} duplicate(s) skipped.`,
        );
      }

      return [...prev, ...newFiles];
    });
  }, []);

  const readYamlFiles = useCallback(async (yamlFiles: File[]): Promise<FileWithContent[]> => {
    const filesWithContent: FileWithContent[] = [];

    for (const file of yamlFiles) {
      try {
        const content = await readFileContent(file);
        const relativePath = (file as any).webkitRelativePath;
        const displayName = relativePath || file.name;
        const baseName = displayName.split('/').pop() || displayName;

        filesWithContent.push({
          file,
          name: displayName,
          ruleName: baseName.replace(/\.(yml|yaml)$/i, ''),
          content,
        });
      } catch (error) {
        console.error(`Failed to read file ${file.name}:`, error);
        toast.error(`Failed to read file: ${file.name}`);
      }
    }

    return filesWithContent;
  }, []);

  const processZipFiles = useCallback(
    async (zipFiles: File[], password?: string) => {
      if (zipFiles.length === 0) return;

      setIsArchiveProcessing(true);
      setArchiveProgress(null);
      const pending: File[] = [];

      for (const zipFile of zipFiles) {
        try {
          const extracted = await extractYamlFilesFromZip(zipFile, password, (progress) => {
            const total = progress.totalBytes || 1;
            const percent = Math.round((progress.loadedBytes / total) * 100);
            setArchiveProgress({
              percent: Math.min(100, Math.max(0, percent)),
              archiveName: progress.archiveName,
              loadedBytes: progress.loadedBytes,
              totalBytes: progress.totalBytes,
            });
          });
          if (extracted.length === 0) {
            toast.info(`No YAML files found in ${zipFile.name}.`);
            continue;
          }
          addFiles(
            extracted.map((item) => ({
              name: item.name,
              ruleName: item.ruleName,
              content: item.content,
            })),
          );
        } catch (error) {
          if (error instanceof ZipPasswordRequiredError) {
            pending.push(zipFile);
            setArchivePasswordError(error.message);
            continue;
          }
          const errorMessage =
            error instanceof Error ? error.message : `Failed to process ${zipFile.name}`;
          toast.error(errorMessage);
        }
      }

      if (pending.length > 0) {
        setPendingArchives((prev) => {
          const existing = new Set(
            prev.map((file) => `${file.name}-${file.size}-${file.lastModified}`),
          );
          const unique = pending.filter(
            (file) => !existing.has(`${file.name}-${file.size}-${file.lastModified}`),
          );
          return [...prev, ...unique];
        });
      }

      setIsArchiveProcessing(false);
      setArchiveProgress(null);
    },
    [addFiles],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      let ruleFiles: File[] = [];

      if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
        try {
          ruleFiles = await getAllRuleFilesFromDataTransfer(e.dataTransfer);
        } catch (error) {
          console.error('Error processing drag&drop items:', error);
        }
      }

      if (ruleFiles.length === 0 && e.dataTransfer.files.length > 0) {
        ruleFiles = await getAllRuleFiles(e.dataTransfer.files);
      }

      if (ruleFiles.length === 0) {
        toast.error('No valid YAML or ZIP files found. Please select .yml, .yaml or .zip files.');
        return;
      }

      const yamlFiles = ruleFiles.filter((file) => !isValidZipFile(file));
      const zipFiles = ruleFiles.filter((file) => isValidZipFile(file));

      const filesWithContent = await readYamlFiles(yamlFiles);
      addFiles(filesWithContent);
      await processZipFiles(zipFiles, archivePassword);
    },
    [addFiles, archivePassword, processZipFiles, readYamlFiles],
  );

  const handleFileSelect = useCallback(
    async (selectedFiles: File[]) => {
      if (selectedFiles.length === 0) return;

      const ruleFiles = await getAllRuleFiles(selectedFiles);

      if (ruleFiles.length === 0) {
        toast.error('No valid YAML or ZIP files found. Please select .yml, .yaml or .zip files.');
        return;
      }

      const yamlFiles = ruleFiles.filter((file) => !isValidZipFile(file));
      const zipFiles = ruleFiles.filter((file) => isValidZipFile(file));

      const filesWithContent = await readYamlFiles(yamlFiles);
      addFiles(filesWithContent);
      await processZipFiles(zipFiles, archivePassword);
    },
    [addFiles, archivePassword, processZipFiles, readYamlFiles],
  );

  const handleRemoveFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleClearFiles = useCallback(() => {
    setFiles([]);
    setPendingArchives([]);
    setArchivePasswordError(null);
    setArchivePassword('');
    setArchiveProgress(null);
  }, []);

  const handleApplyArchivePassword = useCallback(async () => {
    if (!archivePassword || pendingArchives.length === 0) return;
    setArchivePasswordError(null);
    const archivesToProcess = [...pendingArchives];
    setPendingArchives([]);
    await processZipFiles(archivesToProcess, archivePassword);
  }, [archivePassword, pendingArchives, processZipFiles]);

  const handleArchivePasswordChange = useCallback(
    (value: string) => {
      setArchivePassword(value);
      if (archivePasswordError) {
        setArchivePasswordError(null);
      }
    },
    [archivePasswordError],
  );

  const handleUpload = useCallback(async () => {
    if (!repositoryId || repositoryId === 'all' || files.length === 0) {
      toast.error('Please select a repository and files to upload.');
      return;
    }

    setIsLoading(true);
    setProgress(0);

    try {
      let successCount = 0;
      let errorCount = 0;
      const errors: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const fileWithContent = files[i];

        try {
          const title = parseYamlTitle(fileWithContent.content);
          const ruleName =
            title || fileWithContent.ruleName || fileWithContent.name.replace(/\.(yml|yaml)$/i, '');

          await createRule(repositoryId, {
            name: ruleName,
            body: fileWithContent.content,
          });

          successCount++;
        } catch (error) {
          console.error(`Failed to upload file ${fileWithContent.name}:`, error);
          errorCount++;
          const errorMessage =
            error instanceof Error ? error.message : `Failed to upload ${fileWithContent.name}`;
          errors.push(errorMessage);
        }

        setProgress(Math.round(((i + 1) / files.length) * 100));
      }

      await fetchRules({ repository_id: repositoryId });

      if (successCount > 0) {
        toast.success(`Successfully uploaded ${successCount} rule(s).`);
      }

      if (errorCount > 0) {
        toast.error(errors[0] || `Failed to upload ${errorCount} rule(s).`);
      }

      setFiles([]);
      setProgress(0);
      setPendingArchives([]);
      setArchivePasswordError(null);
      handleClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload rules';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      fetchRepositories();
    }
  }, [files, repositoryId, createRule, fetchRules, handleClose]);

  return {
    files: files.map((f) => ({ name: f.name, file: f.file })),
    isDragging,
    isLoading,
    isArchiveProcessing,
    progress,
    archivePassword,
    archivePasswordError,
    pendingArchivesCount: pendingArchives.length,
    archiveProgress,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
    handleUpload,
    handleRemoveFile,
    handleClearFiles,
    handleClose,
    handleApplyArchivePassword,
    handleArchivePasswordChange,
  };
};
