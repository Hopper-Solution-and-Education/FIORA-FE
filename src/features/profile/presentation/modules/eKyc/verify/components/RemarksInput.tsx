'use client';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FC } from 'react';

interface RemarksInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const RemarksInput: FC<RemarksInputProps> = ({ value, onChange, disabled }) => {
  return (
    <div>
      <Label htmlFor="remarks" className="text-sm font-medium text-gray-700">
        Remarks (Optional)
      </Label>
      <Textarea
        id="remarks"
        placeholder="Enter the reason for rejection"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        disabled={disabled}
        className="resize-none text-sm"
      />
    </div>
  );
};
