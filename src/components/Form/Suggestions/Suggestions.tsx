import { Button } from '@/components/Button';
import { Input } from '@/components/Form/Input';
import { ScrollArea } from '@/components/ScrollArea';
import { cn } from '@/utils';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Check, XIcon } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

export interface SuggestionOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SuggestionsProps {
  options: SuggestionOption[];
  value?: string;
  id?: string;
  name?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  dropdownClassName?: string;
  minChars?: number;
  showAllOnFocus?: boolean;
  allowCustomValue?: boolean;
  onChange: (value: string) => void;
}

export const Suggestions: React.FC<SuggestionsProps> = ({
  options,
  value = '',
  placeholder = 'Start typing...',
  id,
  name,
  className,
  disabled = false,
  loading = false,
  dropdownClassName,
  minChars = 0,
  showAllOnFocus = true,
  allowCustomValue = false,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastSelectedValueRef = useRef('');
  const isSelectingRef = useRef(false);
  const isFocusedRef = useRef(false);
  const inputValueRef = useRef('');

  const setInputValueSync = (val: string) => {
    inputValueRef.current = val;
    setInputValue(val);
  };

  useEffect(() => {
    if (isFocusedRef.current) {
      return;
    }
    const selectedOption = options.find((opt) => opt.value === value);
    setInputValueSync(selectedOption ? selectedOption.label : value);
    lastSelectedValueRef.current = value ?? '';
  }, [value, options]);

  const labelCounts = useMemo(() => {
    return options.reduce<Record<string, number>>((acc, option) => {
      const key = option.label.toLowerCase();
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }, [options]);

  const filteredOptions = useMemo(() => {
    const query = inputValueRef.current;
    if (!query || query.length < minChars) {
      return showAllOnFocus ? options : [];
    }
    const lower = query.toLowerCase();
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(lower) ||
        ((labelCounts[option.label.toLowerCase()] || 0) > 1 &&
          option.value.toLowerCase().includes(lower)),
    );
  }, [options, inputValue, minChars, showAllOnFocus, labelCounts]);

  const handleInputChange = (newValue: string) => {
    setInputValueSync(newValue);
    setHighlightedIndex(-1);

    if (newValue.length >= minChars || (showAllOnFocus && newValue.length === 0)) {
      setOpen(true);
    } else {
      setOpen(false);
    }

    if (allowCustomValue) {
      onChange(newValue);
    }
  };

  const handleSelectOption = (option: SuggestionOption) => {
    isSelectingRef.current = true;
    setInputValueSync(option.label);
    onChange(option.value);
    lastSelectedValueRef.current = option.value;
    setOpen(false);
    inputRef.current?.blur();

    setTimeout(() => {
      isSelectingRef.current = false;
    }, 200);
  };

  const handleInputFocus = () => {
    isFocusedRef.current = true;
    setHighlightedIndex(-1);
    if (showAllOnFocus || inputValueRef.current.length >= minChars) {
      setOpen(true);
    }
  };

  const handleInputBlur = () => {
    isFocusedRef.current = false;
    setTimeout(() => {
      if (isSelectingRef.current) {
        return;
      }

      setOpen(false);

      const currentInputValue = inputValueRef.current;

      if (!allowCustomValue && currentInputValue) {
        const exactMatches = options.filter(
          (opt) => opt.label.toLowerCase() === currentInputValue.toLowerCase(),
        );

        if (exactMatches.length > 1) {
          const currentOption = options.find((opt) => opt.value === value);
          if (currentOption && exactMatches.some((opt) => opt.value === currentOption.value)) {
            setInputValueSync(currentOption.label);
          } else {
            setInputValueSync(exactMatches[0].label);
            onChange(exactMatches[0].value);
            lastSelectedValueRef.current = exactMatches[0].value;
          }
        } else if (exactMatches.length === 1) {
          setInputValueSync(exactMatches[0].label);
          onChange(exactMatches[0].value);
          lastSelectedValueRef.current = exactMatches[0].value;
        } else {
          const currentOption = options.find((opt) => opt.value === value);
          const lastSelectedOption = lastSelectedValueRef.current
            ? options.find((opt) => opt.value === lastSelectedValueRef.current)
            : undefined;

          if (currentOption) {
            setInputValueSync(currentOption.label);
          } else if (lastSelectedOption) {
            setInputValueSync(lastSelectedOption.label);
            onChange(lastSelectedOption.value);
          } else {
            setInputValueSync('');
          }
        }
      }
    }, 150);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || filteredOptions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          handleSelectOption(filteredOptions[highlightedIndex]);
        } else if (filteredOptions.length > 0) {
          handleSelectOption(filteredOptions[0]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const isSelected = (option: SuggestionOption) => {
    return option.value === value;
  };

  return (
    <PopoverPrimitive.Root open={open}>
      <PopoverPrimitive.Anchor asChild>
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            id={id}
            name={name}
            value={inputValue}
            loading={loading}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={placeholder}
            className={cn('pr-7 text-xs', className)}
          />
          {inputValue && (
            <Button
              variant="ghost"
              size="xxs"
              aria-label="Clear"
              className="absolute top-1/2 right-2 -translate-y-1/2 px-1 text-xs hover:bg-transparent"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                setInputValueSync('');
                onChange('');
                lastSelectedValueRef.current = '';
                inputRef.current?.focus();
              }}
            >
              <XIcon className="size-4" />
            </Button>
          )}
        </div>
      </PopoverPrimitive.Anchor>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          onOpenAutoFocus={(e) => e.preventDefault()}
          className={cn(
            'bg-secondary border-border text-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 z-50 rounded-md border shadow-md outline-none',
            dropdownClassName || 'w-[var(--radix-popover-anchor-width)]',
          )}
          sideOffset={4}
        >
          <ScrollArea className="max-h-[300px]">
            <div className="p-1">
              {filteredOptions.map((option, index) => {
                const selected = isSelected(option);
                const isDuplicateLabel = (labelCounts[option.label.toLowerCase()] || 0) > 1;

                return (
                  <div
                    key={`${option.value}-${index}`}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      if (!option.disabled) {
                        handleSelectOption(option);
                      }
                    }}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={cn(
                      'focus:text-default [&_svg:not([class*="text-"])]:text-subdued focus:bg-hover relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-left text-xs outline-hidden transition-colors select-none',
                      'hover:bg-hover',
                      highlightedIndex === index && 'bg-hover',
                      selected && 'bg-hover',
                      option.disabled && 'pointer-events-none opacity-50',
                    )}
                  >
                    {option.label}
                    {isDuplicateLabel && (
                      <span className="text-subdued text-[10px]">{option.value}</span>
                    )}
                    {selected && (
                      <Check className="absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2" />
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
};
