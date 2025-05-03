import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Loader2 } from 'lucide-react';

interface CategoryFilterProps {
  options: { value: string; label: string; disabled?: boolean }[];
  selected: string[];
  onChange: (values: string[]) => void;
  isLoading?: boolean;
}

const CategoryFilter = ({ options, selected, onChange, isLoading }: CategoryFilterProps) => {
  return (
    <div className="w-full flex flex-col gap-2">
      <Label>Category</Label>
      <div className="relative w-full h-fit">
        {isLoading && (
          <div className="w-fit h-fit absolute top-[50%] right-[15%] -translate-y-[25%] z-10">
            <Loader2 className="h-5 w-5 text-primary animate-spin opacity-50 mb-4" />
          </div>
        )}
        <MultiSelect
          options={options}
          selected={selected}
          onChange={onChange}
          placeholder="Select Categories"
          className="w-full px-4 py-2"
        />
      </div>
    </div>
  );
};

export default CategoryFilter;
