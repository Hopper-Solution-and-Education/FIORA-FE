'use client';

import DefaultSubmitButton from '@/components/common/molecules/DefaultSubmitButton';
import { uploadToFirebase } from '@/shared/lib';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { useUpdateTermsAndConditionsMutation } from '../../store/api/helpsCenterApi';
import { FileUploadZone } from '../molecules';
import WarningDialog from '../molecules/WarningDialog';

export default function EditTermsAndConditionsPage() {
  const router = useRouter();
  const [openWarningDialog, setOpenWarningDialog] = useState(false);

  const [isUploading, setIsUploading] = useState(false);

  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (file: File) => {
    setFile(file);
    setOpenWarningDialog(true);
  };

  const [updateTermsAndConditions, { isLoading: isUpdating }] =
    useUpdateTermsAndConditionsMutation();

  const isValidating = false;

  const onSubmit = async () => {
    try {
      if (file) {
        setIsUploading(true);
        const url = await uploadToFirebase({
          file,
          path: 'terms-and-conditions',
          fileName: 'terms-and-conditions',
        });
        updateTermsAndConditions({ url });
        setIsUploading(false);
        toast.success('Terms and Conditions updated successfully');
        router.push('/helps-center/terms-and-conditions');
      }
    } catch (error) {
      console.log('🚀 ~ onSubmit ~ error:', error);
    }
  };
  return (
    <div className="p-6">
      <div className="p-6 border border-gray-500 rounded-lg">
        <FileUploadZone
          onFileSelect={handleFileSelect}
          isLoading={isValidating}
          label="Accepts PDF files up to 5MB"
          accept={{
            'application/pdf': ['.pdf'],
          }}
        />
        <DefaultSubmitButton
          isSubmitting={isUpdating}
          // onSubmit={() => router.push('/helps-center/terms-and-conditions')}
          onBack={() => router.back()}
        />
      </div>

      <WarningDialog
        open={openWarningDialog}
        onClose={() => setOpenWarningDialog(false)}
        onConfirm={onSubmit}
        isLoading={isUpdating || isUploading}
        title="Replace Existing File"
        content="A Terms and Conditions file already exists. Do you want to replace it with the new one?"
      />
    </div>
  );
}
