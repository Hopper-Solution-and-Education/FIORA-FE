import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PaymentWalletTransaction } from '../types';

interface TableActionsProps {
  transaction: PaymentWalletTransaction;
}

const TableActions = ({ transaction }: TableActionsProps) => {
  const router = useRouter();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className="px-3 py-2 hover:bg-gray-200"
            onClick={() => router.push(`/transaction/details/${transaction.id}`)}
          >
            <FileText size={18} color="#595959" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>View Details</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TableActions;
