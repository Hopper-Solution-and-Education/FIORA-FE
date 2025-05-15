'use client';

import GlobalForm from '@/components/common/forms/GlobalForm';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { CreateTransactionBody } from '../types';
import {
  defaultNewTransactionValues,
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
  const [formKey, setFormKey] = useState(0);
  const hasSubmittedRef = useRef(false);

  const onSubmit = async (data: any) => {
    const body: CreateTransactionBody = {
      ...data,
      product: undefined,
      [`from${data.type === 'Income' ? 'Category' : 'Account'}Id`]: data.fromId,
      [`to${data.type === 'Expense' ? 'Category' : 'Account'}Id`]: data.toId,
      products: [{ id: data.product }],
      date: data.date.toISOString(),
    };
    try {
      const response = await fetch('/api/transactions/transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...body, date: body.date }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create transaction');
      }

      const res = await response.json();

      hasSubmittedRef.current = true;

      setFormKey((prevKey) => prevKey + 1);

      router.replace('/transaction');
      toast.success(res.message || 'Transaction created successfully!');
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    }
  };

  const fields = [
    <DateSelectField key="date" name="date" required />,
    <TypeSelectField key="type" name="type" required />,
    <AmountInputField key="amount" name="amount" placeholder="Amount" required />,
    <CurrencySelectField key="currency" name="currency" required />,
    <FromSelectField key="fromId" name="fromId" required />,
    <ToSelectField key="toId" name="toId" required />,
    <PartnerSelectField key="partnerId" name="partnerId" />,
    <ProductsSelectField key="product" name="product" />,
    <RecurringSelectField key="remark" name="remark" />,
  ];

  return (
    <GlobalForm
      key={formKey}
      fields={fields}
      onSubmit={onSubmit}
      defaultValues={defaultNewTransactionValues}
      schema={validateNewTransactionSchema}
    />
  );
};

export default CreateTransactionForm;
