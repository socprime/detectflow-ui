import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import type { ExtractedYamlFile } from '../utils';
import { countYamlFilesInZip, extractYamlFilesFromZip, ZipPasswordRequiredError } from '../utils';
import type { FileWithContent } from './useFileList';

export interface ArchiveProgressState {
  percent: number;
  archiveName: string;
  loadedBytes: number;
  totalBytes: number;
}

export const useArchiveProcessing = (
  addFiles: (files: FileWithContent[]) => void,
  getFilesCount: () => number,
  maxFiles?: number,
) => {
  const [isArchiveProcessing, setIsArchiveProcessing] = useState(false);
  const [archiveProgress, setArchiveProgress] = useState<ArchiveProgressState | null>(null);
  const [archivePassword, setArchivePassword] = useState('');
  const [archivePasswordError, setArchivePasswordError] = useState<string | null>(null);
  const [pendingArchives, setPendingArchives] = useState<File[]>([]);

  const processZipFiles = useCallback(
    async (zipFiles: File[], password?: string) => {
      if (zipFiles.length === 0) {
        return;
      }

      setIsArchiveProcessing(true);
      setArchiveProgress(null);

      const totalBytesMap = new Map<string, number>();
      const loadedBytesMap = new Map<string, number>();

      const updateProgress = (archiveName: string, loadedBytes: number, totalBytes: number) => {
        totalBytesMap.set(archiveName, totalBytes);
        loadedBytesMap.set(archiveName, loadedBytes);
        const sumTotal = Array.from(totalBytesMap.values()).reduce((a, b) => a + b, 0);
        const sumLoaded = Array.from(loadedBytesMap.values()).reduce((a, b) => a + b, 0);
        const percent = sumTotal > 0 ? Math.round((sumLoaded / sumTotal) * 100) : 0;
        setArchiveProgress({
          percent: Math.min(100, Math.max(0, percent)),
          archiveName,
          loadedBytes: sumLoaded,
          totalBytes: sumTotal,
        });
      };

      const processOne = async (
        zipFile: File,
      ): Promise<{ zipFile: File; extracted: ExtractedYamlFile[]; error: Error | null }> => {
        try {
          const extracted = await extractYamlFilesFromZip(zipFile, password, (progress) => {
            updateProgress(zipFile.name, progress.loadedBytes, progress.totalBytes);
          });
          return { zipFile, extracted, error: null };
        } catch (error) {
          return { zipFile, extracted: [], error: error as Error };
        }
      };

      const pending: File[] = [];
      let accumulatedFromArchives = 0;

      for (const zipFile of zipFiles) {
        if (maxFiles !== undefined) {
          let yamlCount: number;
          try {
            yamlCount = await countYamlFilesInZip(zipFile, password);
          } catch (error) {
            if (error instanceof ZipPasswordRequiredError) {
              pending.push(zipFile);
              setArchivePasswordError(error.message);
              continue;
            }
            toast.error(
              error instanceof Error ? error.message : `Failed to read ${zipFile.name}`,
            );
            continue;
          }

          const currentTotal = getFilesCount() + accumulatedFromArchives;
          if (currentTotal + yamlCount > maxFiles) {
            toast.error(
              `Cannot add archive "${zipFile.name}": it contains ${yamlCount.toLocaleString()} YAML file(s), but only ${(maxFiles - currentTotal).toLocaleString()} slot(s) remain (limit: ${maxFiles.toLocaleString()}).`,
            );
            continue;
          }
        }

        const { extracted, error } = await processOne(zipFile);
        if (error) {
          if (error instanceof ZipPasswordRequiredError) {
            pending.push(zipFile);
            setArchivePasswordError(error.message);
          } else {
            toast.error(
              error instanceof Error ? error.message : `Failed to process ${zipFile.name}`,
            );
          }
        } else if (extracted.length === 0) {
          toast.info(`No YAML files found in ${zipFile.name}.`);
        } else {
          accumulatedFromArchives += extracted.length;
          addFiles(
            extracted.map((item) => ({
              name: item.name,
              ruleName: item.ruleName,
              content: item.content,
            })),
          );
        }
      }

      if (pending.length > 0) {
        setPendingArchives((prev) => {
          const existing = new Set(prev.map((f) => `${f.name}-${f.size}-${f.lastModified}`));
          return [
            ...prev,
            ...pending.filter((f) => !existing.has(`${f.name}-${f.size}-${f.lastModified}`)),
          ];
        });
      }

      setIsArchiveProcessing(false);
      setArchiveProgress(null);
    },
    [addFiles],
  );

  const handleApplyArchivePassword = useCallback(async () => {
    if (!archivePassword || pendingArchives.length === 0) {
      return;
    }
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

  const resetArchive = useCallback(() => {
    setArchivePassword('');
    setArchivePasswordError(null);
    setPendingArchives([]);
    setArchiveProgress(null);
  }, []);

  return {
    isArchiveProcessing,
    archiveProgress,
    archivePassword,
    archivePasswordError,
    pendingArchivesCount: pendingArchives.length,
    processZipFiles,
    handleApplyArchivePassword,
    handleArchivePasswordChange,
    resetArchive,
  };
};
