import { useAppDispatch, useAppSelector } from '@/store';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { deletePartner } from '../module/partner/slices/actions/deletePartnerAsyncThunk';

interface UseDeletePartnerOptions {
  redirectPath?: string;
}

export const useDeletePartner = (options: UseDeletePartnerOptions = {}) => {
  const { redirectPath = '/setting/partner' } = options;
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const isDeletingPartner = useAppSelector((state) => state.partner.isDeletingPartner);

  const handleDelete = async (id: string) => {
    if (!id) {
      toast.error('Partner ID is required');
      return;
    }

    try {
      setIsDeleting(true);
      const resultAction = await dispatch(deletePartner(id));

      if (deletePartner.fulfilled.match(resultAction)) {
        if (redirectPath) {
          router.push(redirectPath);
        }
      }
    } catch (error) {
      console.error('Delete partner error:', error);
      toast.error('Failed to delete partner');
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    handleDelete,
    isDeleting: isDeleting || isDeletingPartner,
  };
};
