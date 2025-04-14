import FormPage from '@/components/common/forms/FormPage';
import CreateTransactionForm from '@/features/home/module/transaction/components/CreateTransactionForm';
import React from 'react';

const CreateTransaction = () => {
  return <FormPage title="Create New Transaction" FormComponent={CreateTransactionForm} />;
};

export default CreateTransaction;
