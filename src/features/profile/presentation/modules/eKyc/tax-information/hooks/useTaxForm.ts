'use client';

import { IdentificationDocumentType } from '@/features/profile/domain/entities/models/profile';
import {
  useGetTaxInformationQuery,
  useSubmitIdentificationDocumentMutation,
  useUploadAttachmentMutation,
} from '@/features/profile/store/api/profileApi';
import { uploadToFirebase } from '@/shared/lib/firebase/firebaseUtils';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface UseTaxFormProps {
  isVerified: boolean;
}

export const useTaxForm = ({ isVerified }: UseTaxFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [taxId, setTaxId] = useState('');

  // RTK Query hooks
  const { data: existingData, isLoading: isLoadingData } = useGetTaxInformationQuery();
  const [uploadAttachmentMutation] = useUploadAttachmentMutation();
  const [submitDocument, { isLoading: isSubmitting }] = useSubmitIdentificationDocumentMutation();

  // Handle tax ID change
  const handleTaxIdChange = (value: string) => {
    setTaxId(value);
  };

  // Populate form with existing data when loaded
  useEffect(() => {
    if (existingData && !isVerified) {
      // Pre-populate form with existing data if available
      if (existingData.taxId) {
        setTaxId(existingData.taxId);
      }
    }
  }, [existingData, isVerified]);

  // Upload file helper
  const uploadFileHelper = async (file: File): Promise<string | null> => {
    try {
      // Create unique filename
      const fileName = `tax-document-${Date.now()}-${file.name}`;

      // Upload to Firebase Storage using utility function
      const downloadURL = await uploadToFirebase({
        file: file,
        path: 'images/tax-documents',
        fileName: fileName,
      });

      return downloadURL;
    } catch (error) {
      console.error('Error uploading file to Firebase:', error);
      return null;
    }
  };

  // Submit tax information
  const submitTaxInformation = async (documentId?: string) => {
    setIsLoading(true);
    try {
      // Validate required fields
      if (!taxId) {
        toast.error('Please enter your tax identification number');
        return;
      }

      const payload = {
        type: IdentificationDocumentType.TAX,
        idNumber: taxId,
        filePhotoId: documentId || '',
      };

      await submitDocument(payload).unwrap(); // using same api with identification document

      toast.success('Tax information submitted successfully');
    } catch (error: any) {
      console.error('Error submitting tax information:', error);
      toast.error(error?.message || 'Failed to submit tax information');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    taxId,
    handleTaxIdChange,
    isLoading,
    isSubmitting,
    isLoadingData,
    submitTaxInformation,
    uploadFileHelper,
    uploadAttachmentMutation,
  };
};
