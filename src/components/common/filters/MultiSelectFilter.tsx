import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
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
}

const MultiSelectFilter = ({
  options,
  selectedValues = [],
  onChange,
  label = 'Select',
  placeholder = 'Select options',
  disabled = false,
}: MultiSelectFilterProps) => {
  return (
    <div className="w-full flex flex-col gap-2">
      {label && <Label>{label}</Label>}
      <MultiSelect
        className="w-full px-4 py-[7px]"
        options={options}
        selected={selectedValues}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
};

export default MultiSelectFilter;
