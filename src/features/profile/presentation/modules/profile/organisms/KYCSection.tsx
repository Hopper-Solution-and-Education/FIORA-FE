import { EKYCStatus, EKYCType } from '@/features/profile/domain/entities/models/profile';
import { FC } from 'react';
import KYCActionButton from '../atoms/KYCActionButton';
import KYCStatusBadge from '../atoms/KYCStatusBadge';
import { useKYCData } from '../hooks/useKYCData';
import KYCApprovedInfo from '../molecules/KYCApprovedInfo';

type KYCSectionProps = {
  title: string;
  description: string;
  kycType: EKYCType;
  onNavigateToKYC: () => void;
  className?: string;
  status?: EKYCStatus;
  eKycId?: string;
  props?: any;
};

export const KYCSection: FC<KYCSectionProps> = ({
  title,
  description,
  kycType,
  onNavigateToKYC,
  className = '',
  status,
  eKycId = '',
  ...props
}) => {
  const { taxDocument, identificationDocument, bankAccount } = useKYCData({
    kycType,
    status,
    eKycId,
  });

  const showApprovedInfo = status === EKYCStatus.APPROVAL;

  return (
    <>
      <div className={`flex justify-between items-center ${className}`} {...props}>
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-xs text-gray-500 my-2 flex items-center">
            <KYCStatusBadge status={status} />
            {description}
          </p>
        </div>

        <KYCActionButton status={status} onClick={onNavigateToKYC} />
      </div>

      {showApprovedInfo && (
        <div className="mb-4">
          <KYCApprovedInfo
            kycType={kycType}
            bankAccountData={bankAccount}
            identificationDocument={identificationDocument}
            taxDocument={taxDocument}
          />
        </div>
      )}
    </>
  );
};

export default KYCSection;
