// File: /features/setting/presentation/module/partner/components/AddPartnerModal.tsx
'use client';

import { Button } from '@/components/ui/button';

interface AddPartnerModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const AddPartnerModal = ({ isOpen, setIsOpen }: AddPartnerModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="p-4 bg-gray-100 border rounded-lg">
      <h4 className="text-md font-semibold">Add New Partner</h4>
      <p className="text-sm">This is a placeholder for the partner form.</p>
      <Button className="mt-2" onClick={() => setIsOpen(false)}>
        Close
      </Button>
    </div>
  );
};
