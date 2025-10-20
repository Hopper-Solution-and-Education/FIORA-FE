'use client';

import {
  EKYCStatus,
  EKYCType,
  IdentificationDocumentType,
} from '@/features/profile/domain/entities/models/profile';
import {
  useGetBankAccountByUserIdQuery,
  useGetBankAccountQuery,
  useGetIdentificationDocumentByUserIdQuery,
  useGetIdentificationDocumentQuery,
} from '@/features/profile/store/api/profileApi';
import { useMemo } from 'react';

interface UseKYCDataParams {
  kycType: EKYCType;
  status?: EKYCStatus;
  eKycId?: string;
}

export const useKYCData = ({ kycType, status, eKycId = '' }: UseKYCDataParams) => {
  const shouldFetchIdentification =
    (kycType === EKYCType.IDENTIFICATION_DOCUMENT || kycType === EKYCType.BANK_ACCOUNT) &&
    status === EKYCStatus.APPROVAL;

  const shouldFetchBankAccount =
    kycType === EKYCType.BANK_ACCOUNT && status === EKYCStatus.APPROVAL;

  // Fetch identification documents
  const { data: identificationDocumentData } = useGetIdentificationDocumentQuery(undefined, {
    skip: !shouldFetchIdentification || !!eKycId,
  });

  const { data: identificationDocumentDataByUserId } = useGetIdentificationDocumentByUserIdQuery(
    eKycId,
    {
      skip: !shouldFetchIdentification || !eKycId,
    },
  );

  // Fetch bank accounts
  const { data: bankAccountData } = useGetBankAccountQuery(undefined, {
    skip: !shouldFetchBankAccount || !!eKycId,
  });

  const { data: bankAccountDataByUserId } = useGetBankAccountByUserIdQuery(eKycId, {
    skip: !shouldFetchBankAccount || !eKycId,
  });

  // Get tax document
  const taxDocument = useMemo(() => {
    const documents = eKycId ? identificationDocumentDataByUserId : identificationDocumentData;
    if (!documents || documents.length === 0) return null;

    return documents.find((item: any) => item.type === IdentificationDocumentType.TAX);
  }, [eKycId, identificationDocumentData, identificationDocumentDataByUserId]);

  // Get identification document (non-tax)
  const identificationDocument = useMemo(() => {
    const documents = eKycId ? identificationDocumentDataByUserId : identificationDocumentData;
    if (!documents || documents.length === 0) return null;

    return documents.find((item: any) => item.type !== IdentificationDocumentType.TAX);
  }, [eKycId, identificationDocumentData, identificationDocumentDataByUserId]);

  // Get bank account
  const bankAccount = useMemo(() => {
    return eKycId ? bankAccountDataByUserId : bankAccountData;
  }, [eKycId, bankAccountData, bankAccountDataByUserId]);

  return {
    taxDocument,
    identificationDocument,
    bankAccount,
  };
};

export default useKYCData;
