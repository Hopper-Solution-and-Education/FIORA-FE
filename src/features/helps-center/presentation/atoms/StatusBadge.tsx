'use client';

import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface StatusBadgeProps {
  isValid: boolean;
}

const StatusBadge = ({ isValid }: StatusBadgeProps) => {
  if (isValid) {
    return (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        <CheckCircle2 className="mr-1 h-3 w-3" />
        Valid
      </Badge>
    );
  }

  return (
    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
      <AlertCircle className="mr-1 h-3 w-3" />
      Invalid
    </Badge>
  );
};

export default StatusBadge;
