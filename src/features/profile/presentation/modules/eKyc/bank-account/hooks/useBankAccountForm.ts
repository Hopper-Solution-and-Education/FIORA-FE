'use client';

import { BankAccountFormData, eKYC } from '@/features/profile/domain/entities/models/profile';
import {
  useGetBankAccountQuery,
  useSubmitBankAccountMutation,
  useUploadAttachmentMutation,
} from '@/features/profile/store/api/profileApi';
import { uploadToFirebase } from '@/shared/lib/firebase/firebaseUtils';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface UseBankAccountFormProps {
  eKYCData: eKYC;
}

export const useBankAccountForm = ({ eKYCData }: UseBankAccountFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<BankAccountFormData>({
    accountNumber: '',
    accountName: '',
    bankName: '',
    SWIFT: '',
  });

  // RTK Query hooks
  const { data: existingData, isLoading: isLoadingData } = useGetBankAccountQuery(undefined, {
    skip: !eKYCData,
  });

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
    if (existingData && eKYCData) {
      // Pre-populate form with existing data if available

      setFormData((prev) => ({
        ...prev,
        accountNumber: existingData.accountNumber || '',
        accountName: existingData.accountName || '',
        bankName: existingData.bankName || '',
        SWIFT: existingData.SWIFT || '',
      }));
    }
  }, [existingData, eKYCData]);

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
  const submitBankAccountInfo = async (documentId?: string) => {
    setIsLoading(true);
    try {
      // Validate required fields
      if (
        !formData.accountNumber ||
        !formData.bankName ||
        !formData.accountName ||
        !formData.SWIFT
      ) {
        toast.error('Please fill in all required fields');
        return;
      }

      const payload = {
        accountNumber: formData.accountNumber,
        accountName: formData.accountName,
        bankName: formData.bankName,
        SWIFT: formData.SWIFT,
        ...(documentId && { documentId }),
        status: eKYCData.status,
      };

      await submitBankAccount(payload).unwrap();

      toast.success('Bank account information submitted successfully');
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
