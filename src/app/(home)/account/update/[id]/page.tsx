'use client';

import Loading from '@/components/common/atoms/Loading';
import FormPage from '@/components/common/forms/FormPage';
import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import UpdateAccountForm from '@/features/home/module/account/components/UpdateAccountForm';
import { useUpdateAccount } from '@/features/home/module/account/hooks/useUpdateAccount';
import { useParams } from 'next/navigation';

export default function UpdateAccount() {
  const params = useParams();
  const accountId = params?.id as string;

  const { account, isLoading, handleDelete } = useUpdateAccount(accountId);

  const renderDeleteButton = (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            type="button"
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 hover:bg-red-100"
          >
            <Icons.trash className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Delete</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  if (isLoading) {
    return <Loading />;
  }

  if (!account) {
    return null;
  }

  return (
    <FormPage
      title={`Edit Account: ${account.name}`}
      FormComponent={UpdateAccountForm}
      initialData={account}
      headerActions={renderDeleteButton}
    />
  );
}
