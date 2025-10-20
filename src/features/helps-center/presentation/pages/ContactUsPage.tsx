import { useGetProfileQuery } from '@/features/profile/store/api/profileApi';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ConfirmExitDialog from '../../../../components/common/organisms/ConfirmExitDialog';
import ContactUsForm from '../organisms/ContactUsForm';

const ContactUsPage = () => {
  const router = useRouter();
  const [openConfirmExitDialog, setOpenConfirmExitDialog] = useState(false);

  // Get user session
  const { status } = useSession() as {
    data: any;
    status: 'loading' | 'authenticated' | 'unauthenticated';
  };

  // Get user profile data
  const { data: user, isLoading } = useGetProfileQuery(undefined, {
    skip: status !== 'authenticated',
  });

  return (
    <div className="px-6 space-y-6">
      {isLoading ? (
        <></>
      ) : (
        <ContactUsForm setOpenConfirmExitDialog={setOpenConfirmExitDialog} user={user} />
      )}

      <ConfirmExitDialog
        open={openConfirmExitDialog}
        onOpenChange={setOpenConfirmExitDialog}
        onConfirmExit={() => router.back()}
        onCancelExit={() => setOpenConfirmExitDialog(false)}
      />
    </div>
  );
};

export default ContactUsPage;
