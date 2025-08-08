import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ConfirmExitDialog from '../../../../components/common/organisms/ConfirmExitDialog';
import ContactUsForm from '../organisms/ContactUsForm';

const ContactUsPage = () => {
  const router = useRouter();
  const [openConfirmExitDialog, setOpenConfirmExitDialog] = useState(false);

  return (
    <div className="container mx-auto px-6 space-y-6">
      <ContactUsForm setOpenConfirmExitDialog={setOpenConfirmExitDialog} />

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
