import Image from 'next/image';
import useSWR from 'swr';
import { useState } from 'react';
import { Smile, Meh, Frown, ChevronDown, SendHorizonal, Pencil, Trash2 } from 'lucide-react';
import ConfirmExitDialog from './ConfirmExitDialog';
import ParsedFaqContent from './ParsedFaqContent';
import { useRouter } from 'next/navigation';
interface FaqDetailViewProps {
  id: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function FIORAFAQ({ id }: FaqDetailViewProps) {
  const { data, error, isLoading, mutate } = useSWR(id ? `/api/faqs/${id}` : null, fetcher);
  const [replyTo, setReplyTo] = useState<{ id: string; username: string } | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const router = useRouter();
  const reactionCounts = (() => {
    const counts: { [key: string]: number } = {};
    data?.Reaction?.forEach((r: any) => {
      counts[r.reactionType] = (counts[r.reactionType] || 0) + 1;
    });
    return counts;
  })();
  const userReaction =
    data?.Reaction?.find((r: any) => r.userId === data?.currentUserId)?.reactionType || null;
  const comments = data?.Comment || [];
  const faq = data;
  const currentUserRole = data?.currentUserRole;
  const currentUserId = data?.currentUserId;

  const parentComments = comments.filter((c: any) => !c.parentId);

  const handleSendComment = async () => {
    if (!commentInput.trim()) return;
    setCommentLoading(true);

    let content = commentInput;
    if (replyTo) {
      content = `@${replyTo.username}: ${commentInput}`;
    }

    const res = await fetch(`/api/faqs/${id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    if (res.ok) {
      setCommentInput('');
      setReplyTo(null);
      mutate();
    }
    setCommentLoading(false);
  };

  const handleDeleteComment = async (cid: string) => {
    const res = await fetch(`/api/faqs/${id}/${cid}`, { method: 'DELETE' });
    if (res.ok) mutate();
  };

  const handleReaction = async (type: string) => {
    if (userReaction === type) {
      await fetch(`/api/faqs/${id}/reaction`, { method: 'DELETE' });
    } else {
      await fetch(`/api/faqs/${id}/reaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reactionType: type }),
      });
    }
    mutate();
  };

  const toggleExpanded = () => setExpanded(!expanded);

  const childComments = comments.filter((c: any) => c.parentId);
  function renderReplies(parentId: string) {
    return childComments
      .filter((reply: any) => reply.parentId === parentId)
      .map((reply: any) => (
        <div
          key={reply.id}
          className="flex items-start gap-3 mb-3 ml-10 relative border-l pl-4 border-blue-100"
        >
          <Image
            src="/images/userdetail.jpg"
            width={32}
            height={32}
            className="rounded-full"
            alt="User avatar"
          />
          <div className="flex-1">
            <p className="font-semibold">{reply.User?.name || reply.userId}</p>
            <p className="text-xs text-gray-500 mb-1">
              {new Date(reply.createdAt).toLocaleString()}
            </p>
            <p className="text-sm text-gray-700">
              {reply.content.startsWith('@') ? (
                <>
                  <span className="text-blue-600 font-semibold">{reply.content.split(':')[0]}</span>
                  {reply.content.substring(reply.content.indexOf(':') + 1)}
                </>
              ) : (
                reply.content
              )}
            </p>

            {(currentUserRole === 'CS' || currentUserRole === 'Admin') && (
              <button
                className="text-xs text-blue-500 hover:underline mt-1"
                onClick={() =>
                  setReplyTo({ id: reply.id, username: reply.User?.name || reply.userId })
                }
              >
                Reply
              </button>
            )}
          </div>

          {(currentUserRole === 'CS' ||
            (currentUserRole === 'User' && reply.userId === currentUserId)) && (
            <div className="flex flex-col items-end ml-2">
              <button
                onClick={() => setConfirmDeleteId(reply.id)}
                className="text-gray-500 hover:text-red-600 text-xl px-2"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              {confirmDeleteId === reply.id && (
                <ConfirmExitDialog
                  open={true}
                  onOpenChange={(open) => !open && setConfirmDeleteId(null)}
                  onConfirmExit={() => {
                    handleDeleteComment(reply.id);
                    setConfirmDeleteId(null);
                  }}
                  onCancelExit={() => setConfirmDeleteId(null)}
                />
              )}
            </div>
          )}
        </div>
      ));
  }
  if (isLoading) return <div>Loading...</div>;
  if (error || !faq) return <div>FAQ not found.</div>;

  return (
    <section className="max-w-4xl mx-auto px-4 py-10 text-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">{faq.title}</h1>
        {(currentUserRole === 'CS' || currentUserRole === 'Admin') && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push(`/faq/edit/${faq.id}`)}
              className="w-9 h-9 flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-100 transition"
            >
              <Pencil className="w-5 h-5 text-gray-700" />
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-md border border-gray-300 hover:bg-red-100 transition">
              <Trash2 className="w-5 h-5 text-red-500" />
            </button>
          </div>
        )}
      </div>
      <p className="text-sm text-gray-500 mb-2">Posted by {faq.User?.email || 'Unknown'}</p>
      <p className="text-sm text-gray-400 mb-4">
        Updated {new Date(faq.createdAt).toLocaleString()}
      </p>
      {faq.content && <ParsedFaqContent htmlContent={faq.content} />}
      {!expanded && (
        <div className="flex flex-col items-center mb-6">
          <button onClick={toggleExpanded} className="text-sm text-black font-medium">
            See more
          </button>
          <div className="text-black mt-1 flex flex-col items-center leading-none">
            <ChevronDown size={18} strokeWidth={2} />
            <ChevronDown size={18} strokeWidth={2} className="-mt-1" />
          </div>
          <hr className="mt-2 border-t border-gray-300 w-[80%]" />
        </div>
      )}
      {expanded && (
        <>
          <div className="mb-6">
            <p>
              No, FIORA is not a bank, either in Singapore or in any other country where it
              currently operates... (repeated for effect).
            </p>
          </div>
          <div className="mb-6">
            <p>
              No, FIORA is not a bank, either in Singapore or in any other country where it
              currently operates. FIORA is a Payment Services Institution, providing financial
              services to customers subject to the relevant laws and regulations of the
              jurisdictions where it operates.
            </p>
          </div>
        </>
      )}
      <div className="text-center my-8">
        <p className="font-semibold mb-2">Did this answer your question?</p>
        <div className="flex justify-center gap-10 group" onMouseLeave={() => setFeedback(null)}>
          {['bad', 'neutral', 'good'].map((type) => {
            const Icon = type === 'bad' ? Frown : type === 'neutral' ? Meh : Smile;

            const colorClass =
              type === 'bad'
                ? 'text-red-500'
                : type === 'neutral'
                  ? 'text-yellow-500'
                  : 'text-green-500';

            return (
              <button
                key={type}
                onMouseEnter={() => setFeedback(type)}
                onClick={() => handleReaction(type)}
                className={`flex flex-col items-center transition-transform duration-200 transform ${
                  feedback === type
                    ? `scale-110 ${colorClass}`
                    : userReaction === type
                      ? `scale-110 ${colorClass}`
                      : feedback
                        ? 'grayscale opacity-60'
                        : 'text-yellow-400'
                }`}
              >
                <Icon size={40} />
                <span className="text-sm font-semibold mt-1">{reactionCounts[type] || 0}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-xl mt-10">
        <h2 className="font-bold text-lg mb-4">Related Articles</h2>
        <ul className="space-y-2">
          {[
            'How to reset my password?',
            'Why can’t I log into my account?',
            'How to track my order?',
            'How to cancel or change an order?',
            'How to contact customer support?',
          ].map((title, i) => (
            <li key={i} className="flex justify-between items-center border-b pb-2">
              {title} <span className="text-green-500">&gt;</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="border border-gray-200 rounded-xl p-6 mt-10 bg-white">
        {replyTo && (
          <div className="mb-2 text-sm text-blue-600 flex items-center gap-2">
            Replying to <span className="font-semibold">@{replyTo.username}</span>
            <button
              className="ml-2 text-xs text-gray-400 hover:text-red-500"
              onClick={() => setReplyTo(null)}
            >
              Cancel
            </button>
          </div>
        )}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Enter your question"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            disabled={commentLoading}
          />
          <button
            className="w-10 h-10 flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-100 transition"
            onClick={handleSendComment}
            disabled={commentLoading}
          >
            <SendHorizonal className="w-4 h-4 text-gray-700" />
          </button>
        </div>
        <p className="font-semibold mb-4">
          If you have any questions, please comment below and we will respond soon
        </p>
        {parentComments.length === 0 && <div className="text-gray-400">No comments yet.</div>}

        {parentComments.map((c: any) => (
          <div key={c.id} className="flex items-start gap-3 mb-6 relative">
            <Image
              src="/images/userdetail.jpg"
              width={40}
              height={40}
              className="rounded-full"
              alt="User avatar"
            />
            <div className="flex-1">
              <p className="font-semibold">{c.User?.name || c.userId}</p>
              <p className="text-xs text-gray-500 mb-1">{new Date(c.createdAt).toLocaleString()}</p>
              <p className="text-sm text-gray-700">
                {c.content.startsWith('@') && c.content.includes(':') ? (
                  <>
                    <span className="text-blue-600 font-semibold">{c.content.split(':')[0]}</span>
                    {c.content.substring(c.content.indexOf(':') + 1)}
                  </>
                ) : (
                  c.content
                )}
              </p>

              {(currentUserRole === 'CS' || currentUserRole === 'Admin') && (
                <button
                  className="text-xs text-blue-500 hover:underline mt-1"
                  onClick={() => setReplyTo({ id: c.id, username: c.User?.name || c.userId })}
                >
                  Reply
                </button>
              )}
              {renderReplies(c.id)}
            </div>

            {(currentUserRole === 'CS' ||
              (currentUserRole === 'User' && c.userId === currentUserId)) && (
              <div className="flex flex-col items-end ml-2">
                <button
                  onClick={() => setConfirmDeleteId(c.id)}
                  className="text-gray-500 hover:text-red-600 text-xl px-2"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                {confirmDeleteId === c.id && (
                  <ConfirmExitDialog
                    open={true}
                    onOpenChange={(open) => !open && setConfirmDeleteId(null)}
                    onConfirmExit={() => {
                      handleDeleteComment(c.id);
                      setConfirmDeleteId(null);
                    }}
                    onCancelExit={() => setConfirmDeleteId(null)}
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
