import FormPage from '@/components/common/forms/FormPage';
import CreateTransactionForm from '@/features/home/module/transaction/components/CreateTransactionForm';
import React from 'react';

const DetailsTransaction = () => {
  return <FormPage title="Transaction Details" FormComponent={CreateTransactionForm} />;
};

export default DetailsTransaction;
