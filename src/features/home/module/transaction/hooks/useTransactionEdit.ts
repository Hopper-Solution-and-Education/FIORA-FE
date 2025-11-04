import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { NewTransactionDefaultValues } from '../utils/transactionSchema';

interface UseTransactionEditProps {
  transactionId: string;
  onSuccess?: () => void;
}

export const useTransactionEdit = ({ transactionId, onSuccess }: UseTransactionEditProps) => {
  const router = useRouter();
  const [transaction, setTransaction] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load transaction data
  useEffect(() => {
    const loadTransaction = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/transactions/${transactionId}`);

        if (!response.ok) {
          throw new Error('Failed to load transaction');
        }

        const transactionData = await response.json();
        setTransaction(transactionData.data);
      } catch (error: any) {
        setError(error.message || 'Failed to load transaction');
        toast.error(error.message || 'Failed to load transaction');
      } finally {
        setIsLoading(false);
      }
    };

    if (transactionId) {
      loadTransaction();
    }
  }, [transactionId]);

  // Transform transaction data to form format
  const getFormData = (): Partial<NewTransactionDefaultValues> | null => {
    if (!transaction) return null;
    let fromId = '';
    let toId = '';

    switch (transaction.type) {
      case 'Income':
        fromId = transaction.fromCategoryId || ''; // Income: from = category
        toId = transaction.toAccountId || ''; // Income: to = account
        break;
      case 'Expense':
        fromId = transaction.fromAccountId || ''; // Expense: from = account
        toId = transaction.toCategoryId || ''; // Expense: to = category
        break;
      case 'Transfer':
        fromId = transaction.fromAccountId || ''; // Transfer: from = account
        toId = transaction.toAccountId || ''; // Transfer: to = account
        break;
    }

    return {
      type: transaction.type,
      date: new Date(transaction.date),
      amount: transaction.amount,
      currency: transaction.currency,
      product: transaction.products?.[0]?.id || null,
      fromId,
      toId,
      partnerId: transaction.partnerId || null,
      remark: transaction.remark || '',
    };
  };

  // Handle form submission
  const handleSubmit = async (data: NewTransactionDefaultValues) => {
    try {
      const body = {
        ...data,
        id: transactionId,
        product: undefined,
        [`from${data.type === 'Income' ? 'Category' : 'Account'}Id`]: data.fromId,
        [`to${data.type === 'Expense' ? 'Category' : 'Account'}Id`]: data.toId,
        products: data.product ? [{ id: data.product }] : [],
        date: data.date.toISOString(),
      };

      const response = await fetch(`/api/transactions/transaction`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update transaction');
      }

      const res = await response.json();
      toast.success(res.message || 'Transaction updated successfully!');

      if (onSuccess) {
        onSuccess();
      } else {
        router.back();
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while updating transaction');
    }
  };

  // Check if transaction can be edited (within 30 days)
  const canEdit = (): boolean => {
    if (!transaction) return false;

    const transactionDate = new Date(transaction.date);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return transactionDate >= thirtyDaysAgo;
  };

  return {
    transaction,
    isLoading,
    error,
    getFormData,
    handleSubmit,
    canEdit,
  };
};
