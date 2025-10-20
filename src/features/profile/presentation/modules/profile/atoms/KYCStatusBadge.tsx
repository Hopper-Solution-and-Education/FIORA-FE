'use client';

import { STATUS_COLOR } from '@/features/profile/constant';
import { EKYCStatus } from '@/features/profile/domain/entities/models/profile';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { FC } from 'react';

interface KYCStatusBadgeProps {
  status?: EKYCStatus;
}

export const KYCStatusBadge: FC<KYCStatusBadgeProps> = ({ status }) => {
  if (!status) {
    return <AlertCircle className={`${STATUS_COLOR[EKYCStatus.PENDING].iconColor} mr-2`} />;
  }

  const statusClassName = `${STATUS_COLOR[status].iconColor} mr-2`;

  switch (status) {
    case EKYCStatus.APPROVAL:
      return <CheckCircle className={statusClassName} />;
    case EKYCStatus.PENDING:
      return <AlertCircle className={statusClassName} />;
    case EKYCStatus.REJECTED:
      return <XCircle className={statusClassName} />;
    default:
      return null;
  }
};

export default KYCStatusBadge;
