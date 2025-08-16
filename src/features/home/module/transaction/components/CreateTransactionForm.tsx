'use client';

import { FormConfig } from '@/components/common/forms';
import { AppDispatch } from '@/store';
import { RootState } from '@/store/rootReducer';
import { zodResolver } from '@hookform/resolvers/zod';
import { TransactionType } from '@prisma/client';
import { subDays } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {
  createTransaction,
  fetchSupportingData,
  resetCreateTransactionStatus,
} from '../slices/createTransactionSlice';
import { CreateTransactionBody } from '../types';
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
import RecurringSelectField from './form/RecurringSelect';
import ToSelectField from './form/ToSelect';
import TypeSelectField from './form/TypeSelect';

const CreateTransactionForm = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Set up form with zodResolver
  const methods = useForm<NewTransactionDefaultValues>({
    resolver: zodResolver(validateNewTransactionSchema),
    defaultValues: defaultNewTransactionValues,
  });

  const { watch, reset } = methods;
  const transactionType = watch('type') || 'Expense';

  const { lastFetchedType, hasFetched, isLoading } = useSelector(
    (state: RootState) => state.createTransaction.supportingData,
  );

  const { isLoading: isCreating, isSuccess } = useSelector(
    (state: RootState) => state.createTransaction.createTransaction,
  );

  // Centralized fetch logic - triggers only once when transaction type changes
  useEffect(() => {
    const needsRefetch = !hasFetched || lastFetchedType !== transactionType;

    if (needsRefetch && !isLoading) {
      dispatch(fetchSupportingData(transactionType as TransactionType));
    }
  }, [dispatch, transactionType, hasFetched, lastFetchedType, isLoading]);

  // Handle success state
  useEffect(() => {
    if (isSuccess) {
      reset();
      router.replace('/transaction');
      dispatch(resetCreateTransactionStatus());
    }
  }, [isSuccess, reset, router, dispatch]);

  const onSubmit = (data: any) => {
    const body: CreateTransactionBody = {
      amount: data.amount,
      currency: data.currency,
      type: data.type,
      partnerId: data.partnerId,
      remark: data.remark,
      products: data.product ? [{ id: data.product }] : [],
      date: data.date.toISOString(),
      fromAccountId: data.type === 'Income' ? null : data.fromId,
      fromCategoryId: data.type === 'Income' ? data.fromId : null,
      toAccountId: data.type === 'Expense' ? null : data.toId,
      toCategoryId: data.type === 'Expense' ? data.toId : null,
    };

    dispatch(createTransaction(body));
  };

  const fields = [
    <DateSelectField
      key="date"
      name="date"
      required
      min={subDays(new Date(), 30)} // 30 days ago
      max={new Date(new Date().getFullYear() + 1, 11, 31)} // 1 year from now
    />,
    <TypeSelectField key="type" name="type" required />,
    <CurrencySelectField key="currency" name="currency" required />,
    <AmountInputField key="amount" name="amount" placeholder="Amount" required />,
    <FromSelectField key="fromId" name="fromId" required />,
    <ToSelectField key="toId" name="toId" required />,
    <PartnerSelectField key="partnerId" name="partnerId" />,
    <ProductsSelectField key="product" name="product" />,
    <RecurringSelectField key="remark" name="remark" />,
  ];

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <FormConfig
          fields={fields}
          methods={methods}
          onBack={() => window.history.back()}
          isLoading={isCreating}
        />
      </form>
    </FormProvider>
  );
};

export default CreateTransactionForm;
