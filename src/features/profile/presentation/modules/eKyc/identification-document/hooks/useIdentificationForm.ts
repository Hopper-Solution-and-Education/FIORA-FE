'use client';

import {
  IdentificationDocumentFormData,
  IdentificationDocumentType,
} from '@/features/profile/domain/entities/models/profile';
import {
  useGetIdentificationDocumentQuery,
  useSubmitIdentificationDocumentMutation,
  useUploadAttachmentMutation,
} from '@/features/profile/store/api/profileApi';
import { useEffect, useState } from 'react';

interface UseIdentificationFormProps {
  isVerified: boolean;
}

export const useIdentificationForm = ({ isVerified }: UseIdentificationFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<IdentificationDocumentFormData>({
    idNumber: '',
    issuedDate: '',
    issuedPlace: '',
    idAddress: '',
    type: IdentificationDocumentType.NATIONAL,
  });

  // RTK Query hooks
  const { data: existingData, isLoading: isLoadingData } = useGetIdentificationDocumentQuery();
  const [submitDocument, { isLoading: isSubmitting }] = useSubmitIdentificationDocumentMutation();
  const [uploadAttachmentMutation] = useUploadAttachmentMutation();

  // Handle form input changes
  const handleInputChange = (field: keyof IdentificationDocumentFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Populate form with existing data when loaded
  useEffect(() => {
    if (existingData && !isVerified) {
      // Pre-populate form with existing data if available
      if (existingData.idNumber) {
        setFormData((prev) => ({
          ...prev,
          idNumber: existingData.idNumber || '',
          issuedDate: existingData.issuedDate
            ? new Date(existingData.issuedDate).toISOString().split('T')[0]
            : '',
          issuedPlace: existingData.issuedPlace || '',
          idAddress: existingData.idAddress || '',
          type: existingData.type || IdentificationDocumentType.NATIONAL,
        }));
      }
    }
  }, [existingData, isVerified]);

  return {
    formData,
    handleInputChange,
    isLoading,
    setIsLoading,
    isSubmitting,
    isLoadingData,
    submitDocument,
    uploadAttachmentMutation,
  };
};
