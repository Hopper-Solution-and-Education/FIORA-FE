import { useState } from 'react';
import type { FaqComment } from '../domain/entities/models/faqs';
import { useCreateCommentMutation /* , useUpdateCommentMutation */ } from '../store/api/faqsApi';

interface UseCommentManagerProps {
  faqId: string;
  comments: FaqComment[];
}

export const useCommentManager = ({ faqId, comments }: UseCommentManagerProps) => {
  // Mutations
  const [createComment] = useCreateCommentMutation();
  // const [updateComment] = useUpdateCommentMutation();

  // Local state
  const [commentInput, setCommentInput] = useState('');
  const [replyTo, setReplyTo] = useState<{ id: string; username: string } | null>(null);
  const [commentLoading, setCommentLoading] = useState(false);
  // const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

  // All comments sorted by creation date (newest first)
  const allComments = [...comments].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

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

  // const handleEditComment = async (commentId: string, content: string) => {
  //   setEditingCommentId(commentId);
  //   try {
  //     await updateComment({ faqId, commentId, content }).unwrap();
  //   } catch (error) {
  //     console.error('Error editing comment:', error);
  //     throw error; // Re-throw for UI error handling
  //   } finally {
  //     setEditingCommentId(null);
  //   }
  // };

  const handleReply = (commentId: string, username: string) => {
    setReplyTo({ id: commentId, username });
  };

  const handleCancelReply = () => {
    setReplyTo(null);
  };

  return {
    // Data
    allComments,

    // State
    commentInput,
    commentLoading,
    replyTo,
    // editingCommentId,

    // Handlers
    handleSendComment,
    // handleEditComment,
    handleReply,
    handleCancelReply,

    // Setters
    setCommentInput,
  };
};
