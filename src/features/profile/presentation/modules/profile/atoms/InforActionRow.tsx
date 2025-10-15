import { AlertCircle } from 'lucide-react';
import React from 'react';

interface InfoActionRowProps {
  label: string;
  iconColor: string;
  description: string;
  actions?: React.ReactNode;
}

const InfoActionRow: React.FC<InfoActionRowProps> = ({
  label,
  iconColor,
  description,
  actions,
}) => {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex flex-col gap-1">
        <p className="text-lg font-semibold text-slate-900">{label}</p>
        <div className="flex items-center gap-2">
          <AlertCircle className={iconColor} />
          <p className="text-sm text-slate-700">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 h-full">{actions}</div>
    </div>
  );
};

export default InfoActionRow;
