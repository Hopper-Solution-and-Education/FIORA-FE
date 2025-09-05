'use client';

import { uploadToFirebase } from '@/shared/lib/firebase/firebaseUtils';
import { useState } from 'react';
import { toast } from 'sonner';

interface UseFormSubmitProps {
  uploadPath: string;
  fileNamePrefix: string;
  validateFields: () => boolean;
  onSuccess?: () => void;
}

export const useFormSubmit = ({
  uploadPath,
  fileNamePrefix,
  validateFields,
  onSuccess,
}: UseFormSubmitProps) => {
  const [isLoading, setIsLoading] = useState(false);

  // Upload file helper
  const uploadFileHelper = async (file: File): Promise<string | null> => {
    try {
      // Create unique filename
      const fileName = `${fileNamePrefix}-${Date.now()}-${file.name}`;

      // Upload to Firebase Storage using utility function
      const downloadURL = await uploadToFirebase({
        file: file,
        path: uploadPath,
        fileName: fileName,
      });

      return downloadURL;
    } catch (error) {
      console.error('Error uploading file to Firebase:', error);
      return null;
    }
  };

  // Generic submit function
  const submitForm = async (
    submitFn: (payload: any) => Promise<any>,
    payload: any,
    uploadedFile?: File | null,
    successMessage: string = 'Form submitted successfully',
    errorMessage: string = 'Failed to submit form',
  ) => {
    setIsLoading(true);
    try {
      // Validate required fields
      if (!validateFields()) {
        return;
      }

      let documentId: string | undefined;

      // Upload file if exists
      if (uploadedFile) {
        const fileUrl = await uploadFileHelper(uploadedFile);
        if (fileUrl) {
          // You would need to call the attachment mutation here
          // This is a simplified version - in practice you'd pass the attachment mutation
          documentId = 'uploaded'; // Placeholder
        }
      }

      const finalPayload = {
        ...payload,
        ...(documentId && { documentId }),
      };

      await submitFn(finalPayload);

      toast.success(successMessage);
      onSuccess?.();
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast.error(error?.message || errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    setIsLoading,
    uploadFileHelper,
    submitForm,
  };
};
