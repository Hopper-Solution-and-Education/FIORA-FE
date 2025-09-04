'use client';

import { uploadToFirebase } from '@/shared/lib/firebase/firebaseUtils';
import { useState } from 'react';
import { toast } from 'sonner';

export const useFileUpload = () => {
  const [frontImageUrl, setFrontImageUrl] = useState<string | null>(null);
  const [backImageUrl, setBackImageUrl] = useState<string | null>(null);
  const [facePhotoUrl, setFacePhotoUrl] = useState<string | null>(null);

  // File upload helper using Firebase - convert blob URL to file and upload
  const uploadFileHelper = async (
    blobUrl: string,
    fileType: 'front' | 'back' | 'face',
  ): Promise<string | null> => {
    try {
      // Convert blob URL to File object
      const response = await fetch(blobUrl);
      const blob = await response.blob();

      // Create unique filename
      const fileName = `identification-${fileType}-${Date.now()}`;

      // Upload to Firebase Storage using utility function
      const downloadURL = await uploadToFirebase({
        file: blob,
        path: 'images/identification-documents',
        fileName: fileName,
      });

      return downloadURL;
    } catch (error) {
      console.error('Error uploading file to Firebase:', error);
      return null;
    }
  };

  const submitIdentificationDocument = async (
    formData: any,
    uploadAttachmentMutation: any,
    submitDocument: any,
    setIsLoading: (loading: boolean) => void,
  ) => {
    setIsLoading(true);
    try {
      // Validate required fields
      if (
        !formData.idNumber ||
        !formData.issuedDate ||
        !formData.issuedPlace ||
        !formData.idAddress ||
        !frontImageUrl ||
        !backImageUrl ||
        !facePhotoUrl
      ) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Upload files if they exist
      let fileFrontId = null;
      let fileBackId = null;
      let filePhotoId = null;

      fileFrontId = await uploadFileHelper(frontImageUrl, 'front');
      if (!fileFrontId) {
        toast.error('Failed to upload front document image');
        return;
      }

      fileBackId = await uploadFileHelper(backImageUrl, 'back');
      if (!fileBackId) {
        toast.error('Failed to upload back document image');
        return;
      }

      filePhotoId = await uploadFileHelper(facePhotoUrl, 'face');
      if (!filePhotoId) {
        toast.error('Failed to upload portrait photo');
        return;
      }

      const attachmentFrontId = await uploadAttachmentMutation({
        url: fileFrontId,
        path: 'images/identification-documents',
        type: 'image',
      });

      const attachmentBackId = await uploadAttachmentMutation({
        url: fileBackId,
        path: 'images/identification-documents',
        type: 'image',
      });

      const attachmentPhotoId = await uploadAttachmentMutation({
        url: filePhotoId,
        path: 'images/identification-documents',
        type: 'image',
      });

      const payload = {
        ...(attachmentFrontId && { fileFrontId: attachmentFrontId?.data.id }),
        ...(attachmentBackId && { fileBackId: attachmentBackId?.data?.id }),
        ...(attachmentPhotoId && { filePhotoId: attachmentPhotoId?.data?.id }),
        idAddress: formData.idAddress,
        issuedDate: new Date(formData.issuedDate).toISOString(),
        type: formData.type,
        idNumber: formData.idNumber,
        issuedPlace: formData.issuedPlace,
      };

      await submitDocument(payload).unwrap();

      toast.success('Document submitted successfully');
    } catch (error: any) {
      console.error('Error submitting document:', error);
      toast.error(error?.message || 'Failed to submit document');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    frontImageUrl,
    setFrontImageUrl,
    backImageUrl,
    setBackImageUrl,
    facePhotoUrl,
    setFacePhotoUrl,
    uploadFileHelper,
    submitIdentificationDocument,
  };
};
