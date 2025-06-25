import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';

const WalletDepositButton = () => {
  return (
    <Button variant="outline" size="icon" aria-label="Deposit">
      <Icons.banknoteArrowUp className="h-4 w-4" />
    </Button>
  );
};

export default WalletDepositButton;
