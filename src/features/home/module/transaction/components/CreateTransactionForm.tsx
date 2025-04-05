'use client';

import GlobalForm from '@/components/common/organisms/GlobalForm';
import { useRouter } from 'next/navigation';
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

  const onSubmit = async (data: any) => {
    const body: CreateTransactionBody = {
      ...data,
      products: data.products.map((product: string) => ({ id: product })),
    };
    try {
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
      router.refresh();
      // router.push('/home/transaction');
    } catch (error: any) {
      alert(error.message || 'An error occurred');
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
    <ProductsSelectField key="products" name="products" />,
    <RecurringSelectField key="remark" name="remark" />,
  ];

  return (
    <GlobalForm
      fields={fields}
      onSubmit={onSubmit}
      defaultValues={defaultNewTransactionValues}
      schema={validateNewTransactionSchema}
    />
  );
};

export default CreateTransactionForm;
