import { cn } from '@/utils';
import { Button } from '@socprime/react-ui';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

interface FilteredOutProps {
  className?: string;
  showFilteredOut: boolean;
  loading: boolean;
  count: number;
  onClick: () => void;
}

export const FilteredOut = ({
  className,
  showFilteredOut,
  loading,
  count,
  onClick,
}: FilteredOutProps) => {
  return (
    <Button
      className={cn(
        'light:text-default dark:text-default h-10 w-full text-xs',
        className,
        showFilteredOut &&
          'btn border-success/30 bg-success/10 text-success hover:bg-success/20 light:text-success dark:text-success px-4',
      )}
      variant={showFilteredOut ? 'primaryOutline' : 'secondary'}
      onClick={onClick}
      loading={loading}
      disabled={loading || (!showFilteredOut && count === 0)}
    >
      {!showFilteredOut ? (
        <EyeIcon className="text-gray-chateau size-4" />
      ) : (
        <EyeOffIcon className="text-success size-4" />
      )}
      {showFilteredOut ? 'Hide Filtered Out' : 'Show Filtered Out'}
      {!showFilteredOut && <span className="text-xs font-normal">({count})</span>}
    </Button>
  );
};
