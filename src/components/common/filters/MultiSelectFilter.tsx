import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { DropdownOption } from '@/shared/types';

interface MultiSelectFilterProps {
  options: DropdownOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  noResultsText?: string;
  disabled?: boolean;
}

const DEFAULT_OPTION: DropdownOption = {
  label: 'No option available',
  value: '',
  disabled: true,
};

const MultiSelectFilter = ({
  options,
  selectedValues = [],
  onChange,
  label = 'Select',
  placeholder = 'Select options',
  disabled = false,
}: MultiSelectFilterProps) => {
  return (
    <div className="w-full max-w-full flex flex-col gap-2">
      {label && <Label>{label}</Label>}
      <MultiSelect
        className="w-full px-4 py-[7px] min-w-full"
        options={options.length > 0 ? options : [...options, DEFAULT_OPTION]}
        selected={selectedValues}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
};

export default MultiSelectFilter;
