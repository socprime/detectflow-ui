import { ApiError } from '@/models/providers';
import { useRepositoriesStore } from '@/store/repositories';
import { useRulesStore } from '@/store/rules';
import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  formatTimeLeft,
  getAllRuleFiles,
  getAllRuleFilesFromDataTransfer,
  isValidZipFile,
  parseYamlTitle,
  readFileContent,
} from '../utils';
import { useArchiveProcessing } from './useArchiveProcessing';
import { useFileList } from './useFileList';

const BULK_BATCH_SIZE = 250;
const MAX_UPLOAD_RULES = 5000;
const UPLOAD_MAX_RETRIES = 3;
const SEQUENTIAL_CONCURRENCY = 10;
const READER_BATCH_SIZE = 500;

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const useUploadRules = (repositoryId: string | undefined, onClose: () => void) => {
  const { createRule, createRulesBulk, fetchRules } = useRulesStore();
  const { fetchRepositories } = useRepositoriesStore();

  const { files, addFiles, handleRemoveFile, handleClearFiles } = useFileList(MAX_UPLOAD_RULES);
  const filesRef = useRef(files);
  filesRef.current = files;
  const getFilesCount = useCallback(() => filesRef.current.length, []);

  const {
    isArchiveProcessing,
    archiveProgress,
    archivePassword,
    archivePasswordError,
    pendingArchivesCount,
    processZipFiles,
    handleApplyArchivePassword,
    handleArchivePasswordChange,
    resetArchive,
  } = useArchiveProcessing(addFiles, getFilesCount, MAX_UPLOAD_RULES);

  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [estimatedTimeLeft, setEstimatedTimeLeft] = useState<string | null>(null);
  const abortRef = useRef(false);
  const isLoadingRef = useRef(false);
  const bulkNotSupportedRef = useRef(false);
  const archivePasswordRef = useRef('');
  archivePasswordRef.current = archivePassword;

  const handleClose = useCallback(() => {
    if (isLoadingRef.current) {
      abortRef.current = true;
      return;
    }
    handleClearFiles();
    resetArchive();
    setProgress(0);
    setEstimatedTimeLeft(null);
    setIsDragging(false);
    onClose();
  }, [onClose, handleClearFiles, resetArchive]);

  const handleAbort = useCallback(() => {
    abortRef.current = true;
  }, []);

  const handleClearAll = useCallback(() => {
    handleClearFiles();
    resetArchive();
  }, [handleClearFiles, resetArchive]);

  const readYamlFiles = useCallback(async (yamlFiles: File[]) => {
    const all: Array<{
      file: File;
      name: string;
      ruleName: string;
      content: string;
    } | null> = [];

    for (let i = 0; i < yamlFiles.length; i += READER_BATCH_SIZE) {
      const batch = yamlFiles.slice(i, i + READER_BATCH_SIZE);
      const batchResults = await Promise.all(
        batch.map(async (file) => {
          try {
            const content = await readFileContent(file);
            const relativePath = (file as any).webkitRelativePath;
            const displayName = relativePath || file.name;
            const baseName = displayName.split('/').pop() || displayName;
            return {
              file,
              name: displayName,
              ruleName: baseName.replace(/\.(yml|yaml)$/i, ''),
              content,
            };
          } catch (error) {
            console.error(`Failed to read file ${file.name}:`, error);
            toast.error(`Failed to read file: ${file.name}`);
            return null;
          }
        }),
      );
      all.push(...batchResults);
    }

    return all.filter(Boolean) as NonNullable<(typeof all)[0]>[];
  }, []);

  const ingestFiles = useCallback(
    async (ruleFiles: File[]) => {
      const yamlFiles = ruleFiles.filter((f) => !isValidZipFile(f));
      const zipFiles = ruleFiles.filter((f) => isValidZipFile(f));
      const filesWithContent = await readYamlFiles(yamlFiles);
      addFiles(filesWithContent);
      await processZipFiles(zipFiles, archivePasswordRef.current);
    },
    [addFiles, processZipFiles, readYamlFiles],
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
      if (e.dataTransfer.items?.length > 0) {
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
      await ingestFiles(ruleFiles);
    },
    [ingestFiles],
  );

  const handleFileSelect = useCallback(
    async (selectedFiles: File[]) => {
      if (selectedFiles.length === 0) {
        return;
      }
      const ruleFiles = await getAllRuleFiles(selectedFiles);
      if (ruleFiles.length === 0) {
        toast.error('No valid YAML or ZIP files found. Please select .yml, .yaml or .zip files.');
        return;
      }
      await ingestFiles(ruleFiles);
    },
    [ingestFiles],
  );

  const handleUpload = useCallback(async () => {
    if (!repositoryId || repositoryId === 'all' || files.length === 0) {
      toast.error('Please select a repository and files to upload.');
      return;
    }
    if (files.length > MAX_UPLOAD_RULES) {
      toast.error(
        `Too many files selected: ${files.length.toLocaleString()}. Maximum allowed is ${MAX_UPLOAD_RULES.toLocaleString()}.`,
      );
      return;
    }

    abortRef.current = false;
    isLoadingRef.current = true;
    setIsLoading(true);
    setProgress(0);
    setEstimatedTimeLeft(null);

    try {
      let successCount = 0;
      let errorCount = 0;
      const errors: string[] = [];
      let completedCount = 0;
      const startTime = Date.now();
      const filesToUpload = [...files];
      const totalFiles = filesToUpload.length;

      const getRuleName = (f: (typeof filesToUpload)[0]) =>
        parseYamlTitle(f.content) || f.ruleName || f.name.replace(/\.(yml|yaml)$/i, '');

      const updateProgress = () => {
        setProgress(Math.round((completedCount / totalFiles) * 100));
        const elapsed = Date.now() - startTime;
        if (completedCount > 0 && elapsed > 0) {
          setEstimatedTimeLeft(
            formatTimeLeft(((totalFiles - completedCount) / completedCount) * elapsed),
          );
        }
      };

      const batches: (typeof filesToUpload)[] = [];
      for (let i = 0; i < filesToUpload.length; i += BULK_BATCH_SIZE) {
        batches.push(filesToUpload.slice(i, i + BULK_BATCH_SIZE));
      }

      const uploadSequentially = async (batch: typeof filesToUpload) => {
        let cursor = 0;

        const next = async () => {
          while (cursor < batch.length) {
            if (abortRef.current) return;
            const f = batch[cursor++];
            try {
              await createRule(repositoryId, { name: getRuleName(f), body: f.content });
              successCount++;
            } catch {
              errorCount++;
              errors.push(`Failed to upload: ${f.name}`);
            }
            completedCount++;
            updateProgress();
          }
        };

        const workers = Math.min(SEQUENTIAL_CONCURRENCY, batch.length);
        await Promise.all(Array.from({ length: workers }, () => next()));
      };

      const uploadBatch = async (batch: typeof filesToUpload) => {
        if (bulkNotSupportedRef.current) {
          return uploadSequentially(batch);
        }

        for (let attempt = 0; attempt <= UPLOAD_MAX_RETRIES; attempt++) {
          if (abortRef.current) {
            return;
          }
          if (attempt > 0) {
            await delay(Math.pow(2, attempt - 1) * 500);
          }
          try {
            const result = await createRulesBulk(repositoryId, {
              rules: batch.map((f) => ({ name: getRuleName(f), body: f.content })),
            });
            successCount += result.created;
            errorCount += result.failed.length;
            errors.push(...result.failed.map((f) => f.error));
            completedCount += batch.length;
            updateProgress();
            return;
          } catch (error) {
            if (error instanceof ApiError && (error.status === 404 || error.status === 405)) {
              bulkNotSupportedRef.current = true;
              return uploadSequentially(batch);
            }
            if (!(error instanceof ApiError) || error.status < 500) {
              errorCount += batch.length;
              errors.push(error instanceof Error ? error.message : 'Batch upload failed');
              completedCount += batch.length;
              updateProgress();
              return;
            }
          }
        }

        errorCount += batch.length;
        errors.push('Batch upload failed after max retries');
        completedCount += batch.length;
        updateProgress();
      };

      for (const batch of batches) {
        if (abortRef.current) {
          break;
        }
        await uploadBatch(batch);
      }

      await fetchRules({ repository_id: repositoryId });

      setProgress(0);
      setEstimatedTimeLeft(null);

      if (abortRef.current) {
        toast.info(`Upload stopped. ${successCount} rule(s) uploaded before stopping.`);
        handleClearFiles();
        resetArchive();
        onClose();
      } else if (errorCount > 0) {
        if (successCount > 0) {
          toast.success(`Successfully uploaded ${successCount} rule(s).`);
        }
        toast.error(
          errorCount === 1
            ? errors[0] || 'Failed to upload 1 rule.'
            : `Failed to upload ${errorCount} rule(s).`,
        );
      } else {
        toast.success(`Successfully uploaded ${successCount} rule(s).`);
        handleClearFiles();
        resetArchive();
        onClose();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to upload rules');
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
      fetchRepositories();
    }
  }, [
    files,
    repositoryId,
    createRule,
    createRulesBulk,
    fetchRules,
    fetchRepositories,
    handleClearFiles,
    resetArchive,
    onClose,
  ]);

  return {
    files: files.map((f) => ({ name: f.name, content: f.content, file: f.file })),
    isDragging,
    isLoading,
    isArchiveProcessing,
    progress,
    estimatedTimeLeft,
    archivePassword,
    archivePasswordError,
    pendingArchivesCount,
    archiveProgress,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
    handleUpload,
    handleAbort,
    handleRemoveFile,
    handleClearFiles: handleClearAll,
    handleClose,
    handleApplyArchivePassword,
    handleArchivePasswordChange,
  };
};
