'use client';

import { Input } from '@/components/ui/input';
import { DebouncedFunc } from 'lodash';
import { Search } from 'lucide-react';

type ChildProps = {
  callback: DebouncedFunc<(value: string) => void>;
};

function SavingSearch({ callback }: ChildProps) {
  return (
    <div className="relative w-[30vw]">
      <Input
        title="Search"
        placeholder="Search"
        className="w-full"
        onChange={(e) => callback(e.target.value)}
        onBlur={() => callback.flush()}
      />
      <Search size={15} className="absolute top-[50%] right-2 -translate-y-[50%] opacity-50" />
    </div>
  );
}

export default SavingSearch;
