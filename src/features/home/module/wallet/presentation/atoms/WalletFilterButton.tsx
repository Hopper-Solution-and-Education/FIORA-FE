import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';

const WalletFilterButton = () => {
  return (
    <Button variant="outline" size="icon" aria-label="Filter">
      <Icons.funnelPlus className="h-4 w-4" />
    </Button>
  );
};

export default WalletFilterButton;
