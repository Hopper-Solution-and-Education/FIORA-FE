import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { FAQ_LIST_CONSTANTS } from '../constants';
import { useDeleteFaqMutation, useGetFaqDetailQuery } from '../store/api/helpsCenterApi';

export const useFaqDetail = (id: string) => {
  const router = useRouter();

  // FAQ detail
  const {
    data: faq,
    error,
    isLoading,
  } = useGetFaqDetailQuery({
    id,
    trackView: true,
    include: [FAQ_LIST_CONSTANTS.GET_FAQ_DETAIL_INCLUDE.related],
  });

  // Mutations
  const [deleteFaq, { isLoading: isDeletingFaq }] = useDeleteFaqMutation();

  // Local state for dialogs
  const [showDeleteFaqDialog, setShowDeleteFaqDialog] = useState(false);
  const [openWarningDialog, setOpenWarningDialog] = useState(false);

  // Handlers
  const handleDeleteFaq = async () => {
    if (!faq?.id) return;
    try {
      await deleteFaq(faq.id).unwrap();
      setShowDeleteFaqDialog(false);
      toast.success(`"${faq.title}" has been deleted successfully`);
      setTimeout(() => {
        router.push('/faqs');
      }, 1000);
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      toast.error('Failed to delete FAQ. Please try again.');
    }
  };

  const handleEdit = () => {
    router.push(`/helps-center/faqs/details/${id}/edit`);
  };

  const handleDelete = () => {
    setShowDeleteFaqDialog(true);
  };

  return {
    // Data
    faq,
    error,
    isLoading,
    showDeleteFaqDialog,
    setShowDeleteFaqDialog,
    openWarningDialog,
    setOpenWarningDialog,
    isDeletingFaq,
    // Handlers
    handleEdit,
    handleDelete,
    handleDeleteFaq,
  };
};
