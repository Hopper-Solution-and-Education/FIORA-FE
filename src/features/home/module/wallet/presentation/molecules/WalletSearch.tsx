import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export const WalletSearch = () => {
  return (
    <div className="relative w-96">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input placeholder="Search" className="pl-9" />
    </div>
  );
};
