import { Button } from '@/components/Button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/Dialog';
import { Editor, HelperText, Label } from '@/components/Form';
import { CheckIcon, CopyIcon, InfoIcon, SparklesIcon, XIcon } from 'lucide-react';
import { useAIGenerateDialog } from './useAIGenerateDialog';

interface AIGenerateDialogProps {
  isOpen: boolean;
  sourceTopics?: string[];
  repositoryIds?: string[];
  parsingScript?: string;
  onClose: () => void;
  onApplyMapping: (mapping: string) => void;
}

export const AIGenerateDialog: React.FC<AIGenerateDialogProps> = ({
  isOpen,
  onClose,
  onApplyMapping,
  sourceTopics = [],
  repositoryIds = [],
  parsingScript = '',
}) => {
  const {
    isCopied,
    isShowAfterCopy,
    aiResponse,
    loadingMapping,
    loadingMappingPrompt,
    repositoryNames,
    handleGenerateWithUncoderAI,
    handleCopyPrompt,
    handleApplyMapping,
    setAiResponse,
  } = useAIGenerateDialog({
    isOpen,
    repositoryIds,
    sourceTopics,
    parsingScript,
    onApplyMapping,
    onClose,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-border bg-secondary sm:max-w-[900px]" hideCloseButton>
        <DialogHeader>
          <DialogTitle className="text-default">
            <span className="flex flex-col gap-2">
              <span className="flex items-center gap-2">
                <SparklesIcon className="text-success size-5" />{' '}
                <span className="text-m font-semibold">AI Generate Mapping</span>
              </span>
              <span className="flex flex-col gap-1">
                <span className="text-gray-chateau text-2xs block font-normal">
                  Source topics: {sourceTopics?.join(' • ') ?? 'unknown'}
                </span>
                <span className="text-gray-chateau text-2xs block font-normal">
                  Repositories: {repositoryNames?.join(' • ') ?? 'unknown'}
                </span>
              </span>
            </span>
          </DialogTitle>
        </DialogHeader>
        <Button className="absolute top-6 right-4" variant="icon" size="xxs" onClick={onClose}>
          <XIcon className="size-4" />
        </Button>
        <div className="flex flex-col gap-6 px-6">
          <div className="text-subdued flex gap-4">
            <InfoIcon className="text-success block size-5 shrink-0" />
            <div className="text-subdued flex flex-col gap-4 text-xs font-normal">
              <div>
                <span className="font-semibold">Cloud Version:</span> Automatically send fields
                extracted from events in the source topics, together with unique fields from Sigma
                rules in the selected repositories, to the Uncoder Al API to generate the mapping
                (make sure your SOC Prime Platform API key has{' '}
                <span className="font-semibold">Uncoder AI</span> and{' '}
                <span className="font-semibold">AI features</span> permissions).
              </div>
              <div>
                <span className="font-semibold">On-Premise Version:</span> Copy the generated prompt
                and paste it into your Uncoder AI instance to generate the mapping locally.
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondaryOutline"
              className="text-xs"
              type="button"
              onClick={handleGenerateWithUncoderAI}
              disabled={loadingMapping || loadingMappingPrompt}
              loading={loadingMapping}
            >
              <SparklesIcon className="size-4" />
              Generate with Uncoder AI
            </Button>
            <Button
              variant="secondaryOutline"
              className="text-xs"
              type="button"
              onClick={handleCopyPrompt}
              disabled={loadingMapping || loadingMappingPrompt}
              loading={loadingMappingPrompt}
            >
              {isCopied ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
              {isCopied ? 'Copied!' : 'Copy Prompt'}
            </Button>
          </div>
          {(aiResponse || isShowAfterCopy) && (
            <div className="flex flex-col gap-2">
              <Label className="text-silver text-xs">Uncoder AI Response (YAML Mapping)</Label>
              <Editor
                className="bg-primary h-[250px] min-h-[250px]"
                options={{
                  placeholder: 'Paste the generated YAML mapping here...',
                }}
                value={aiResponse}
                onChange={setAiResponse}
              />
              {isCopied && (
                <HelperText className="text-gray-chateau text-2xs">
                  Prompt copied to clipboard. Paste the generated YAML mapping above.
                </HelperText>
              )}
            </div>
          )}
        </div>
        <DialogFooter className="gap-2">
          <Button className="text-xs" type="button" onClick={onClose} variant="secondaryOutline">
            Cancel
          </Button>
          <Button
            className="text-xs"
            type="button"
            onClick={handleApplyMapping}
            variant="primary"
            disabled={loadingMapping || loadingMappingPrompt || !aiResponse.trim()}
          >
            <SparklesIcon className="size-4" />
            Apply Mapping
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
