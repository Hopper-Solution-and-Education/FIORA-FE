import { USER_ROLES } from '@/shared/constants/featuresFlags';
import { Session } from 'next-auth/react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import type { FaqComment } from '../../domain/entities/models/faqs';
import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useGetFaqCommentsQuery,
} from '../../store/api/faqsApi';
import { CommentInput, CommentItem, ConfirmDeleteDialog } from '../molecules';

interface FaqCommentsProps {
  faqId: string;
  setOpenWarningDialog: (open: boolean) => void;
  session?: Session | null;
}

const PAGE_SIZE = 10;

const FaqCommentsSection: React.FC<FaqCommentsProps> = ({
  faqId,
  setOpenWarningDialog,
  session,
}) => {
  const [page, setPage] = useState(0);
  const [comments, setComments] = useState<FaqComment[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [replyTo, setReplyTo] = useState<{ id: string; username: string } | null>(null);
  const [commentIdToDelete, setCommentIdToDelete] = useState<string | null>(null);

  const {
    data: commentsPage,
    isLoading: isLoadingPage,
    refetch,
  } = useGetFaqCommentsQuery({
    faqId,
    skip: page * PAGE_SIZE,
    take: PAGE_SIZE,
  });
  const [createComment, { isLoading: isCreatingComment }] = useCreateCommentMutation();
  const [deleteComment, { isLoading: isDeletingComment }] = useDeleteCommentMutation();

  const isLoading = isLoadingPage || isCreatingComment || isDeletingComment;

  // Append only unique comments
  useEffect(() => {
    if (!commentsPage) return;
    setComments((prev) => {
      if (page === 0) return commentsPage;
      const existingIds = new Set(prev.map((c) => c.id));
      const newUnique = commentsPage.filter((c) => !existingIds.has(c.id));
      if (newUnique.length === 0 || commentsPage.length < PAGE_SIZE) setHasMore(false);
      else setHasMore(true);
      setLoadingMore(false);
      return [...prev, ...newUnique];
    });
  }, [commentsPage, page]);

  // Infinite scroll observer
  const observer = useRef<IntersectionObserver | null>(null);
  const lastCommentRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!hasMore || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new window.IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loadingMore && hasMore) {
        setLoadingMore(true);
        setPage((p) => p + 1);
      }
    });
    if (lastCommentRef.current) observer.current.observe(lastCommentRef.current);
    return () => observer.current?.disconnect();
  }, [comments, hasMore, loadingMore]);

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
      setPage(0); // Refetch all comments
      setHasMore(true); //Reset hasMore so infinite scroll works again
      refetch();
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
      setPage(0); // Refetch all comments
      setHasMore(true); //Reset hasMore so infinite scroll works again
      refetch();
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

  // Unique comments for rendering
  const uniqueComments = useMemo(() => {
    const seen = new Set();
    return comments.filter((comment) => {
      if (seen.has(comment.id)) return false;
      seen.add(comment.id);
      return true;
    });
  }, [comments]);

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
      <div className="space-y-4">
        {uniqueComments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-sm">No comments yet. Be the first to comment!</div>
          </div>
        ) : (
          uniqueComments.map((comment, idx) => {
            const isLast = idx === uniqueComments.length - 1;
            return (
              <div
                key={comment.id}
                className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0"
                ref={isLast ? lastCommentRef : undefined}
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

        {hasMore && <div className="text-center py-2 text-gray-400 text-xs">Loading more...</div>}

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
    </div>
  );
};

export default FaqCommentsSection;
