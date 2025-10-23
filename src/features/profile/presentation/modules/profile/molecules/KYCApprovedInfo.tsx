'use client';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { EKYCType } from '@/features/profile/domain/entities/models/profile';
import { FC } from 'react';

interface KYCApprovedInfoProps {
  kycType: EKYCType;
  bankAccountData?: {
    bankName?: string;
    accountNumber?: string;
  };
  identificationDocument?: {
    idNumber?: string;
    issuedDate?: string;
  };
  taxDocument?: {
    idNumber?: string;
  };
}

export const KYCApprovedInfo: FC<KYCApprovedInfoProps> = ({
  kycType,
  bankAccountData,
  identificationDocument,
  taxDocument,
}) => {
  if (kycType === EKYCType.BANK_ACCOUNT && bankAccountData) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          name="bankName"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel htmlFor="bank-name">Bank Name</FormLabel>
              <FormControl>
                <Input id="bank-name" {...field} value={bankAccountData.bankName ?? ''} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="accountNumber"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel htmlFor="account-number">Account Number</FormLabel>
              <FormControl>
                <Input
                  id="account-number"
                  {...field}
                  value={bankAccountData.accountNumber ?? ''}
                  disabled
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    );
  }

  if (kycType === EKYCType.IDENTIFICATION_DOCUMENT && identificationDocument) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          name="idNumber"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel htmlFor="id-number">ID Number</FormLabel>
              <FormControl>
                <Input
                  id="id-number"
                  {...field}
                  value={identificationDocument.idNumber ?? ''}
                  disabled
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="issuedDate"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel htmlFor="issued-date">Issued Date</FormLabel>
              <FormControl>
                <Input
                  id="issued-date"
                  {...field}
                  value={
                    identificationDocument.issuedDate
                      ? new Date(identificationDocument.issuedDate).toLocaleDateString()
                      : ''
                  }
                  disabled
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    );
  }

  if (kycType === EKYCType.TAX_INFORMATION && taxDocument) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          name="taxCode"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel htmlFor="tax-code">Tax Code</FormLabel>
              <FormControl>
                <Input id="tax-code" {...field} value={taxDocument.idNumber ?? ''} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    );
  }

  return null;
};

export default KYCApprovedInfo;
