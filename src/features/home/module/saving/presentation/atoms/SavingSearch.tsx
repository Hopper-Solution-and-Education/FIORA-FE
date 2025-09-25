'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

function SavingSearch() {
  return (
    <div className="relative w-[30vw]">
      <Input title="Search" placeholder="Search by From, To and/or Remark" className="w-full" />
      <Search size={15} className="absolute top-[50%] right-2 -translate-y-[50%] opacity-50" />
    </div>
  );
}

export default SavingSearch;
