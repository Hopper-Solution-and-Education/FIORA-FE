import { IdentificationDocumentType } from '@/features/profile/domain/entities/models/profile';

interface BasePayload {
  idAddress: string;
  issuedDate: string;
  type: IdentificationDocumentType;
  idNumber: string;
  issuedPlace: string;
}

export const buildSubmitPayload = (
  documentType: IdentificationDocumentType,
  baseData: any,
  attachments: {
    attachmentFront: any;
    attachmentBack: any;
    attachmentPhoto: any;
    attachmentLocation: any;
  },
) => {
  const basePayload: BasePayload = {
    idAddress: baseData.idAddress,
    issuedDate: new Date(baseData.issuedDate).toISOString(),
    type: baseData.type,
    idNumber: baseData.idNumber,
    issuedPlace: baseData.issuedPlace,
  };

  const { attachmentFront, attachmentBack, attachmentPhoto, attachmentLocation } = attachments;

  if (documentType === IdentificationDocumentType.NATIONAL) {
    return {
      ...basePayload,
      fileFrontId: attachmentFront?.data?.id,
      fileBackId: attachmentBack?.data?.id,
      filePhotoId: attachmentPhoto?.data?.id,
    };
  }

  if (documentType === IdentificationDocumentType.PASSPORT) {
    return {
      ...basePayload,
      fileFrontId: attachmentFront?.data?.id,
      filePhotoId: attachmentPhoto?.data?.id,
    };
  }

  if (documentType === IdentificationDocumentType.BUSINESS) {
    return {
      ...basePayload,
      fileFrontId: attachmentFront?.data?.id,
      fileBackId: attachmentBack?.data?.id,
      fileLocationId: attachmentLocation?.data?.id,
    };
  }

  return basePayload;
};
