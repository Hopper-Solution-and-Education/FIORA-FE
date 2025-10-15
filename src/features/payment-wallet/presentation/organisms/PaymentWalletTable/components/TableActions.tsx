import { CommonTooltip } from '@/components/common/atoms/CommonTooltip';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PaymentWalletTransaction } from '../types';

interface TableActionsProps {
  transaction: PaymentWalletTransaction;
}

const TableActions = ({ transaction }: TableActionsProps) => {
  const router = useRouter();

  return (
    <CommonTooltip content="View Details">
      <Button
        variant="ghost"
        className="px-3 py-2 hover:bg-gray-200"
        onClick={() => router.push(`/transaction/details/${transaction.id}`)}
      >
        <FileText size={18} color="#595959" />
      </Button>
    </CommonTooltip>
  );
};

export default TableActions;
