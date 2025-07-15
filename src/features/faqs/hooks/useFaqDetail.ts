import { USER_ROLES } from '@/shared/constants/featuresFlags';
import { Session, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { FAQ_LIST_CONSTANTS } from '../constants';
import { useDeleteFaqMutation, useGetFaqDetailQuery } from '../store/api/faqsApi';

export const useFaqDetail = (id: string) => {
  const router = useRouter();
  const { data: session } = useSession() as { data: Session | null };
  const isAdminOrCs =
    session?.user?.role.toUpperCase() === USER_ROLES.ADMIN ||
    session?.user?.role.toUpperCase() === USER_ROLES.CS;

  // FAQ detail
  const {
    data: faq,
    error,
    isLoading,
  } = useGetFaqDetailQuery({
    id,
    trackView: false,
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
    router.push(`/faqs/details/${id}/edit`);
  };

  const handleDelete = () => {
    setShowDeleteFaqDialog(true);
  };

  return {
    // Data
    faq,
    error,
    isLoading,
    session,
    isAdminOrCs,
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
