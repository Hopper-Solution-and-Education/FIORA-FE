import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/shared/utils';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SelectOption } from './SelectFilter';

interface MultiSelectFilterProps {
  options: SelectOption[];
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
  searchPlaceholder = 'Search options...',
  noResultsText = 'No results found.',
  disabled = false,
}: MultiSelectFilterProps) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(selectedValues);

  // Keep state synced with props
  useEffect(() => {
    setSelected(selectedValues);
  }, [selectedValues]);

  const handleSelect = (value: string) => {
    // Toggle selection
    const newValues = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value];

    setSelected(newValues);
    onChange(newValues);
  };

  const handleDeselect = (value: string) => {
    const newValues = selected.filter((item) => item !== value);
    setSelected(newValues);
    onChange(newValues);
  };

  const clearAll = () => {
    setSelected([]);
    onChange([]);
  };

  const selectAll = () => {
    const allValues = options.map((option) => option.value);
    setSelected(allValues);
    onChange(allValues);
  };

  const getSelectedLabels = () => {
    return options
      .filter((option) => selected.includes(option.value))
      .map((option) => option.label);
  };

  return (
    <div className="w-full flex flex-col gap-2">
      {label && <Label>{label}</Label>}
      <Popover open={open} onOpenChange={setOpen} modal={true}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between min-h-10"
            disabled={disabled}
          >
            <div className="flex gap-1 flex-wrap">
              {selected.length === 0 ? (
                <span className="text-muted-foreground">{placeholder}</span>
              ) : selected.length <= 2 ? (
                getSelectedLabels().map((label, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="mr-1 mb-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      const valueToRemove = options.find((opt) => opt.label === label)?.value;
                      if (valueToRemove) handleDeselect(valueToRemove);
                    }}
                  >
                    {label}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                ))
              ) : (
                <span>{`${selected.length} selected`}</span>
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full min-w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandEmpty>{noResultsText}</CommandEmpty>
            <div className="flex gap-2 p-2 border-b">
              <Button size="sm" variant="outline" onClick={selectAll} className="text-xs">
                Select All
              </Button>
              <Button size="sm" variant="outline" onClick={clearAll} className="text-xs">
                Clear All
              </Button>
            </div>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selected.includes(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleSelect(option.value)}
                  >
                    <Check
                      className={cn('mr-2 h-4 w-4', isSelected ? 'opacity-100' : 'opacity-0')}
                    />
                    {option.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MultiSelectFilter;
