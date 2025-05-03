import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { useMemo } from 'react';

interface TypeFilterProps {
  selected: string[];
  onChange: (values: string[]) => void;
}

const TypeFilter = ({ selected, onChange }: TypeFilterProps) => {
  const typeOptions = useMemo(
    () => [
      { value: 'Expense', label: 'Expense' },
      { value: 'Income', label: 'Income' },
      { value: 'Transfer', label: 'Transfer' },
    ],
    [],
  );

  return (
    <div className="w-full flex flex-col gap-2">
      <Label>Type</Label>
      <MultiSelect
        options={typeOptions}
        selected={selected}
        onChange={onChange}
        placeholder="Select Types"
        className="w-full px-4 py-2"
      />
    </div>
  );
};

export default TypeFilter;
