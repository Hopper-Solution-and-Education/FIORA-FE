'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';

interface RejectedRemarksFieldProps {
  remarks?: string;
}

const RejectedRemarksField = ({ remarks }: RejectedRemarksFieldProps) => {
  if (!remarks) {
    return null;
  }

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertDescription className="ml-2">
        <div className="space-y-2">
          <p>Remarks: {remarks}</p>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default RejectedRemarksField;
