import { SelectOption } from '@/components/common/filters/SelectFilter';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';

interface MultiSelectFilterProps {
  options: SelectOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  noResultsText?: string;
  disabled?: boolean;
  className?: string;
  labelPosition?: 'horizontal' | 'vertical';
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
}: MultiSelectFilterProps) => {
  return (
    <div
      className={`${labelPosition === 'horizontal' ? 'flex flex-row items-center gap-4' : 'flex flex-col gap-2'}`}
    >
      {label && (
        <Label className={labelPosition === 'horizontal' ? 'min-w-[100px]' : ''}>{label}</Label>
      )}
      <div className="w-48">
        <MultiSelect
          className={`px-4 py-[7px] ${className}`}
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
