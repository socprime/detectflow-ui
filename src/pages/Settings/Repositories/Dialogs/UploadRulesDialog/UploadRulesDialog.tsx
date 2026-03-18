import { Button } from '@/components/Button';
import { Dialog, DialogFooter } from '@/components/Dialog';
import { DefaultDialog } from '@/components/Dialog/DefaultDialog';
import { HelperText, Label } from '@/components/Form';
import { InputPassword } from '@/components/Form/Input/InputPassword';
import { ScrollArea } from '@/components/ScrollArea';
import { cn } from '@/utils';
import { UploadIcon, XIcon } from 'lucide-react';
import { useCallback } from 'react';
import { useUploadRules } from './hooks';

interface UploadRulesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  repositoryId?: string;
}

const MAX_VISIBLE_FILES = 200;

export const UploadRulesDialog: React.FC<UploadRulesDialogProps> = ({
  isOpen,
  onClose,
  repositoryId,
}) => {
  const {
    files,
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
    handleClearFiles,
    handleClose,
    handleApplyArchivePassword,
    handleArchivePasswordChange,
  } = useUploadRules(repositoryId, onClose);

  const handleSelectFiles = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = '.yml,.yaml,.zip';
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files) {
        handleFileSelect(Array.from(target.files));
      }
    };
    input.click();
  }, [handleFileSelect]);

  const handleSelectFolder = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.webkitdirectory = true;
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files) {
        handleFileSelect(Array.from(target.files));
      }
    };
    input.click();
  }, [handleFileSelect]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DefaultDialog
        className="sm:max-w-[600px]"
        isOpen={isOpen}
        onClose={handleClose}
        title="Upload Rules"
      >
        <div className="space-y-4 px-6">
          <div
            className={cn(
              'border-border bg-secondary flex min-h-[150px] flex-col items-center justify-center gap-4 rounded-md border-2 border-dashed p-6 transition-colors',
              isDragging && 'border-success bg-hover',
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <UploadIcon className="text-gray-chateau size-10" />
            <div className="flex flex-col items-center gap-3 text-center">
              <p className="text-subdued text-sm font-medium">
                Drag and drop YAML files, folders, or ZIP archives here
              </p>
              <div className="flex items-center gap-2">
                <div className="bg-border h-px w-8" />
                <span className="text-gray-chateau text-xs">or</span>
                <div className="bg-border h-px w-8" />
              </div>
              <div className="flex gap-2">
                <Button
                  className="text-xs"
                  variant="secondaryOutline"
                  onClick={handleSelectFiles}
                  disabled={isLoading || isArchiveProcessing}
                  type="button"
                >
                  Browse Files
                </Button>
                <Button
                  className="text-xs"
                  variant="secondaryOutline"
                  onClick={handleSelectFolder}
                  disabled={isLoading || isArchiveProcessing}
                  type="button"
                >
                  Browse Folder
                </Button>
              </div>
              <p className="text-gray-chateau text-xs">Supported: .yml, .yaml, .zip</p>
            </div>
          </div>
          {pendingArchivesCount > 0 && (
            <div className="border-border bg-secondary flex flex-col gap-3 rounded-md border p-4">
              <div className="flex items-center justify-between">
                <Label className="text-silver text-xs">Archive password</Label>
                <span className="text-gray-chateau text-2xs">
                  Pending archives: {pendingArchivesCount}
                </span>
              </div>
              <InputPassword
                className="bg-primary h-9 text-xs"
                placeholder="Enter archive password"
                value={archivePassword}
                onChange={(e) => handleArchivePasswordChange(e.target.value)}
                disabled={isLoading || isArchiveProcessing}
                autoComplete="off"
              />
              {archivePasswordError && (
                <HelperText className="text-2xs text-critical">{archivePasswordError}</HelperText>
              )}
              <div className="flex items-center gap-2">
                <Button
                  className="text-xs"
                  variant="secondaryOutline"
                  onClick={handleApplyArchivePassword}
                  disabled={!archivePassword || isLoading || isArchiveProcessing}
                  type="button"
                >
                  Apply password
                </Button>
                <span className="text-gray-chateau text-2xs">Extract YAML from encrypted ZIPs</span>
              </div>
            </div>
          )}
          {isArchiveProcessing && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-subdued">
                  Extracting archives
                  {archiveProgress?.archiveName ? `: ${archiveProgress.archiveName}` : '...'}
                </span>
                <span className="text-gray-chateau">{archiveProgress?.percent ?? 0}%</span>
              </div>
              <div className="border-border bg-secondary h-2 w-full overflow-hidden rounded-full border">
                <div
                  className="bg-success h-full transition-all duration-300"
                  style={{ width: `${archiveProgress?.percent ?? 0}%` }}
                />
              </div>
            </div>
          )}
          {files.length > 0 && (
            <div className="border-border bg-secondary flex flex-col gap-2 rounded-md border p-4">
              <div className="flex items-center justify-between">
                <span className="text-subdued text-xs font-medium">
                  Selected files ({files.length})
                </span>
                <Button
                  className="text-2xs"
                  size="xxs"
                  variant="secondaryOutline"
                  onClick={handleClearFiles}
                  disabled={isLoading}
                >
                  Clear
                </Button>
              </div>
              <ScrollArea className="max-h-50 [&>[data-slot=scroll-area-viewport]]:max-h-50">
                <div className="flex flex-col gap-1">
                  {files.slice(0, MAX_VISIBLE_FILES).map((fileItem, index) => (
                    <div
                      key={`${fileItem.name}-${index}`}
                      className="text-gray-chateau bg-primary flex items-center justify-between gap-2 rounded-sm px-2 py-1 text-xs"
                    >
                      <span
                        className="line-clamp-1 break-all whitespace-normal"
                        title={fileItem.name}
                      >
                        {fileItem.name}
                      </span>
                      {!isLoading && (
                        <Button
                          variant="icon"
                          size="xxs"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFile(index);
                          }}
                        >
                          <XIcon className="size-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {files.length > MAX_VISIBLE_FILES && (
                    <div className="text-gray-chateau px-2 py-1 text-xs">
                      ...and {(files.length - MAX_VISIBLE_FILES).toLocaleString()} more files
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}
          {isLoading && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-subdued">Uploading rules...</span>
                <div className="flex items-center gap-2">
                  {estimatedTimeLeft && (
                    <span className="text-gray-chateau">{estimatedTimeLeft}</span>
                  )}
                  <span className="text-gray-chateau">{progress}%</span>
                </div>
              </div>
              <div className="border-border bg-secondary h-2 w-full overflow-hidden rounded-full border">
                <div
                  className="bg-success h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="gap-2">
          <Button
            className="text-xs"
            type="button"
            onClick={isLoading ? handleAbort : handleClose}
            variant="secondaryOutline"
          >
            {isLoading ? 'Stop' : 'Cancel'}
          </Button>
          <Button
            className="text-xs"
            onClick={handleUpload}
            variant="primary"
            loading={isLoading}
            disabled={
              files.length === 0 || !repositoryId || repositoryId === 'all' || isArchiveProcessing
            }
          >
            Upload
          </Button>
        </DialogFooter>
      </DefaultDialog>
    </Dialog>
  );
};
