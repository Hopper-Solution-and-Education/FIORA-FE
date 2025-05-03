import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Loader2 } from 'lucide-react';

interface AccountFilterProps {
  options: { value: string; label: string; disabled?: boolean }[];
  selected: string[];
  onChange: (values: string[]) => void;
  isLoading?: boolean;
}

const AccountFilter = ({ options, selected, onChange, isLoading }: AccountFilterProps) => {
  return (
    <div className="w-full flex flex-col gap-2">
      <Label>Account</Label>
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
          placeholder="Select Accounts"
          className="w-full px-4 py-2"
        />
      </div>
    </div>
  );
};

export default AccountFilter;
