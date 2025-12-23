import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { DropdownOption } from '@/shared/types';

interface MultiSelectFilterProps {
  options: DropdownOption[];
  selectedValues?: string[] | null;
  onChange: (values: string[]) => void;
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  noResultsText?: string;
  disabled?: boolean;
  onScrollEnd?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const DEFAULT_OPTION: DropdownOption = {
  label: 'No option available',
  value: '',
  disabled: true,
};

const MultiSelectFilter = ({
  options,
  selectedValues,
  onChange,
  label = 'Select',
  placeholder = 'Select options',
  disabled = false,
  onScrollEnd,
  hasMore,
  isLoadingMore,
  onOpenChange,
}: MultiSelectFilterProps) => {
  return (
    <div className="w-full max-w-full flex flex-col gap-2">
      {label && <Label>{label}</Label>}
      {(() => {
        const resolvedOptions =
          options.length > 0 ? options : isLoadingMore ? [] : [...options, DEFAULT_OPTION];
        return (
          <MultiSelect
            className="w-full px-4 py-[7px] min-w-full"
            options={resolvedOptions}
            selected={selectedValues || []}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            onScrollEnd={onScrollEnd}
            hasMore={hasMore}
            isLoadingMore={isLoadingMore}
            onOpenChange={onOpenChange}
          />
        );
      })()}
    </div>
  );
};

export default MultiSelectFilter;
