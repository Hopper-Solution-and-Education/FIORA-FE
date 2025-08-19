import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { NewTransactionDefaultValues } from '../utils/transactionSchema';

interface UseTransactionCreateProps {
  onSuccess?: () => void;
}

export const useTransactionCreate = ({ onSuccess }: UseTransactionCreateProps = {}) => {
  const router = useRouter();

  // Handle form submission for creating transaction
  const handleSubmit = async (data: NewTransactionDefaultValues) => {
    try {
      const body = {
        ...data,
        product: undefined,
        [`from${data.type === 'Income' ? 'Category' : 'Account'}Id`]: data.fromId,
        [`to${data.type === 'Expense' ? 'Category' : 'Account'}Id`]: data.toId,
        products: data.product ? [{ id: data.product }] : [],
        date: data.date.toISOString(),
      };

      const response = await fetch('/api/transactions/transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create transaction');
      }

      const res = await response.json();

      toast.success(res.message || 'Transaction created successfully!');

      if (onSuccess) {
        onSuccess();
      } else {
        router.replace('/transaction');
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while creating transaction');
    }
  };

  return {
    handleSubmit,
  };
};
