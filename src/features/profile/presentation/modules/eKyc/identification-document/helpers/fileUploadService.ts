import { IdentificationDocumentType } from '@/features/profile/domain/entities/models/profile';
import { toast } from 'sonner';
import { uploadAndCreateAttachment } from './uploadHelpers';

export const uploadNewSubmissionFiles = async (
  documentType: IdentificationDocumentType,
  data: any,
  uploadAttachmentMutation: any,
) => {
  const attachments: any = {
    attachmentFront: null,
    attachmentBack: null,
    attachmentPhoto: null,
    attachmentLocation: null,
  };

  // Upload front image (required for all types)
  if (data.frontImage) {
    attachments.attachmentFront = await uploadAndCreateAttachment(
      data.frontImage,
      'front',
      uploadAttachmentMutation,
    );
    if (!attachments.attachmentFront) {
      toast.error('Failed to upload front document. Please try again.');
      return null;
    }
  }

  // Upload back image (required for NATIONAL and BUSINESS)
  if (
    documentType === IdentificationDocumentType.NATIONAL ||
    documentType === IdentificationDocumentType.BUSINESS
  ) {
    if (data.backImage) {
      attachments.attachmentBack = await uploadAndCreateAttachment(
        data.backImage,
        'back',
        uploadAttachmentMutation,
      );
      if (!attachments.attachmentBack) {
        toast.error('Failed to upload back document. Please try again.');
        return null;
      }
    }
  }

  // Upload face photo (required for NATIONAL and PASSPORT)
  if (
    documentType === IdentificationDocumentType.NATIONAL ||
    documentType === IdentificationDocumentType.PASSPORT
  ) {
    if (data.facePhoto) {
      attachments.attachmentPhoto = await uploadAndCreateAttachment(
        data.facePhoto,
        'face',
        uploadAttachmentMutation,
      );
      if (!attachments.attachmentPhoto) {
        toast.error('Failed to upload face photo. Please try again.');
        return null;
      }
    }
  }

  // Upload location image (required for BUSINESS)
  if (documentType === IdentificationDocumentType.BUSINESS && data.locationImage) {
    attachments.attachmentLocation = await uploadAndCreateAttachment(
      data.locationImage,
      'location',
      uploadAttachmentMutation,
    );
    if (!attachments.attachmentLocation) {
      toast.error('Failed to upload office address photo. Please try again.');
      return null;
    }
  }

  return attachments;
};
export const uploadEditSubmissionFiles = async (
  documentType: IdentificationDocumentType,
  data: any,
  identificationDocument: any,
  uploadAttachmentMutation: any,
) => {
  const attachments: any = {
    attachmentFront: null,
    attachmentBack: null,
    attachmentPhoto: null,
    attachmentLocation: null,
  };

  // Handle front image
  if (data.frontImage) {
    attachments.attachmentFront = await uploadAndCreateAttachment(
      data.frontImage,
      'front',
      uploadAttachmentMutation,
    );
  } else if (identificationDocument?.fileFront?.id) {
    attachments.attachmentFront = { data: { id: identificationDocument.fileFront.id } };
  }

  // Handle back image (for NATIONAL and BUSINESS)
  if (
    documentType === IdentificationDocumentType.NATIONAL ||
    documentType === IdentificationDocumentType.BUSINESS
  ) {
    if (data.backImage) {
      attachments.attachmentBack = await uploadAndCreateAttachment(
        data.backImage,
        'back',
        uploadAttachmentMutation,
      );
    } else if (identificationDocument?.fileBack?.id) {
      attachments.attachmentBack = { data: { id: identificationDocument.fileBack.id } };
    }
  }

  // Handle face photo (for NATIONAL and PASSPORT)
  if (
    documentType === IdentificationDocumentType.NATIONAL ||
    documentType === IdentificationDocumentType.PASSPORT
  ) {
    if (data.facePhoto) {
      attachments.attachmentPhoto = await uploadAndCreateAttachment(
        data.facePhoto,
        'face',
        uploadAttachmentMutation,
      );
    } else if (identificationDocument?.filePhoto?.id) {
      attachments.attachmentPhoto = { data: { id: identificationDocument.filePhoto.id } };
    }
  }

  // Handle location image (for BUSINESS)
  if (documentType === IdentificationDocumentType.BUSINESS) {
    if (data.locationImage) {
      attachments.attachmentLocation = await uploadAndCreateAttachment(
        data.locationImage,
        'location',
        uploadAttachmentMutation,
      );
    } else if (identificationDocument?.fileLocation?.id) {
      attachments.attachmentLocation = { data: { id: identificationDocument.fileLocation.id } };
    }
  }

  return attachments;
};
