'use client';
import { Button } from '@/components/ui/button';
import { STATUS_COLOR } from '@/features/profile/constant';
import { EKYCStatus } from '@/features/profile/domain/entities/models/profile';
import { AlertCircle, CheckCircle, Shield, XCircle } from 'lucide-react';

type KYCSectionProps = {
  title: string;
  description: string;
  kycType: string;
  onNavigateToKYC: (type: string) => void;
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
          onClick={() => onNavigateToKYC(kycType)}
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

    return (
      <div
        className={`${STATUS_COLOR[EKYCStatus.PENDING].color} p-2 rounded cursor-pointer ${STATUS_COLOR[EKYCStatus.PENDING].hoverColor}`}
        aria-hidden
        onClick={() => onNavigateToKYC(kycType)}
      >
        <Shield className="text-white" />
      </div>
    );
  };

  return (
    <div className={`flex justify-between items-center mb-4 ${className}`}>
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-xs text-gray-500 my-2 flex items-center">
          {renderStatusIcon()}
          {description}
        </p>
      </div>

      {renderStatusAction()}
    </div>
  );
};

export default KYCSection;
