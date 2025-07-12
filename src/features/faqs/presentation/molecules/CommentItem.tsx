import React /* , { useState } */ from 'react';
// import { Button } from '@/components/ui/button';
import { differenceInHours, differenceInMinutes, format, isPast } from 'date-fns';
import type { FaqComment } from '../../domain/entities/models/faqs';
import { UserAvatar } from '../atoms';

interface CommentItemProps {
  comment: FaqComment;
  onReply: (commentId: string, username: string) => void;
  onDelete: () => void;
  canDelete?: boolean;
  canReply?: boolean;
  // onEdit?: (commentId: string, content: string) => Promise<void>;
  // isEditing?: boolean;
}

const formatTimeAgo = (createdAt: Date): string => {
  const commentDate = new Date(createdAt);
  const now = new Date();

  if (isPast(commentDate)) {
    const minutesDiff = differenceInMinutes(now, commentDate);

    if (minutesDiff >= 1440) {
      return format(commentDate, 'MMM d, yyyy');
    }

    if (minutesDiff < 1) {
      return 'just now';
    }

    if (minutesDiff < 60) {
      return `${minutesDiff} minute${minutesDiff === 1 ? '' : 's'} ago`;
    }

    const hoursDiff = differenceInHours(now, commentDate);
    return `${hoursDiff} hour${hoursDiff === 1 ? '' : 's'} ago`;
  } else {
    return format(commentDate, 'MMM d, yyyy');
  }
};

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onReply,
  onDelete,
  canDelete = false,
  canReply = false,
  // onEdit,
  // isEditing = false,
}) => {
  // const [isEditMode, setIsEditMode] = useState(false);
  // const [editContent, setEditContent] = useState(comment.content);
  // const [isSubmitting, setIsSubmitting] = useState(false);

  // const handleEditSubmit = async () => {
  //   if (!onEdit || !editContent.trim() || editContent === comment.content) {
  //     setIsEditMode(false);
  //     return;
  //   }

  //   setIsSubmitting(true);
  //   try {
  //     await onEdit(comment.id, editContent.trim());
  //     setIsEditMode(false);
  //   } catch (error) {
  //     console.error('Failed to edit comment:', error);
  //     // Reset content on error
  //     setEditContent(comment.content);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  // const handleEditCancel = () => {
  //   setEditContent(comment.content);
  //   setIsEditMode(false);
  // };

  // const handleEditClick = () => {
  //   setIsEditMode(true);
  //   setEditContent(comment.content);
  // };

  return (
    <div className="flex gap-3 p-4">
      <UserAvatar src={comment.User?.image} name={comment.User?.email} />

      <div className="flex-1 min-w-0">
        {/* User info */}
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm">{comment.User?.email || 'Unknown User'}</span>
          <span className="text-xs text-gray-500">{formatTimeAgo(comment.createdAt)}</span>
        </div>

        {/* Comment content */}
        {/* {isEditMode ? (
          <div className="space-y-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-2 border rounded-md resize-none min-h-[60px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSubmitting}
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleEditSubmit}
                disabled={isSubmitting || !editContent.trim()}
                className="h-7 px-3 text-xs"
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleEditCancel}
                disabled={isSubmitting}
                className="h-7 px-3 text-xs"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : ( */}
        <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">{comment.content}</p>
        {/* )} */}

        {/* Action buttons */}
        {/* {!isEditMode && ( */}
        <div className="flex items-center gap-4 mt-2">
          {canReply && (
            <button
              onClick={() => onReply(comment.id, comment.User?.email || 'Unknown')}
              className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
              // disabled={isEditing}
            >
              Reply
            </button>
          )}

          {/* {canEdit && onEdit && (
              <button
                onClick={handleEditClick}
                className="text-xs text-gray-600 hover:text-gray-800 hover:underline"
                disabled={isEditing}
              >
                Edit
              </button>
            )} */}

          {canDelete && (
            <button
              onClick={onDelete}
              className="text-xs text-red-600 hover:text-red-800 hover:underline"
            >
              Delete
            </button>
          )}
        </div>
        {/* )} */}
      </div>
    </div>
  );
};

export default CommentItem;
