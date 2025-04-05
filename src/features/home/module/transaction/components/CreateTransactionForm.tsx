'use client';

import GlobalForm from '@/components/common/organisms/GlobalForm';
import {
  defaultNewTransactionValues,
  validateNewTransactionSchema,
} from '../utils/transactionSchema';
import AmountInputField from './form/AmountInput';
import CurrencySelectField from './form/CurrencySelect';
import TypeSelectField from './form/TypeSelect';
import DateSelectField from './form/DateSelect';
import FromSelectField from './form/FromSelect';
import ToSelectField from './form/ToSelect';
import PartnerSelectField from './form/PartnerSelect';
import ProductsSelectField from './form/ProductsSelect';
import RecurringSelectField from './form/RecurringSelect';

const CreateTransactionForm = () => {
  const onSubmit = async (data: any) => {
    alert(JSON.stringify(data, null, 2));
  };

  const fields = [
    <DateSelectField key="date" name="date" />,
    <TypeSelectField key="type" name="type" />,
    <AmountInputField key="amount" name="amount" placeholder="Amount" />,
    <CurrencySelectField key="currency" name="currency" />,
    <FromSelectField key="from" name="from" />,
    <ToSelectField key="to" name="to" />,
    <PartnerSelectField key="partner" name="partner" />,
    <ProductsSelectField key="products" name="products" />,
    <RecurringSelectField key="recurring" name="recurring" />,
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
