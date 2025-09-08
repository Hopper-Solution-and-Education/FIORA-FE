'use client';

import {
  eKYC,
  EKYCType,
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
  eKYCData: eKYC;
  setImageUrlState: (key: string, url: string | null) => void;
}

export const useIdentificationForm = ({
  eKYCData,
  setImageUrlState,
}: UseIdentificationFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<IdentificationDocumentFormData>({
    idNumber: '',
    issuedDate: '',
    issuedPlace: '',
    idAddress: '',
    type: IdentificationDocumentType.NATIONAL,
  });

  const { data: existingData, isLoading: isLoadingData } = useGetIdentificationDocumentQuery(
    undefined,
    {
      skip: !eKYCData,
    },
  );

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
    if (existingData && existingData.length > 0 && eKYCData) {
      const identificationDocument = existingData.find(
        (item: any) => item.type !== EKYCType.TAX_INFORMATION,
      );

      setFormData((prev) => ({
        ...prev,
        idNumber: identificationDocument?.idNumber || '',
        issuedDate: identificationDocument.issuedDate
          ? new Date(identificationDocument.issuedDate).toISOString().split('T')[0]
          : '',
        issuedPlace: identificationDocument?.issuedPlace || '',
        idAddress: identificationDocument?.idAddress || '',
        type: identificationDocument?.type || IdentificationDocumentType.NATIONAL,
      }));

      if (identificationDocument?.fileFrontId) {
        setImageUrlState('frontImageUrl', identificationDocument.filePhoto.url);
      }
      if (identificationDocument?.fileBackId) {
        setImageUrlState('backImageUrl', identificationDocument.fileBack.url);
      }
      if (identificationDocument?.filePhotoId) {
        setImageUrlState('facePhotoUrl', identificationDocument.filePhoto.url);
      }
    }
  }, [existingData, eKYCData]);

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
