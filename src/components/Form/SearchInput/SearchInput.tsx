import { cn } from '@/utils';
import { SearchIcon, XIcon } from 'lucide-react';
import { Input, InputProps } from '../Input/Input';

interface SearchInputProps extends InputProps {
  classNamesInput?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  className,
  classNamesInput,
  value,
  placeholder,
  onChange,
  ...props
}) => {
  return (
    <div className={cn('relative', className)}>
      <div className="pointer-events-none absolute top-1/2 left-2 flex size-4 -translate-y-[60%] items-center">
        <SearchIcon className="text-subdued h-4 w-4" />
      </div>
      <Input
        type="text"
        className={cn('px-7', classNamesInput)}
        placeholder={placeholder || 'Search...'}
        {...props}
        value={value}
        onChange={onChange}
      />
      {value && (
        <button
          className="absolute inset-y-0 right-2 flex cursor-pointer items-center"
          onClick={() =>
            onChange?.({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>)
          }
        >
          <XIcon className="text-subdued hover:text-foreground h-4 w-4" />
        </button>
      )}
    </div>
  );
};
