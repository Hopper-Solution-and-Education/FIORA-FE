import { Button } from '@/components/ui/button';
import { ArrowUpFromLine } from 'lucide-react';

export const WalletDepositButton = () => {
  return (
    <Button variant="outline" size="icon" aria-label="Deposit">
      <ArrowUpFromLine className="h-4 w-4" />
    </Button>
  );
};
