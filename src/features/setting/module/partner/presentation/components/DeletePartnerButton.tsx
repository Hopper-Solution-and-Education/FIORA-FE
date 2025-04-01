'use client';

import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useDeletePartner } from '@/features/setting/hooks/useDeletePartner';

interface DeletePartnerButtonProps {
  partnerId: string;
}

export default function DeletePartnerButton({ partnerId }: DeletePartnerButtonProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { handleDelete, isDeleting } = useDeletePartner();

  const onDelete = async () => {
    await handleDelete(partnerId);
    setIsConfirmOpen(false);
  };

  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setIsConfirmOpen(true)}
        className="flex items-center gap-1"
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the partner and all
              associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
