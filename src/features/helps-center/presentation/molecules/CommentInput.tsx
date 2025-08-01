import { SendHorizonal } from 'lucide-react';
import React from 'react';

interface CommentInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  isLoading?: boolean;
  replyTo?: {
    id: string;
    username: string;
  } | null;
  onCancelReply?: () => void;
}

const CommentInput: React.FC<CommentInputProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = 'Enter your question',
  isLoading = false,
  replyTo,
  onCancelReply,
}) => {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
    }
  };

  const handleSubmit = () => {
    if (!isLoading && value.trim()) {
      onSubmit();
    }
  };

  return (
    <div>
      <p className="font-semibold mb-4">
        If you have any questions, please comment below and we will respond soon
      </p>
      {replyTo && (
        <div className="mb-2 text-sm text-blue-600 flex items-center gap-2">
          Replying to <span className="font-semibold">@{replyTo.username}</span>
          {onCancelReply && (
            <button
              data-test="comment-input-cancel-reply"
              type="button"
              className="ml-2 text-xs text-gray-400 hover:text-red-500 focus:outline-none focus:text-red-500"
              onClick={onCancelReply}
              tabIndex={0}
              aria-label="Cancel reply"
            >
              Cancel
            </button>
          )}
        </div>
      )}
      <div className="flex gap-2 mb-4">
        <input
          data-test="comment-input-text"
          type="text"
          placeholder={placeholder}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          aria-label="Comment input"
        />
        <button
          data-test="comment-input-send"
          type="button"
          className="w-10 h-10 flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSubmit}
          disabled={isLoading || !value.trim()}
          tabIndex={0}
          aria-label="Send comment"
        >
          <SendHorizonal className="w-4 h-4 text-gray-700" />
        </button>
      </div>
    </div>
  );
};

export default CommentInput;
