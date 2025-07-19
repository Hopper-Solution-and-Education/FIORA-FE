import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { differenceInHours, differenceInMinutes, format, isPast } from 'date-fns';
import { MoreVertical } from 'lucide-react';
import React from 'react';
import type { FaqComment } from '../../domain/entities/models/faqs';
import { UserAvatar } from '../atoms';

interface CommentItemProps {
  comment: FaqComment;
  onReply: (commentId: string, username: string) => void;
  onDelete: () => void;
  canDelete?: boolean;
  canReply?: boolean;
}

const formatTimeAgo = (createdAt: Date): string => {
  const commentDate = new Date(createdAt);
  const now = new Date();
  if (isPast(commentDate)) {
    const minutesDiff = differenceInMinutes(now, commentDate);
    if (minutesDiff >= 1440) {
      return format(commentDate, 'MMM d, yyyy hh:mm a');
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
    return format(commentDate, 'MMM d, yyyy hh:mm a');
  }
};

const renderCommentContent = (content: string) => {
  if (content.startsWith('@')) {
    const firstSpace = content.indexOf(' ');
    if (firstSpace > 0) {
      const username = content.slice(0, firstSpace);
      const rest = content.slice(firstSpace);
      return (
        <span>
          <span className="text-blue-600 font-medium">{username}</span>
          {rest}
        </span>
      );
    }
  }
  return content;
};

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onReply,
  onDelete,
  canDelete = false,
  canReply = false,
}) => {
  return (
    <div className="py-3 border-b border-gray-100 last:border-b-0">
      <div className="pt-1 flex items-center gap-4">
        <UserAvatar src={comment.User?.image} name={comment.User?.email} size="lg" />
        {/* Header: user, date, menu */}
        <div className="flex justify-between mb-1 w-full">
          <div className="flex flex-col gap-2">
            <span className="font-medium text-sm text-gray-900 leading-tight">
              {comment.User?.email || 'Unknown User'}
            </span>
            <span className="text-xs text-gray-500 leading-tight">
              {formatTimeAgo(comment.createdAt)}
            </span>
          </div>
          {(canReply || canDelete) && (
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    data-test="comment-item-dropdown-menu-trigger"
                    className="p-1 "
                    aria-label="Comment actions"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-500" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  {canReply && (
                    <DropdownMenuItem
                      onClick={() => onReply(comment.id, comment.User?.email || 'Unknown')}
                      className="cursor-pointer"
                    >
                      Reply comment
                    </DropdownMenuItem>
                  )}
                  {canDelete && (
                    <DropdownMenuItem
                      onClick={onDelete}
                      className="text-red-600 focus:text-red-700 cursor-pointer"
                    >
                      Delete comment
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="rounded-xl p-2 bg-white">
          {/* Comment content */}
          <p className="text-sm text-gray-700 whitespace-pre-wrap break-words mt-1">
            {renderCommentContent(comment.content)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
