import { EKYCStatus, EKYCType } from '@/features/profile/domain/entities/models/profile';
import { Shield } from 'lucide-react';
import { FC, ReactNode } from 'react';

type SectionHeaderProps = {
  title: string;
  children?: ReactNode;
  showIcon?: boolean;
};

export const SectionHeader: FC<SectionHeaderProps> = ({ title, children, showIcon = true }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{title}</h2>
        {showIcon && (
          <div className="bg-yellow-500 p-2 rounded" aria-hidden>
            <Shield className="text-white w-5 h-5" />
          </div>
        )}
      </div>
      {children && <div>{children}</div>}
    </div>
  );
};

export default SectionHeader;

// Export types for convenience
export type { SectionHeaderProps };
export type EKYCStatusMap = Record<EKYCType, EKYCStatus | undefined>;
