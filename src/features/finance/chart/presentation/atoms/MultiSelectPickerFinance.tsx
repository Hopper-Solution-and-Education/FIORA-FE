import MultiSelectField from '@/components/common/forms/select/MultiSelectField';
import { Label } from '@/components/ui/label';
import { DropdownOption } from '@/features/home/module/transaction/types';

interface MultiSelectFilterProps {
  options: DropdownOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  noResultsText?: string;
  disabled?: boolean;
  className?: string;
  labelPosition?: 'horizontal' | 'vertical';
  onBlur?: () => void;
}

const MultiSelectPickerFinance = ({
  options,
  selectedValues = [],
  onChange,
  label = 'Select',
  placeholder = 'Select options',
  disabled = false,
  className,
  labelPosition = 'vertical',
  onBlur,
}: MultiSelectFilterProps) => {
  return (
    <div
      className={`${labelPosition === 'horizontal' ? 'flex flex-row items-center gap-4' : 'flex flex-col gap-2'}`}
    >
      {label && (
        <Label className={labelPosition === 'horizontal' ? 'min-w-[100px]' : ''}>{label}</Label>
      )}
      <div className="w-full">
        <MultiSelectField
          onBlur={onBlur}
          className={`${className}`}
          options={options}
          selected={selectedValues}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default MultiSelectPickerFinance;
