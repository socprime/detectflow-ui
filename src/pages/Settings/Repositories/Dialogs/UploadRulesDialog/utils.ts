import { BlobReader, TextWriter, ZipReader } from '@zip.js/zip.js';

interface FileSystemEntry {
  isFile: boolean;
  isDirectory: boolean;
  name: string;
  fullPath: string;
}

interface FileSystemFileEntry extends FileSystemEntry {
  file: (successCallback: (file: File) => void, errorCallback?: (error: Error) => void) => void;
}

interface FileSystemDirectoryEntry extends FileSystemEntry {
  createReader: () => FileSystemDirectoryReader;
}

interface FileSystemDirectoryReader {
  readEntries: (
    callback: (entries: FileSystemEntry[]) => void,
    errorCallback?: (error: Error) => void,
  ) => void;
}

export interface ExtractedYamlFile {
  name: string;
  content: string;
  ruleName: string;
}

export interface ArchiveProgress {
  archiveName: string;
  loadedBytes: number;
  totalBytes: number;
}

export class ZipPasswordRequiredError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ZipPasswordRequiredError';
  }
}

const MAX_ARCHIVE_ENTRIES = 1000;
const MAX_ARCHIVE_SIZE_BYTES = 100 * 1024 * 1024;
const MAX_TOTAL_UNCOMPRESSED_BYTES = 150 * 1024 * 1024;
const MAX_ENTRY_UNCOMPRESSED_BYTES = 5 * 1024 * 1024;

const YAML_EXTENSIONS = new Set(['yml', 'yaml']);
const ZIP_EXTENSIONS = new Set(['zip']);

const getExtension = (name: string): string => {
  const parts = name.toLowerCase().split('.');
  return parts.length > 1 ? parts.pop() || '' : '';
};

export const isValidYamlFile = (file: File): boolean =>
  YAML_EXTENSIONS.has(getExtension(file.name));

export const isValidZipFile = (file: File): boolean => ZIP_EXTENSIONS.has(getExtension(file.name));

export const isValidYamlFileName = (name: string): boolean =>
  YAML_EXTENSIONS.has(getExtension(name));

const sanitizeArchivePath = (path: string): string | null => {
  const normalized = path.replace(/\\/g, '/');
  if (normalized.startsWith('/') || normalized.startsWith('\\')) return null;
  const parts = normalized.split('/').filter(Boolean);
  if (parts.some((part) => part === '..')) return null;
  return parts.join('/');
};

const isMacOsMetadataPath = (path: string): boolean => {
  const parts = path.split('/').filter(Boolean);
  if (parts.includes('__MACOSX')) return true;
  const fileName = parts[parts.length - 1] || '';
  return fileName.startsWith('._');
};

const isZipPasswordError = (error: unknown): boolean => {
  if (!error || typeof error !== 'object') return false;
  const message =
    'message' in error && typeof (error as { message?: string }).message === 'string'
      ? (error as { message: string }).message.toLowerCase()
      : '';
  return message.includes('password') || message.includes('encrypted');
};

export const parseYamlTitle = (content: string): string | null => {
  try {
    const patterns = [
      /^title:\s*["']([^"']+)["']\s*$/m,
      /^title:\s*'([^']+)'\s*$/m,
      /^title:\s*"([^"]+)"\s*$/m,
      /^title:\s*(.+?)\s*$/m,
    ];

    for (const pattern of patterns) {
      const match = content.match(pattern);
      if (match && match[1]) {
        const title = match[1].trim();
        if (title.length > 0) {
          return title;
        }
      }
    }
  } catch (error) {
    console.error('Error parsing YAML title:', error);
  }
  return null;
};

export const readFileContent = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

export const getAllRuleFiles = async (fileList: FileList | File[]): Promise<File[]> => {
  const files: File[] = [];

  for (const file of Array.from(fileList)) {
    if (file.size === 0 && file.type === '') {
      continue;
    }

    if (isValidYamlFile(file) || isValidZipFile(file)) {
      files.push(file);
    }
  }

  return files;
};

export const processDirectoryEntry = async (
  entry: FileSystemDirectoryEntry,
  pathPrefix = '',
): Promise<File[]> => {
  const files: File[] = [];
  const reader = entry.createReader();

  return new Promise((resolve, reject) => {
    const readEntries = () => {
      reader.readEntries(async (entries) => {
        if (entries.length === 0) {
          resolve(files);
          return;
        }

        for (const entry of entries) {
          if (entry.isDirectory) {
            const subFiles = await processDirectoryEntry(
              entry as FileSystemDirectoryEntry,
              entry.fullPath,
            );
            files.push(...subFiles);
          } else if (entry.isFile) {
            const fileEntry = entry as FileSystemFileEntry;
            const file = await new Promise<File>((fileResolve, fileReject) => {
              try {
                fileEntry.file((file) => {
                  if (isValidYamlFile(file) || isValidZipFile(file)) {
                    Object.defineProperty(file, 'webkitRelativePath', {
                      value: entry.fullPath,
                      writable: false,
                    });
                    fileResolve(file);
                  } else {
                    fileReject(new Error('Not a YAML file'));
                  }
                });
              } catch (error) {
                fileReject(error as Error);
              }
            }).catch(() => null);

            if (file) {
              files.push(file);
            }
          }
        }

        readEntries();
      }, reject);
    };

    readEntries();
  });
};

