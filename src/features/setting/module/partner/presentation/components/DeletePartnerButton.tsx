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
import { useState, useEffect } from 'react';
import { useDeletePartner } from '@/features/setting/hooks/useDeletePartner';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useAppSelector } from '@/store';
import { Partner } from '@/features/setting/module/partner/domain/entities/Partner';

interface DeletePartnerButtonProps {
  partnerId: string;
  partnerName: string;
  partner: Partner;
}

export default function DeletePartnerButton({
  partnerId,
  partnerName,
  partner,
}: DeletePartnerButtonProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { handleDelete, isDeleting } = useDeletePartner();
  const [replacementPartnerId, setReplacementPartnerId] = useState<string>('');

  const partners = useAppSelector((state) => state.partner.partners);
  const availablePartners = partners.filter((p) => p.id !== partnerId);

  // Check if partner has transactions or sub-partners
  const hasTransactions = partner.transactions && partner.transactions.length > 0;
  const hasSubPartners = partner?.children && partner.children.length > 0;

  console.log('Transactions data:', partner.transactions);
  console.log('Has transactions:', hasTransactions);
  console.log('Available partners:', partners);

  useEffect(() => {
    if (!isConfirmOpen) {
      setReplacementPartnerId('');
    }
  }, [isConfirmOpen]);

  const onDelete = async () => {
    try {
      // If partner has sub-partners, prevent deletion
      if (hasSubPartners) {
        toast.error(
          'Cannot delete partner with sub-partners. Please delete all sub-partners first.',
        );
        setIsConfirmOpen(false);
        return;
      }

      // If partner has transactions, require replacement partner
      if (hasTransactions && !replacementPartnerId) {
        toast.error('Please select a replacement partner for transactions.');
        return;
      }

      await handleDelete(partnerId, hasTransactions ? replacementPartnerId : undefined);
      setIsConfirmOpen(false);
    } catch (error) {
      console.error('Error deleting partner:', error);
      toast.error('Failed to delete partner');
    }
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
              {hasSubPartners ? (
                <div className="text-red-500 font-medium mb-2">
                  Warning: {partnerName} has sub-partners. You must delete all sub-partners first.
                </div>
              ) : (
                <>
                  This action cannot be undone. This will permanently delete {partnerName}.
                  {/* Always show replacement partner selection if there are transactions */}
                  {hasTransactions && (
                    <div className="mt-4">
                      <div className="text-amber-500 font-medium mb-2">
                        This partner has associated transactions. You must select a replacement
                        partner:
                      </div>
                      <div className="mt-2">
                        <Label htmlFor="replacement-partner">Replacement Partner</Label>
                        <Select
                          value={replacementPartnerId}
                          onValueChange={setReplacementPartnerId}
                        >
                          <SelectTrigger id="replacement-partner">
                            <SelectValue placeholder="Select a replacement partner" />
                          </SelectTrigger>
                          <SelectContent>
                            {availablePartners.length > 0 ? (
                              availablePartners.map((partner) => (
                                <SelectItem key={partner.id} value={partner.id}>
                                  {partner.name}
                                </SelectItem>
                              ))
                            ) : (
                              <div className="p-2 text-center text-muted-foreground">
                                No other partners available. Please create another partner first.
                              </div>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              disabled={
                isDeleting ||
                hasSubPartners ||
                (hasTransactions && (!replacementPartnerId || availablePartners.length === 0))
              }
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
