import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';

export const WalletFilterButton = () => {
  return (
    <Button variant="outline" size="icon" aria-label="Filter">
      <Filter className="h-4 w-4" />
    </Button>
  );
};
