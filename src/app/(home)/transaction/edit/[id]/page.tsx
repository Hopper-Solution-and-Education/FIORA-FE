import FormPage from '@/components/common/forms/FormPage';
import EditTransactionForm from '@/features/home/module/transaction/components/EditTransactionForm';

const EditTransaction = () => {
  return <FormPage title="Edit Transaction" FormComponent={EditTransactionForm} />;
};

export default EditTransaction;
