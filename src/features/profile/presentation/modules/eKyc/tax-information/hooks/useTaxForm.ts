'use client';

import {
  eKYC,
  IdentificationDocumentType,
} from '@/features/profile/domain/entities/models/profile';
import {
  useGetIdentificationDocumentQuery,
  useSubmitIdentificationDocumentMutation,
  useUploadAttachmentMutation,
} from '@/features/profile/store/api/profileApi';
import { uploadToFirebase } from '@/shared/lib/firebase/firebaseUtils';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface UseTaxFormProps {
  eKYCData: eKYC;
  setImageUrlState: (key: string, url: string | null) => void;
}

export const useTaxForm = ({ eKYCData, setImageUrlState }: UseTaxFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [taxId, setTaxId] = useState('');

  // RTK Query hooks
  const { data: existingData, isLoading: isLoadingData } = useGetIdentificationDocumentQuery(
    undefined,
    {
      skip: !eKYCData,
    },
  );

  const [uploadAttachmentMutation] = useUploadAttachmentMutation();
  const [submitDocument, { isLoading: isSubmitting }] = useSubmitIdentificationDocumentMutation();

  // Handle tax ID change
  const handleTaxIdChange = (value: string) => {
    setTaxId(value);
  };

  // Populate form with existing data when loaded
  useEffect(() => {
    if (existingData && existingData.length > 0 && eKYCData) {
      // Pre-populate form with existing data if available
      const taxInformation = existingData.find(
        (item: any) => item.type === IdentificationDocumentType.TAX,
      );
      if (taxInformation?.idNumber) {
        setTaxId(taxInformation.idNumber);
        if (taxInformation?.filePhotoId) {
          setImageUrlState('filePhotoUrl', taxInformation.filePhoto.url);
        }
      }
    }
  }, [existingData, eKYCData]);

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

  const submitTaxInformation = async (documentId?: string) => {
    setIsLoading(true);
    try {
      if (!taxId) {
        toast.error('Please enter your tax identification number');
        return;
      }

      const payload = {
        type: IdentificationDocumentType.TAX,
        idNumber: taxId,
        filePhotoId: documentId || '',
      };

      await submitDocument(payload).unwrap();

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
