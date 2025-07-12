import { Icons } from '@/components/Icon';
import { USER_ROLES } from '@/shared/constants/featuresFlags';
import { Session, useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { useFaqDetail } from '../../hooks';
import { useDeleteCommentMutation, useDeleteFaqMutation } from '../../store/api/faqsApi';
import {
  ConfirmDeleteDialog,
  FaqComments,
  FaqContent,
  FaqHeader,
  FaqRelatedArticles,
} from '../molecules';
import WarningDialog from '../molecules/WarningDialog';
import FeedbackSection from '../organisms/FeedbackSection';

const FaqDetailPage: React.FC = () => {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { data: session } = useSession() as { data: Session | null };
  const isAdminOrCs =
    session?.user?.role.toUpperCase() === USER_ROLES.ADMIN ||
    session?.user?.role.toUpperCase() === USER_ROLES.CS;

  const {
    // Data
    data,
    error,
    isLoading,
    reactionCounts,
    userReaction,

    // State
    reactionLoading,

    // Handlers
    handleReaction,
  } = useFaqDetail(id, ['related']);

  // Mutations
  const [deleteComment, { isLoading: isDeletingComment }] = useDeleteCommentMutation();
  const [deleteFaq, { isLoading: isDeletingFaq }] = useDeleteFaqMutation();

  // Local state for FAQ deletion
  const [showDeleteFaqDialog, setShowDeleteFaqDialog] = useState(false);
  const [openWarningDialog, setOpenWarningDialog] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState<string | null>(null);

  const confirmDeleteComment = async () => {
    if (!commentIdToDelete) return;

    try {
      await deleteComment({ faqId: id, commentId: commentIdToDelete }).unwrap();
      toast.success('Comment deleted successfully');
      setCommentIdToDelete(null);
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment. Please try again.');
    }
  };

  const handleDeleteFaq = async () => {
    if (!data?.id) return;

    // Show loading toast
    const loadingToast = toast.loading('Deleting FAQ...');

    try {
      await deleteFaq(data.id).unwrap();

      // Close dialog
      setShowDeleteFaqDialog(false);

      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success(`"${data.title}" has been deleted successfully`);

      // Navigate to FAQs list page
      setTimeout(() => {
        router.push('/faqs');
      }, 1000); // Small delay to show the success message
    } catch (error) {
      console.error('Error deleting FAQ:', error);

      // Dismiss loading toast and show error
      toast.dismiss(loadingToast);
      toast.error('Failed to delete FAQ. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-center">
        <div className="text-red-500">
          <h2 className="text-xl font-semibold mb-2">FAQ not found</h2>
          <p className="text-gray-600">The requested FAQ could not be loaded.</p>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    // TODO: Implement edit functionality
    console.log('Edit FAQ:', data.id);
  };

  const handleDelete = () => {
    setShowDeleteFaqDialog(true);
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-10 text-gray-800">
      {/* Header Section */}
      <FaqHeader
        data={data}
        canEdit={isAdminOrCs}
        onEdit={isAdminOrCs ? handleEdit : undefined}
        onDelete={isAdminOrCs ? handleDelete : undefined}
      />

      {/* Content Section */}
      <FaqContent data={data} />

      <hr className="my-10 w-1/2 mx-auto" />

      {/* Related Articles */}
      <FaqRelatedArticles includedArticles={data.relatedArticles} />

      <hr className="my-10 w-1/2 mx-auto" />

      {/* Feedback Section */}
      <FeedbackSection
        reactionCounts={reactionCounts}
        userReaction={userReaction}
        onReaction={handleReaction}
        disabled={reactionLoading}
        setOpenWarningDialog={setOpenWarningDialog}
        session={session ?? null}
      />

      {/* Comments Section */}
      <FaqComments
        faqId={id}
        comments={data.Comment || []}
        setOpenWarningDialog={setOpenWarningDialog}
        session={session ?? null}
        handleDeleteComment={(commentId) => setCommentIdToDelete(commentId)}
      />

      {/* Comment Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={!!commentIdToDelete}
        onClose={() => setCommentIdToDelete(null)}
        onDelete={confirmDeleteComment}
        description="Are you sure you want to delete this comment? This action cannot be undone."
        isDeleting={isDeletingComment}
      />

      {/* FAQ Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={showDeleteFaqDialog}
        onClose={() => setShowDeleteFaqDialog(false)}
        onDelete={handleDeleteFaq}
        description={`Are you sure you want to delete this item? This action cannot be undone.`}
        isDeleting={isDeletingFaq}
      />

      <WarningDialog
        open={openWarningDialog}
        onClose={() => setOpenWarningDialog(false)}
        onSubmit={() => {
          setOpenWarningDialog(false);
          router.push('/login');
        }}
        title="Login Required"
        description="You need to login to do this action"
        icon={<Icons.warning className="h-5 w-5" />}
      />
    </section>
  );
};

export default FaqDetailPage;
