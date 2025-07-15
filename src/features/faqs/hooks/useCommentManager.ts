import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { FaqComment } from '../domain/entities/models/faqs';
import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useGetFaqCommentsQuery,
} from '../store/api/faqsApi';

interface UseCommentManagerProps {
  faqId: string;
}

export const useCommentManager = ({ faqId }: UseCommentManagerProps) => {
  // Pagination
  const [commentPage, setCommentPage] = useState(0);
  const PAGE_SIZE = 10;
  const { data: commentsPage, isLoading: isLoadingCommentsQuery } = useGetFaqCommentsQuery({
    faqId,
    skip: commentPage * PAGE_SIZE,
    take: PAGE_SIZE,
  });
  const [allComments, setAllComments] = useState<FaqComment[]>([]);
  useEffect(() => {
    if (commentsPage)
      setAllComments((prev) => (commentPage === 0 ? commentsPage : [...prev, ...commentsPage]));
  }, [commentsPage, commentPage]);
  const hasMore = commentsPage?.length === PAGE_SIZE;
  const fetchNextPage = () => setCommentPage((p) => p + 1);

  // Mutations
  const [createComment] = useCreateCommentMutation();
  const [deleteComment, { isLoading: isDeletingComment }] = useDeleteCommentMutation();

  // Local state
  const [commentInput, setCommentInput] = useState('');
  const [replyTo, setReplyTo] = useState<{ id: string; username: string } | null>(null);
  const [commentLoading, setCommentLoading] = useState(false);
  const isLoadingComments = isLoadingCommentsQuery || isDeletingComment;

  // Comment handlers
  const handleSendComment = async () => {
    if (!commentInput.trim()) return;
    setCommentLoading(true);
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
    } finally {
      setCommentLoading(false);
    }
  };

  const handleReply = (commentId: string, username: string) => {
    setReplyTo({ id: commentId, username });
  };

  const handleCancelReply = () => {
    setReplyTo(null);
  };

  const confirmDeleteComment = async (commentIdToDelete: string) => {
    if (!commentIdToDelete) return;
    try {
      await deleteComment({ faqId, commentId: commentIdToDelete }).unwrap();
      toast.success('Comment deleted successfully');
      setCommentPage(0); // Refetch comments from first page
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment. Please try again.');
    }
  };

  return {
    // Data
    allComments,
    hasMore,
    fetchNextPage,
    // State
    commentInput,
    setCommentInput,
    commentLoading,
    replyTo,
    setReplyTo,
    isDeletingComment,
    isLoadingComments,
    // Handlers
    handleSendComment,
    handleReply,
    handleCancelReply,
    confirmDeleteComment,
  };
};
