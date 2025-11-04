'use client';

import { FormConfig } from '@/components/common/forms';
import { AppDispatch } from '@/store';
import { yupResolver } from '@hookform/resolvers/yup';
import { subDays } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { fetchSupportingData } from '../slices/createTransactionSlice';
import {
  defaultNewTransactionValues,
  NewTransactionDefaultValues,
  validateNewTransactionSchema,
} from '../utils/transactionSchema';
import AmountInputField from './form/AmountInput';
import CurrencySelectField from './form/CurrencySelect';
import DateSelectField from './form/DateSelect';
import FromSelectField from './form/FromSelect';
import PartnerSelectField from './form/PartnerSelect';
import ProductsSelectField from './form/ProductsSelect';
import RemarkField from './form/RemarkField';
import ToSelectField from './form/ToSelect';
import TypeSelectField from './form/TypeSelect';

export enum TransactionFormMode {
  Create = 'create',
  Edit = 'edit',
}

interface TransactionFormProps {
  mode: TransactionFormMode;
  initialData?: Partial<NewTransactionDefaultValues>;
  onSuccess?: () => void;
  onSubmit?: (data: NewTransactionDefaultValues) => Promise<void>;
  isExternalLoading?: boolean;
}

const TransactionForm = ({
  mode,
  initialData,
  onSubmit,
  isExternalLoading = false,
}: TransactionFormProps) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [hasChanges, setHasChanges] = useState(false);

  // Use external loading state if provided, otherwise use internal state
  const isFormLoading = isExternalLoading;

  const methods = useForm<NewTransactionDefaultValues>({
    resolver: yupResolver(validateNewTransactionSchema),
    defaultValues:
      mode === TransactionFormMode.Edit && initialData ? initialData : defaultNewTransactionValues,
    mode: 'onChange',
  });

  const { watch, reset } = methods;
  useEffect(() => {
    if (mode === TransactionFormMode.Edit && initialData) {
      reset(initialData); // Reset form với data mới

      // Fetch supporting data cho type hiện tại
      if (initialData.type) {
        dispatch(fetchSupportingData(initialData.type));
      }
    }
  }, [initialData, mode, reset, dispatch]);
  // Track form changes
  useEffect(() => {
    if (mode === TransactionFormMode.Edit && initialData) {
      const subscription = watch((value, { name }) => {
        if (name) {
          const hasFormChanges = Object.keys(initialData).some(
            (key) =>
              initialData[key as keyof NewTransactionDefaultValues] !==
              value[key as keyof NewTransactionDefaultValues],
          );
          setHasChanges(hasFormChanges);
        }
      });
      return () => subscription.unsubscribe();
    }
  }, [watch, initialData, mode]);

  const handleSubmit = async (data: NewTransactionDefaultValues) => {
    if (mode === TransactionFormMode.Edit && !hasChanges) {
      toast.info('No changes detected');
      return;
    }

    // If external onSubmit is provided, use it (for both create and edit modes)
    if (onSubmit) {
      await onSubmit(data);
      methods.reset();
      return;
    }

    // Fallback error (should not happen if components are used correctly)
    toast.error('No submit handler provided');
  };

  const handleBack = () => {
    if (mode === TransactionFormMode.Edit && hasChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        router.back();
        methods.reset();
      }
    } else {
      router.back();
      methods.reset();
    }
  };

  const fields = [
    <DateSelectField
      key="date"
      name="date"
      required
      min={subDays(new Date(), 30)}
      max={new Date(new Date().getFullYear() + 1, 11, 31)}
      yearRange={{
        min: new Date().getFullYear() - 1,
        max: new Date().getFullYear() + 3,
      }}
    />,
    <TypeSelectField key="type" name="type" required disabled={mode === 'edit'} />,
    <CurrencySelectField key="currency" name="currency" required />,
    <AmountInputField key="amount" name="amount" placeholder="Amount" required />,
    <FromSelectField key="fromId" name="fromId" required />,
    <ToSelectField key="toId" name="toId" required />,
    <PartnerSelectField key="partnerId" name="partnerId" />,
    <ProductsSelectField key="product" name="product" />,
    <RemarkField key="remark" name="remark" label="Description" />,
  ];

  if (isFormLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {mode === TransactionFormMode.Edit
              ? 'Updating transaction...'
              : 'Creating transaction...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form
        data-test={`${mode}-transaction-form`}
        onSubmit={methods.handleSubmit(handleSubmit)}
        className="space-y-4"
      >
        <FormConfig fields={fields} methods={methods} onBack={handleBack} />
      </form>
    </FormProvider>
  );
};

export default TransactionForm;
