'use client';

import { KYC_ITEMS } from '@/features/profile/constant';
import { EKYCStatus, EKYCType } from '@/features/profile/domain/entities/models/profile';
import { cn } from '@/shared/utils';
import { FC } from 'react';
import KYCStatusBadge from '../atoms/KYCStatusBadge';

interface KYCStatusListProps {
  eKYCStatuses: Record<EKYCType, EKYCStatus | undefined>;
  onNavigate: (route: string) => void;
}

export const KYCStatusList: FC<KYCStatusListProps> = ({ eKYCStatuses, onNavigate }) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {Object.values(KYC_ITEMS).map((item) => {
        const status = eKYCStatuses[item.type];

        return (
          <button
            key={item.type}
            onClick={() => onNavigate(item.route)}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors',
              'hover:bg-gray-50 cursor-pointer',
            )}
            type="button"
          >
            <KYCStatusBadge status={status} />
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default KYCStatusList;
