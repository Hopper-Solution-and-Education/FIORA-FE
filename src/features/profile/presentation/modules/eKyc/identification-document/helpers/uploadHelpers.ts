import { IdentificationDocumentType } from '@/features/profile/domain/entities/models/profile';
import { uploadToFirebase } from '@/shared/lib/firebase/firebaseUtils';
import { toast } from 'sonner';

export const uploadFile = async (
  file: File,
  fileType: string,
): Promise<{ url: string; fileName: string } | null> => {
  try {
    const fileName = `identification-${fileType}-${Date.now()}`;
    const downloadURL = await uploadToFirebase({
      file,
      path: 'ekyc-documents',
      fileName,
    });
    return {
      url: downloadURL,
      fileName: fileName,
    };
  } catch (error) {
    console.error(`Error uploading ${fileType} file:`, error);
    return null;
  }
};

export const uploadAndCreateAttachment = async (
  file: File,
  fileType: string,
  uploadAttachmentMutation: any,
) => {
  const uploadResult = await uploadFile(file, fileType);
  if (!uploadResult) {
    return null;
  }

  const attachment = await uploadAttachmentMutation({
    url: uploadResult.url,
    path: uploadResult.fileName,
    type: 'image',
  });

  return attachment;
};

export const validateRequiredFiles = (
  documentType: IdentificationDocumentType,
  data: any,
): boolean => {
  // Validate issue date
  if (!data.issuedDate || data.issuedDate.trim() === '') {
    toast.error('Please select issue date.');
    return false;
  }

  // Validate files based on document type
  if (documentType === IdentificationDocumentType.NATIONAL) {
    if (!data.frontImage || !data.backImage || !data.facePhoto) {
      toast.error('Please upload front ID, back ID, and face photo.');
      return false;
    }
  } else if (documentType === IdentificationDocumentType.PASSPORT) {
    if (!data.frontImage || !data.facePhoto) {
      toast.error('Please upload passport personal information page and face photo.');
      return false;
    }
  } else if (documentType === IdentificationDocumentType.BUSINESS) {
    if (!data.frontImage || !data.backImage || !data.locationImage) {
      toast.error('Please upload front license, back license, and office address photo.');
      return false;
    }
  }

  return true;
};
