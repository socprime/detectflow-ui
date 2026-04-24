import { DefaultDialog } from '@/components/Dialog/DefaultDialog';

interface MatchNodeDialogProps {
  isOpen: boolean;
  versions?: {
    [key: string]: string;
  };
  onClose: () => void;
}

const isValidVersion = (v: string) => !/^\d+\.\d+\.\d+$/.test(v);

export const MatchNodeDialog: React.FC<MatchNodeDialogProps> = ({ isOpen, onClose, versions }) => {
  return (
    <DefaultDialog
      classNameHeader="mb-0"
      isOpen={isOpen}
      onClose={onClose}
      title="Match Node Version per Pipeline"
      classNameTitle="text-m"
    >
      <div className="flex flex-col">
        {Object.entries(versions || {}).map(([key, value]) =>
          isValidVersion(value) ? null : (
            <div className="border-border flex items-center justify-between px-6 py-3 not-first:border-t">
              <span className="text-default text-xs font-normal">{key}</span>
              <span className="text-gray-chateau text-2xs">Match Node: v{value}</span>
            </div>
          ),
        )}
      </div>
    </DefaultDialog>
  );
};
