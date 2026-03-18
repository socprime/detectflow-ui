import { DropdownsSelect, DropdownsSelectOption } from '@/components/Dropdowns/DropdownsSelect';
import { cn } from '@/utils';
import { SearchIcon, XIcon } from 'lucide-react';
import { Input, InputProps } from '../Input/Input';

interface SearchInputFieldsProps extends InputProps {
  classNamesInput?: string;
  options: DropdownsSelectOption[];
  valueSelect: string;
  onChangeSelect: (value: string) => void;
}

export const SearchInputFields: React.FC<SearchInputFieldsProps> = ({
  className,
  classNamesInput,
  value,
  placeholder,
  options,
  valueSelect,
  onChangeSelect,
  onChange,
  ...props
}) => {
  return (
    <div className={cn('relative', className)}>
      <div className="pointer-events-none absolute top-1/2 left-2 z-1 flex size-4 -translate-y-[60%] items-center">
        <SearchIcon className="text-subdued h-4 w-4" />
      </div>
      <div className="absolute top-1/2 left-8 z-1 flex h-10 w-26 -translate-y-1/2 items-center">
        <DropdownsSelect
          className="border-r-border w-inherit h-6 rounded-none border-0 border-r bg-transparent px-2 text-xs shadow-none hover:bg-transparent"
          options={options}
          value={valueSelect}
          onChange={onChangeSelect}
        />
      </div>
      <Input
        type="text"
        className={cn('pr-7 pl-40', classNamesInput)}
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
