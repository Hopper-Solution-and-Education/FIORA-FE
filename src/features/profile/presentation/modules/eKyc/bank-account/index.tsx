'use client';

import { TooltipProvider } from '@/components/ui/tooltip';
import { UserProfile } from '@/features/profile/domain/entities/models/profile';
import { FC } from 'react';
import {
  BankAccountActions,
  BankAccountDetailsForm,
  BankAccountHeader,
  BankStatementUpload,
} from './components';
import { useBankAccountForm, useBankAccountUpload } from './hooks';

type Props = {
  profile: UserProfile;
  isVerified: boolean;
};

const BankAccountForm: FC<Props> = ({ isVerified }) => {
  const {
    formData,
    handleInputChange,
    isLoading,
    isSubmitting,
    submitBankAccountInfo,
    uploadFileHelper,
    uploadAttachmentMutation,
  } = useBankAccountForm({ isVerified });

  const { uploadedFile, handleFileUpload } = useBankAccountUpload();

  const handleSaveContinue = async () => {
    let documentId: string | undefined;

    // Upload file if exists
    if (uploadedFile) {
      const fileUrl = await uploadFileHelper(uploadedFile);
      if (fileUrl) {
        const attachmentResult = await uploadAttachmentMutation({
          url: fileUrl,
          path: 'images/bank-statements',
          type: 'image',
        });
        documentId = attachmentResult?.data?.id;
      }
    }

    await submitBankAccountInfo(documentId, 'COMPLETED');
  };

  return (
    <TooltipProvider>
      <div className="w-full max-w-5xl mx-auto">
        <BankAccountHeader />

        <div className="space-y-4 sm:space-y-6">
          <BankAccountDetailsForm
            formData={formData}
            onInputChange={handleInputChange}
            isLoading={isLoading || isSubmitting}
          />

          <BankStatementUpload
            uploadedFile={uploadedFile}
            onFileUpload={handleFileUpload}
            isLoading={isLoading || isSubmitting}
          />

          <BankAccountActions onSubmit={handleSaveContinue} isLoading={isLoading || isSubmitting} />
        </div>
      </div>
    </TooltipProvider>
  );
};

export default BankAccountForm;
