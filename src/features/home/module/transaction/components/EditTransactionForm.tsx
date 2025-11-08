'use client';

import { AppDispatch } from '@/store';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { useTransactionEdit } from '../hooks/useTransactionEdit';
import { fetchSupportingData } from '../slices/createTransactionSlice';
import TransactionForm, { TransactionFormMode } from './TransactionForm';

interface EditTransactionFormProps {
  initialData?: any;
  onSuccess?: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const EditTransactionForm = ({ initialData, onSuccess }: EditTransactionFormProps) => {
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const transactionId = params?.id as string;

  const { transaction, isLoading, error, getFormData, handleSubmit, canEdit } = useTransactionEdit({
    transactionId,
    onSuccess,
  });
  useEffect(() => {
    if (transaction?.type) {
      dispatch(fetchSupportingData(transaction.type));
    }
  }, [transaction, dispatch]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        </div>
      </div>
    );
  }

  // If error occurred, show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-destructive text-lg mb-4">Failed to load transaction</div>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Get form data from transaction
  const formData = getFormData();

  // If no form data available, show error
  if (!formData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-destructive text-lg mb-4">Transaction data not available</div>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Check if transaction can be edited
  if (!canEdit()) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-destructive text-lg mb-4">Transaction Cannot Be Edited</div>
          <p className="text-muted-foreground mb-4">
            This transaction is older than 30 days and cannot be modified.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <TransactionForm
      mode={TransactionFormMode.Edit}
      initialData={formData}
      onSuccess={onSuccess}
      onSubmit={handleSubmit}
      isExternalLoading={isLoading}
    />
  );
};

export default EditTransactionForm;
