import { cn } from '@/utils';
import { ChevronDownIcon, Loader2 } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { Button } from '../Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './Dropdowns';

export interface DropdownsSelectOption {
  label: string;
  value: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export interface DropdownsSelectProps {
  options: DropdownsSelectOption[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  label?: string;
  triggerIcon?: React.ReactNode;
  triggerClassName?: string;
}

export const DropdownsSelect: React.FC<DropdownsSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  className,
  disabled = false,
  loading = false,
  label,
  triggerIcon,
  triggerClassName,
}) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setOpen(false);
  };

  const buttonText = useMemo(() => {
    if (!value) {
      return placeholder;
    }

    const selectedOption = options.find((opt) => opt.value === value);
    return selectedOption?.label || placeholder;
  }, [value, options, placeholder]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild disabled={disabled || loading}>
        {triggerIcon ? (
          <Button
            variant="secondaryOutline"
            size="l"
            className={triggerClassName}
            disabled={disabled || loading}
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : triggerIcon}
          </Button>
        ) : (
          <Button
            variant="secondary"
            size="l"
            className={cn('text-xs', className)}
            disabled={disabled || loading}
          >
            <span className={cn('flex-1 text-left', !value && 'text-gray-chateau')}>
              {buttonText}
            </span>
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ChevronDownIcon className="size-4 shrink-0 opacity-50" />
            )}
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="border-border bg-secondary min-w-[12rem]"
        align={triggerIcon ? 'end' : 'start'}
      >
        {label && (
          <>
            <DropdownMenuLabel>{label}</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuGroup className="flex flex-col gap-[1px]">
          {options.map((option) => (
            <DropdownMenuItem
              className={cn(
                'font-regular text-xs',
                value === option.value && 'bg-hover',
                option.disabled && 'is-disabled',
                option.className,
              )}
              key={option.value}
              onClick={() => handleSelect(option.value)}
              disabled={option.disabled}
            >
              {option.icon}
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
