import { cn } from '@/utils';
import { ChevronDownIcon, Loader2 } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { Button } from '../Button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './Dropdowns';

export interface DropdownsCheckboxOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface DropdownsCheckboxProps {
  options: DropdownsCheckboxOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  label?: string;
  showSelectAll?: boolean;
  selectAllLabel?: string;
}

export const DropdownsCheckbox: React.FC<DropdownsCheckboxProps> = ({
  options,
  value = [],
  onChange,
  placeholder = 'Select...',
  className,
  disabled = false,
  loading = false,
  label,
  showSelectAll = true,
  selectAllLabel = 'Select All',
}) => {
  const [open, setOpen] = useState(false);

  const selectedCount = value.length;
  const allSelected = showSelectAll && value.length === 0;

  const handleToggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      const newValue = value.filter((v) => v !== optionValue);
      onChange(newValue);
    } else {
      onChange([...value, optionValue]);
    }
  };

  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked) {
      onChange([]);
    }
  };

  const buttonText = useMemo(() => {
    if (allSelected) {
      return selectAllLabel;
    }

    if (selectedCount === 0) {
      return placeholder;
    }

    if (selectedCount === 1) {
      const selectedOption = options.find((opt) => value.includes(opt.value));
      return selectedOption?.label || `${selectedCount} selected`;
    }
    return `${selectedCount} selected`;
  }, [selectedCount, options, value, placeholder, selectAllLabel, allSelected]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          className={cn('text-xs', className)}
          disabled={disabled || loading}
        >
          <span className={cn('flex-1 text-left', selectedCount === 0 && 'text-gray-chateau')}>
            {buttonText}
          </span>
          {loading ? (
            <Loader2 className="text-gray-chateau size-4 animate-spin" />
          ) : (
            <ChevronDownIcon className="size-4 shrink-0 opacity-50" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="border-border bg-secondary min-w-[12rem]" align="start">
        {label && (
          <>
            <DropdownMenuLabel>{label}</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuGroup>
          {showSelectAll && (
            <DropdownMenuCheckboxItem
              checked={allSelected}
              onCheckedChange={handleSelectAll}
              className="font-regular text-xs"
            >
              {selectAllLabel}
            </DropdownMenuCheckboxItem>
          )}
          {showSelectAll && <DropdownMenuSeparator />}
          {options.map((option) => (
            <DropdownMenuCheckboxItem
              className="font-regular text-xs"
              key={option.value}
              checked={value.includes(option.value)}
              onCheckedChange={() => handleToggle(option.value)}
              disabled={option.disabled}
            >
              {option.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
