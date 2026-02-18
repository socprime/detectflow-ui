import { ChevronDownIcon, Loader2 } from 'lucide-react';
import { useMemo, useState } from 'react';

import * as PopoverPrimitive from '@radix-ui/react-popover';

import { Badge } from '@/components/Badge';
import { badgeVariants } from '@/components/Badge/Badge';
import { Checkbox } from '@/components/Form/Checkbox';
import { SearchInput } from '@/components/Form/SearchInput';
import { ScrollArea } from '@/components/ScrollArea';
import { RepositoryType, RepositoryTypeDisplay } from '@/models/providers';
import { cn, getBadgeVariantForRepositoryType, getColorClassForRepositoryType } from '@/utils';
import { VariantProps } from 'class-variance-authority';

export interface MultiSelectOption {
  label: string;
  value: string;
  type?: RepositoryType;
  typeDisplay?: RepositoryTypeDisplay;
  disabled?: boolean;
}

export interface MultiSelectProps {
  loading?: boolean;
  options: MultiSelectOption[];
  value: string[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  maxDisplay?: number;
  maxSelection?: number;
  searchable?: boolean;
  size?: 'sm' | 'default';
  dropdownClassName?: string;
  align?: 'start' | 'center' | 'end';
  variant?: VariantProps<typeof badgeVariants>['variant'];
  badgeClassNames?: string;
  id?: string;
  name?: string;
  onChange: (value: string[]) => void;
}

export function MultiSelect({
  loading = false,
  options,
  value = [],
  placeholder = 'Select elements...',
  className,
  disabled = false,
  maxDisplay = 3,
  maxSelection,
  searchable = true,
  size = 'default',
  dropdownClassName,
  align = 'start',
  variant,
  badgeClassNames,
  id,
  name,
  onChange,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options;
    const query = searchQuery.toLowerCase();
    return options.filter((option) => option.label.toLowerCase().includes(query));
  }, [options, searchQuery]);

  const selectedOptions = useMemo(
    () => options.filter((option) => value.includes(option.value)),
    [options, value],
  );

  const displayedBadges = selectedOptions.slice(0, maxDisplay);
  const remainingCount = selectedOptions.length - maxDisplay;
  const isMaxReached = maxSelection !== undefined && value.length >= maxSelection;

  const handleToggle = (optionValue: string) => {
    const isSelected = value.includes(optionValue);

    if (isSelected) {
      onChange(value.filter((v) => v !== optionValue));
      return;
    }

    if (isMaxReached) return;

    onChange([...value, optionValue]);
  };

  const handleRemove = (optionValue: string) => {
    onChange(value.filter((v) => v !== optionValue));
  };

  const renderSelectedBadges = () => {
    if (selectedOptions.length === 0) {
      return <span className="text-gray-chateau">{placeholder}</span>;
    }

    return (
      <>
        {displayedBadges.map((option) => {
          const badgeVariant = getBadgeVariantForRepositoryType({ type: option?.type });
          const textColorClass = getColorClassForRepositoryType({ type: option?.type });

          return (
            <Badge
              key={option.value}
              className={cn(textColorClass, badgeClassNames)}
              variant={variant || badgeVariant}
              onRemove={() => handleRemove(option.value)}
            >
              {option.label}
            </Badge>
          );
        })}
        {remainingCount > 0 && <Badge variant="outline">+{remainingCount}</Badge>}
      </>
    );
  };

  const renderOptionItem = (option: MultiSelectOption) => {
    const isSelected = value.includes(option.value);
    const isDisabled = option.disabled || (!isSelected && isMaxReached);
    const badgeVariant = getBadgeVariantForRepositoryType({ type: option?.type });
    const textColorClass = getColorClassForRepositoryType({ type: option?.type });

    return (
      <label
        key={option.value}
        className={cn(
          'flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-xs transition-colors',
          'hover:bg-hover focus:bg-hover focus:text-default',
          isSelected && 'bg-hover',
          isDisabled && 'cursor-not-allowed opacity-50',
        )}
      >
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => handleToggle(option.value)}
          disabled={isDisabled}
        />
        <span className="flex flex-1 items-center gap-2">
          {option.label}
          {option.type && (
            <Badge variant={badgeVariant} className={cn('text-2xs', textColorClass)}>
              {option.typeDisplay}
            </Badge>
          )}
        </span>
      </label>
    );
  };

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          id={id}
          name={name}
          disabled={disabled}
          data-size={size}
          data-state={open ? 'open' : 'closed'}
          className={cn(
            'border-border bg-secondary data-[placeholder]:text-gray-chateau [&_svg:not([class*="text-"])]:text-gray-chateau flex min-h-9 w-full items-center justify-between gap-2 rounded-md border px-3 py-1 text-xs font-normal transition-[color,box-shadow] outline-none',
            'focus-visible:border-success focus-visible:ring-success/40 focus-visible:ring-[2px]',
            'data-[state=open]:border-success data-[state=open]:ring-success/40 data-[state=open]:ring-[2px]',
            'disabled:cursor-not-allowed disabled:opacity-50',
            '[&_svg]:pointer-events-none [&_svg]:shrink-0',
            className,
          )}
        >
          <div className="flex flex-1 flex-wrap items-center gap-1">{renderSelectedBadges()}</div>
          {loading ? (
            <Loader2 className="text-gray-chateau size-4 animate-spin" />
          ) : (
            <ChevronDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
          )}
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align={align}
          sideOffset={4}
          className={cn(
            'bg-secondary border-border text-foreground z-50 rounded-md border shadow-md outline-none',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
            'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            dropdownClassName,
          )}
        >
          <div className="flex flex-col gap-2 p-3">
            {searchable && (
              <SearchInput
                className="w-full text-xs"
                classNamesInput="h-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
              />
            )}

            <ScrollArea>
              <div className="flex max-h-64 flex-col gap-2">
                {filteredOptions.length === 0 ? (
                  <div className="text-gray-chateau py-6 text-center text-xs">Nothing found</div>
                ) : (
                  filteredOptions.map(renderOptionItem)
                )}
              </div>
            </ScrollArea>
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
