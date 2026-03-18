import { cn } from '@/utils';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './Select';

interface SelectDefaultProps {
  id?: string;
  name?: string;
  options: { label: string; value: string }[];
  placeholder: string;
  className?: string;
  value?: string;
  loading?: boolean;
  disabled?: boolean;
  onChange?: (value: string) => void;
}

export const SelectDefault = ({
  id,
  name,
  options,
  placeholder,
  className,
  value,
  loading,
  disabled,
  onChange,
}: SelectDefaultProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        id={id}
        name={name}
        className={cn('relative w-full', className)}
        disabled={disabled}
        loading={loading}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options
            .filter((option) => option.value !== '')
            .map((option) => (
              <SelectItem className="cursor-pointer" key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
