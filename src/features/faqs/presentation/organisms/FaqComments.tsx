import { USER_ROLES } from '@/shared/constants/featuresFlags';
import { Session } from 'next-auth/react';
import React from 'react';
import type { FaqComment } from '../../domain/entities/models/faqs';
import { useCommentManager } from '../../hooks';
import { CommentInput, CommentItem } from '../molecules';

interface FaqCommentsProps {
  faqId: string;
  comments: FaqComment[];
  setOpenWarningDialog: (open: boolean) => void;
  session?: Session | null;
  handleDeleteComment: (commentId: string) => void;
}

const FaqComments: React.FC<FaqCommentsProps> = ({
  faqId,
  comments,
  setOpenWarningDialog,
  session,
  handleDeleteComment,
}) => {
  const {
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
  } = useCommentManager({
    faqId,
    comments,
  });

  const onSubmitComment = () => {
    if (session?.user?.id) {
      handleSendComment();
    } else {
      setOpenWarningDialog(true);
    }
  };

  const isAdminOrCS =
    session?.user?.role?.toUpperCase() === USER_ROLES.ADMIN ||
    session?.user?.role?.toUpperCase() === USER_ROLES.CS;

  return (
    <>
      <div className="border border-gray-200 rounded-xl p-6">
        {/* Comment Input */}
        <CommentInput
          value={commentInput}
          onChange={setCommentInput}
          onSubmit={onSubmitComment}
          isLoading={commentLoading}
          replyTo={replyTo}
          onCancelReply={handleCancelReply}
        />

        {/* Comments List */}
        <div className="space-y-4">
          {allComments.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-sm">No comments yet. Be the first to comment!</div>
            </div>
          ) : (
            allComments.map((comment) => (
              <div
                key={comment.id}
                className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0"
              >
                <CommentItem
                  comment={comment}
                  onReply={handleReply}
                  onDelete={() => handleDeleteComment(comment.id)}
                  canReply={session?.user?.id !== comment.userId}
                  canDelete={session?.user?.id === comment.userId || isAdminOrCS}
                  // onEdit={handleEditComment}
                  // isEditing={editingCommentId === comment.id}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default FaqComments;