export const getAllRuleFilesFromDataTransfer = async (
  dataTransfer: DataTransfer,
): Promise<File[]> => {
  const files: File[] = [];
  const items = Array.from(dataTransfer.items);

  const entries: Array<{ entry: FileSystemEntry | null; file: File | null }> = [];

  for (const item of items) {
    if (item.kind !== 'file') continue;

    const entry = (item as any).webkitGetAsEntry?.() as FileSystemEntry | null;
    const file = item.getAsFile();
    entries.push({ entry, file });
  }

  for (const { entry, file } of entries) {
    if (entry?.isDirectory) {
      const dirFiles = await processDirectoryEntry(entry as FileSystemDirectoryEntry);
      files.push(...dirFiles);
    } else if (entry?.isFile) {
      const fileEntry = entry as FileSystemFileEntry;
      try {
        const f = await new Promise<File>((resolve, reject) => {
          fileEntry.file(resolve, reject);
        });

        if (isValidYamlFile(f) || isValidZipFile(f)) {
          files.push(f);
        }
      } catch (error) {
        console.error('Error reading file entry:', error);
      }
    } else if (file && (isValidYamlFile(file) || isValidZipFile(file))) {
      files.push(file);
    }
  }

  return files;
};

export const extractYamlFilesFromZip = async (
  archive: File,
  password?: string,
  onProgress?: (progress: ArchiveProgress) => void,
): Promise<ExtractedYamlFile[]> => {
  if (!isValidZipFile(archive)) {
    throw new Error('Unsupported archive format. Only .zip is allowed.');
  }
  if (archive.size > MAX_ARCHIVE_SIZE_BYTES) {
    throw new Error('Archive is too large.');
  }

  const reader = new ZipReader(new BlobReader(archive), password ? { password } : undefined);
  try {
    const entries = await reader.getEntries();
    if (entries.length > MAX_ARCHIVE_ENTRIES) {
      throw new Error('Archive contains too many entries.');
    }

    const yamlEntries = entries.filter(
      (entry) =>
        !entry.directory &&
        isValidYamlFileName(entry.filename) &&
        !isMacOsMetadataPath(entry.filename),
    );
    const totalBytes = yamlEntries.reduce((sum, entry) => sum + (entry.uncompressedSize || 0), 0);
    let totalUncompressed = 0;
    let processedBytes = 0;
    const extracted: ExtractedYamlFile[] = [];

    for (const entry of yamlEntries) {
      const safeName = sanitizeArchivePath(entry.filename);
      if (!safeName) {
        throw new Error('Archive contains unsafe paths.');
      }
      if (isMacOsMetadataPath(safeName)) {
        continue;
      }
      if (!Number.isFinite(entry.uncompressedSize)) {
        throw new Error('Archive entry size is invalid.');
      }
      if (entry.uncompressedSize > MAX_ENTRY_UNCOMPRESSED_BYTES) {
        throw new Error('Archive contains oversized files.');
      }
      totalUncompressed += entry.uncompressedSize;
      if (totalUncompressed > MAX_TOTAL_UNCOMPRESSED_BYTES) {
        throw new Error('Archive exceeds extraction size limits.');
      }
      if (!('getData' in entry)) {
        throw new Error('Archive contains unsupported entry type.');
      }
      const content = await entry.getData(new TextWriter(), {
        onprogress: async (loaded, total) => {
          const effectiveTotal = totalBytes || total || totalUncompressed;
          onProgress?.({
            archiveName: archive.name,
            loadedBytes: processedBytes + loaded,
            totalBytes: effectiveTotal,
          });
        },
      });
      processedBytes += entry.uncompressedSize;
      if (totalBytes > 0) {
        onProgress?.({
          archiveName: archive.name,
          loadedBytes: processedBytes,
          totalBytes,
        });
      }
      const baseName = safeName.split('/').pop() || safeName;
      extracted.push({
        name: `${archive.name}/${safeName}`,
        ruleName: baseName.replace(/\.(yml|yaml)$/i, ''),
        content,
      });
    }

    return extracted;
  } catch (error) {
    if (!password && isZipPasswordError(error)) {
      throw new ZipPasswordRequiredError('Archive password required.');
    }
    if (password && isZipPasswordError(error)) {
      throw new ZipPasswordRequiredError('Invalid archive password.');
    }
    throw error;
  } finally {
    await reader.close();
  }
};
