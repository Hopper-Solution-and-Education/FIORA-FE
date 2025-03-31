'use client';

import Loading from '@/components/common/atoms/Loading';
import FormPage from '@/components/common/organisms/FormPage';
import { useAppSelector, useAppDispatch } from '@/store';
import { findAccountById } from '@/features/home/module/account/slices/utils';
import { setAccountDeleteDialog, setSelectedAccount } from '@/features/home/module/account/slices';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/Icon';
import UpdateAccountForm from '@/features/home/module/account/components/UpdateAccountForm';

export default function UpdateAccount() {
  const dispatch = useAppDispatch();
  const params = useParams();
  const accountId = params?.id as string;
  const { accounts } = useAppSelector((state) => state.account);
  const account = findAccountById(accounts.data, accountId);

  if (accounts.isLoading) {
    return <Loading />;
  }

  if (!account) {
    return null;
  }

  const handleDelete = () => {
    dispatch(setSelectedAccount(account));
    dispatch(setAccountDeleteDialog(true));
  };

  const renderDeleteButton = (
    <Button
      variant="ghost"
      onClick={handleDelete}
      className="text-red-500 hover:text-red-700 hover:bg-red-100"
    >
      <Icons.trash className="h-4 w-4" />
    </Button>
  );

  return (
    <FormPage
      title={`Edit Account: ${account.name}`}
      FormComponent={UpdateAccountForm}
      initialData={account}
      headerActions={renderDeleteButton}
    />
  );
}
