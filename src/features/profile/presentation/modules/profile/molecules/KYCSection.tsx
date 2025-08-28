'use client';
import { AlertCircle, CheckCircle, Shield } from 'lucide-react';

type KYCSectionProps = {
  title: string;
  description: string;
  kycType: string;
  onNavigateToKYC: (type: string) => void;
  className?: string;
  isVerified?: boolean;
};

export const KYCSection: React.FC<KYCSectionProps> = ({
  title,
  description,
  kycType,
  onNavigateToKYC,
  className = '',
  isVerified = false,
}) => {
  return (
    <div className={`flex justify-between items-center mb-4 ${className}`}>
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-xs text-gray-500 my-2 flex items-center">
          {isVerified ? (
            <span className="text-green-500 mr-2" aria-hidden>
              <CheckCircle />
            </span>
          ) : (
            <span className="text-orange-500 mr-2" aria-hidden>
              <AlertCircle />
            </span>
          )}
          {description}
        </p>
      </div>

      {isVerified ? null : (
        <div
          className="bg-yellow-500 p-2 rounded cursor-pointer hover:bg-yellow-600"
          aria-hidden
          onClick={() => onNavigateToKYC(kycType)}
        >
          <Shield className="text-white" />
        </div>
      )}
    </div>
  );
};

export default KYCSection;
