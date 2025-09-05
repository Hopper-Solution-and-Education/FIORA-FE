'use client';

import {
  useGetBankAccountQuery,
  useSubmitBankAccountMutation,
  useUploadAttachmentMutation,
} from '@/features/profile/store/api/profileApi';
import { uploadToFirebase } from '@/shared/lib/firebase/firebaseUtils';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface BankAccountFormData {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  accountType: string;
}

interface UseBankAccountFormProps {
  isVerified: boolean;
}

export const useBankAccountForm = ({ isVerified }: UseBankAccountFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<BankAccountFormData>({
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    routingNumber: '',
    accountType: '',
  });

  // RTK Query hooks
  const { data: existingData, isLoading: isLoadingData } = useGetBankAccountQuery();
  const [submitBankAccount, { isLoading: isSubmitting }] = useSubmitBankAccountMutation();
  const [uploadAttachmentMutation] = useUploadAttachmentMutation();

  // Handle form input changes
  const handleInputChange = (field: keyof BankAccountFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Populate form with existing data when loaded
  useEffect(() => {
    if (existingData && !isVerified) {
      // Pre-populate form with existing data if available
      if (existingData.accountHolderName) {
        setFormData((prev) => ({
          ...prev,
          accountHolderName: existingData.accountHolderName || '',
          bankName: existingData.bankName || '',
          accountNumber: existingData.accountNumber || '',
          routingNumber: existingData.routingNumber || '',
          accountType: existingData.accountType || '',
        }));
      }
    }
  }, [existingData, isVerified]);

  // Upload file helper
  const uploadFileHelper = async (file: File): Promise<string | null> => {
    try {
      // Create unique filename
      const fileName = `bank-statement-${Date.now()}-${file.name}`;

      // Upload to Firebase Storage using utility function
      const downloadURL = await uploadToFirebase({
        file: file,
        path: 'images/bank-statements',
        fileName: fileName,
      });

      return downloadURL;
    } catch (error) {
      console.error('Error uploading file to Firebase:', error);
      return null;
    }
  };

  // Submit bank account information
  const submitBankAccountInfo = async (
    documentId?: string,
    status: 'DRAFT' | 'COMPLETED' = 'COMPLETED',
  ) => {
    setIsLoading(true);
    try {
      // Validate required fields
      if (
        !formData.accountHolderName ||
        !formData.bankName ||
        !formData.accountNumber ||
        !formData.routingNumber ||
        !formData.accountType
      ) {
        toast.error('Please fill in all required fields');
        return;
      }

      const payload = {
        accountHolderName: formData.accountHolderName,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        routingNumber: formData.routingNumber,
        accountType: formData.accountType,
        ...(documentId && { documentId }),
        status,
      };

      await submitBankAccount(payload).unwrap();

      toast.success(
        status === 'DRAFT'
          ? 'Bank account information saved as draft'
          : 'Bank account information submitted successfully',
      );
    } catch (error: any) {
      console.error('Error submitting bank account information:', error);
      toast.error(error?.message || 'Failed to submit bank account information');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    handleInputChange,
    isLoading,
    isSubmitting,
    isLoadingData,
    submitBankAccountInfo,
    uploadFileHelper,
    uploadAttachmentMutation,
  };
};
