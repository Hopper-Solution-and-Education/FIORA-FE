'use client';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { STATUS_COLOR } from '@/features/profile/constant';
import {
  EKYCStatus,
  EKYCType,
  IdentificationDocumentType,
} from '@/features/profile/domain/entities/models/profile';
import {
  useGetBankAccountQuery,
  useGetIdentificationDocumentQuery,
} from '@/features/profile/store/api/profileApi';
import { AlertCircle, CheckCircle, RefreshCcw, Shield, XCircle } from 'lucide-react';
import { useMemo } from 'react';

type KYCSectionProps = {
  title: string;
  description: string;
  kycType: EKYCType;
  onNavigateToKYC: () => void;
  className?: string;
  status?: EKYCStatus;
};

export const KYCSection: React.FC<KYCSectionProps> = ({
  title,
  description,
  kycType,
  onNavigateToKYC,
  className = '',
  status,
}) => {
  // identification and bank account data get from same api
  const { data: identificationDocumentData, isLoading: isLoadingIdentificationDocumentData } =
    useGetIdentificationDocumentQuery(undefined, {
      skip:
        !(kycType === EKYCType.IDENTIFICATION_DOCUMENT || kycType === EKYCType.BANK_ACCOUNT) &&
        status !== EKYCStatus.APPROVAL,
    });

  const { data: bankAccountData, isLoading: isLoadingBankAccountData } = useGetBankAccountQuery(
    undefined,
    { skip: kycType !== EKYCType.BANK_ACCOUNT && status !== EKYCStatus.APPROVAL },
  );

  // Get tax document
  const taxDocument = useMemo(() => {
    if (!identificationDocumentData || identificationDocumentData.length === 0) return null;
    return identificationDocumentData.find(
      (item: any) => item.type === IdentificationDocumentType.TAX,
    );
  }, [identificationDocumentData]);

  // Get identification document
  const identificationDocument = useMemo(() => {
    if (!identificationDocumentData || identificationDocumentData.length === 0) return null;
    return identificationDocumentData.find(
      (item: any) => item.type !== IdentificationDocumentType.TAX,
    );
  }, [identificationDocumentData]);

  const renderStatusIcon = () => {
    if (!status) {
      return <AlertCircle className={`${STATUS_COLOR[EKYCStatus.PENDING].iconColor}  mr-2`} />;
    }
    const statusClassName = `${STATUS_COLOR[status].iconColor}  mr-2`;
    if (status === EKYCStatus.APPROVAL) {
      return <CheckCircle className={statusClassName} />;
    }
    if (status === EKYCStatus.PENDING) {
      return <AlertCircle className={statusClassName} />;
    }
    if (status === EKYCStatus.REJECTED) {
      return <XCircle className={statusClassName} />;
    }
  };

  const renderStatusAction = () => {
    if (status === EKYCStatus.PENDING) {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigateToKYC()}
          type="button"
          className={`${STATUS_COLOR[EKYCStatus.PENDING].color} ${STATUS_COLOR[EKYCStatus.PENDING].hoverColor} ${STATUS_COLOR[EKYCStatus.PENDING].textColor}`}
        >
          Pending
        </Button>
      );
    }

    if (status === EKYCStatus.APPROVAL) {
      return null;
    }

    if (status === EKYCStatus.REJECTED) {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigateToKYC()}
          type="button"
          className={`w-10 h-10`}
        >
          <RefreshCcw />
        </Button>
      );
    }

    return (
      <Button
        className={`w-10 h-10 ${STATUS_COLOR[EKYCStatus.PENDING].color} p-2 rounded cursor-pointer ${STATUS_COLOR[EKYCStatus.PENDING].hoverColor}`}
        variant="outline"
        size="sm"
        type="button"
        onClick={() => onNavigateToKYC()}
      >
        <Shield />
      </Button>
    );
  };

  const renderApprovedInfo = () => {
    if (status !== EKYCStatus.APPROVAL) {
      return null;
    }

    if (kycType === EKYCType.BANK_ACCOUNT) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            name="bankName"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel htmlFor="name">Bank Name</FormLabel>
                <FormControl>
                  <Input
                    id="bank-name"
                    {...field}
                    value={bankAccountData?.bankName ?? ''}
                    disabled={true}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="accountNumber"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel htmlFor="name">Account Number</FormLabel>
                <FormControl>
                  <Input
                    id="account-number"
                    {...field}
                    value={bankAccountData?.accountNumber ?? ''}
                    disabled={true}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      );
    }

    if (kycType === EKYCType.IDENTIFICATION_DOCUMENT) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            name="idNumber"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel htmlFor="name">ID Number</FormLabel>
                <FormControl>
                  <Input
                    id="id-number"
                    {...field}
                    value={identificationDocument?.idNumber ?? ''}
                    disabled={true}
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
                <FormLabel htmlFor="name">Issued Date</FormLabel>
                <FormControl>
                  <Input
                    id="issued-date"
                    {...field}
                    value={
                      identificationDocument?.issuedDate
                        ? new Date(identificationDocument.issuedDate).toLocaleDateString()
                        : ''
                    }
                    disabled={true}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      );
    }

    if (kycType === EKYCType.TAX_INFORMATION) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            name="taxCode"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel htmlFor="name">Tax Code</FormLabel>
                <FormControl>
                  <Input
                    id="tax-code"
                    {...field}
                    value={taxDocument?.taxCode ?? ''}
                    disabled={true}
                  />
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

  return (
    <>
      <div className={`flex justify-between items-center  ${className}`}>
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-xs text-gray-500 my-2 flex items-center">
            {renderStatusIcon()}
            {description}
          </p>
        </div>

        {renderStatusAction()}
      </div>
      <div className="mb-4">{renderApprovedInfo()}</div>
    </>
  );
};

export default KYCSection;
