import { Skeleton } from '@/components/ui/skeleton';
import { USER_ROLES } from '@/shared/constants/featuresFlags';
import { Session } from 'next-auth/react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useGetFaqCommentsQuery,
} from '../../store/api/helpsCenterApi';
import { CommentInput, CommentItem, ConfirmDeleteDialog } from '../molecules';

interface FaqCommentsProps {
  faqId: string;
  setOpenWarningDialog: (open: boolean) => void;
  session?: Session | null;
}

const FaqCommentsSection: React.FC<FaqCommentsProps> = ({
  faqId,
  setOpenWarningDialog,
  session,
}) => {
  const [commentInput, setCommentInput] = useState('');
  const [replyTo, setReplyTo] = useState<{ id: string; username: string } | null>(null);
  const [commentIdToDelete, setCommentIdToDelete] = useState<string | null>(null);

  const { data: comments, isLoading: isLoadingPage } = useGetFaqCommentsQuery(faqId);
  const [createComment, { isLoading: isCreatingComment }] = useCreateCommentMutation();
  const [deleteComment, { isLoading: isDeletingComment }] = useDeleteCommentMutation();

  const isLoading = isLoadingPage || isCreatingComment || isDeletingComment;

  // Handlers
  const handleSendComment = async () => {
    if (!commentInput.trim()) return;
    try {
      await createComment({
        faqId,
        comment: {
          content: commentInput,
          replyToUsername: replyTo?.username,
        },
      }).unwrap();
      setCommentInput('');
      setReplyTo(null);
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleReply = (commentId: string, username: string) =>
    setReplyTo({ id: commentId, username });

  const handleCancelReply = () => setReplyTo(null);

  const confirmDeleteComment = async (commentIdToDelete: string) => {
    if (!commentIdToDelete) return;
    try {
      await deleteComment({ faqId, commentId: commentIdToDelete }).unwrap();
      toast.success('Comment deleted successfully');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment. Please try again.');
    }
  };

  const onSubmitComment = () => {
    if (session?.user?.id) handleSendComment();
    else setOpenWarningDialog(true);
  };

  const isAdminOrCS =
    session?.user?.role?.toUpperCase() === USER_ROLES.ADMIN ||
    session?.user?.role?.toUpperCase() === USER_ROLES.CS;

  const renderLoading = () => {
    return (
      <div className="space-y-4">
        {Array(3)
          .fill(0)
          .map((_, index) => (
            <Skeleton key={index} className="w-full h-32" />
          ))}
      </div>
    );
  };

  return (
    <div className="border border-gray-200 rounded-xl p-6">
      <CommentInput
        value={commentInput}
        onChange={setCommentInput}
        onSubmit={onSubmitComment}
        isLoading={isLoading}
        replyTo={replyTo}
        onCancelReply={handleCancelReply}
      />

      {isLoading ? (
        renderLoading()
      ) : (
        <div className="space-y-4">
          {comments?.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-sm">No comments yet. Be the first to comment!</div>
            </div>
          ) : (
            comments?.map((comment) => {
              return (
                <div
                  key={comment.id}
                  className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0"
                >
                  <CommentItem
                    comment={comment}
                    onReply={handleReply}
                    onDelete={() => setCommentIdToDelete(comment.id)}
                    canReply={session?.user?.id !== comment.userId}
                    canDelete={session?.user?.id === comment.userId || isAdminOrCS}
                  />
                </div>
              );
            })
          )}
        </div>
      )}

      <ConfirmDeleteDialog
        open={!!commentIdToDelete}
        onClose={() => setCommentIdToDelete(null)}
        onDelete={() => {
          confirmDeleteComment(commentIdToDelete ?? '');
          setCommentIdToDelete(null);
        }}
        description="Are you sure you want to delete this comment? This action cannot be undone."
        isDeleting={isDeletingComment}
      />
    </div>
  );
};

export default FaqCommentsSection;
