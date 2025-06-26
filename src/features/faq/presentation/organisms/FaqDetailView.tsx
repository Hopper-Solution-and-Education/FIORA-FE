// import Image from 'next/image';
// import { useState, useEffect } from 'react';
// import { Smile, Meh, Frown } from 'lucide-react';
// import { ChevronDown } from 'lucide-react';
// import { SendHorizonal } from 'lucide-react';
// import { Pencil, Trash2 } from 'lucide-react';
// import ConfirmExitDialog from './ConfirmExitDialog';
// import ParsedFaqContent from './ParsedFaqContent';
// interface FaqDetailViewProps {
//   id: string;
// }
// export default function FIORAFAQ({ id }: FaqDetailViewProps) {
//   const [faq, setFaq] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [comments, setComments] = useState<any[]>([]);
//   const [commentInput, setCommentInput] = useState('');
//   const [commentLoading, setCommentLoading] = useState(false);
//   const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
//   useEffect(() => {
//     if (!id) return;
//     fetch(`/api/faqs/${id}`)
//       .then((res) => res.json())
//       .then((data) => {
//         setFaq(data);
//         setLoading(false);
//       });
//   }, [id]);

//   // useEffect(() => {
//   //   if (!id) return;
//   //   fetch(`/api/faqs/${id}`)
//   //     .then((res) => res.json())
//   //     .then((data) => {
//   //       setFaq(data);
//   //       setLoading(false);
//   //       setComments(data.Comment || []);
//   //     });
//   // }, [id]);
//   useEffect(() => {
//     if (!id) return;
//     fetch(`/api/faqs/${id}`)
//       .then((res) => res.json())
//       .then((data) => {
//         setFaq(data);
//         setLoading(false);
//         setComments(data.Comment || []);
//         if (data.Reaction) {
//           const counts: { [key: string]: number } = {};
//           let myReaction: string | null = null;
//           data.Reaction.forEach((r: any) => {
//             counts[r.reactionType] = (counts[r.reactionType] || 0) + 1;
//             if (r.userId === data.currentUserId) myReaction = r.reactionType;
//           });
//           setReactionCounts(counts);
//           setUserReaction(myReaction);
//         }
//       });
//   }, [id]);
//   const handleReaction = async (type: string) => {
//     if (userReaction === type) {
//       await fetch(`/api/faqs/${id}/reaction`, { method: 'DELETE' });
//       setUserReaction(null);
//       setReactionCounts((prev) => ({
//         ...prev,
//         [type]: (prev[type] || 1) - 1,
//       }));
//     } else {
//       await fetch(`/api/faqs/${id}/reaction`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ reactionType: type }),
//       });
//       setUserReaction(type);
//       setReactionCounts((prev) => ({
//         ...prev,
//         [type]: (prev[type] || 0) + 1,
//         ...(userReaction ? { [userReaction]: (prev[userReaction] || 1) - 1 } : {}),
//       }));
//     }
//   };

//   const handleDeleteComment = async (cid: string) => {
//     const res = await fetch(`/api/faqs/${id}/comments/${cid}`, {
//       method: 'DELETE',
//     });
//     if (res.ok) {
//       setComments(comments.filter((c) => c.id !== cid));
//     }
//   };
//   const handleEditComment = (cid: string, content: string) => {
//     setEditingCommentId(cid);
//     setEditContent(content);
//   };
//   const handleSaveEdit = async (cid: string) => {
//     const res = await fetch(`/api/faqs/${id}/comments/${cid}`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ content: editContent }),
//     });
//     if (res.ok) {
//       setComments(comments.map((c) => (c.id === cid ? { ...c, content: editContent } : c)));
//       setEditingCommentId(null);
//       setEditContent('');
//     }
//   };
//   const [userReaction, setUserReaction] = useState<string | null>(null);
//   const [reactionCounts, setReactionCounts] = useState<{ [key: string]: number }>({});
//   const [expanded, setExpanded] = useState(false);
//   const [feedback, setFeedback] = useState<string | null>(null);
//   const toggleExpanded = () => setExpanded(!expanded);
//   const handleFeedback = (type: string) => setFeedback(type);
//   const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
//   const [editContent, setEditContent] = useState('');
//   const [openMenuIndex, setOpenMenuIndex] = useState<string | null>(null);
//   const toggleMenu = (id: string) => {
//     setOpenMenuIndex(openMenuIndex === id ? null : id);
//   };
//   const handleSendComment = async () => {
//     if (!commentInput.trim()) return;
//     setCommentLoading(true);
//     const res = await fetch(`/api/faqs/${id}/comments`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ content: commentInput }),
//     });
//     if (res.ok) {
//       const newComment = await res.json();
//       setComments([newComment, ...comments]);
//       setCommentInput('');
//     }
//     setCommentLoading(false);
//   };
//   if (loading) return <div>Loading...</div>;
//   if (!faq) return <div>FAQ not found.</div>;
//   return (
//     <section className="max-w-4xl mx-auto px-4 py-10 text-gray-800">
//       <div className="flex items-center justify-between mb-4">
//         <h1 className="text-3xl font-bold">{faq.title}</h1>
//         {faq.User?.role === 'CS' && (
//           <div className="flex items-center gap-2">
//             <button className="w-9 h-9 flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-100 transition">
//               <Pencil className="w-5 h-5 text-gray-700" />
//             </button>
//             <button className="w-9 h-9 flex items-center justify-center rounded-md border border-gray-300 hover:bg-red-100 transition">
//               <Trash2 className="w-5 h-5 text-red-500" />
//             </button>
//           </div>
//         )}
//       </div>
//       <p className="text-sm text-gray-500 mb-2">Posted by {faq.User?.email || 'Unknown'}</p>
//       <p className="text-sm text-gray-400 mb-4">
//         Updated {new Date(faq.createdAt).toLocaleString()}
//       </p>
//       {faq.content && <ParsedFaqContent htmlContent={faq.content} />}
//       {!expanded && (
//         <div className="flex flex-col items-center mb-6">
//           <button onClick={toggleExpanded} className="text-sm text-black font-medium">
//             See more
//           </button>
//           <div className="text-black mt-1 flex flex-col items-center leading-none">
//             <ChevronDown size={18} strokeWidth={2} />
//             <ChevronDown size={18} strokeWidth={2} className="-mt-1" />
//           </div>
//           <hr className="mt-2 border-t border-gray-300 w-[80%]" />
//         </div>
//       )}
//       {expanded && (
//         <>
//           <div className="mb-6">
//             <p>
//               No, FIORA is not a bank, either in Singapore or in any other country where it
//               currently operates... (repeated for effect).
//             </p>
//           </div>

//           <div className="mb-6">
//             <p>
//               No, FIORA is not a bank, either in Singapore or in any other country where it
//               currently operates. FIORA is a Payment Services Institution, providing financial
//               services to customers subject to the relevant laws and regulations of the
//               jurisdictions where it operates.
//             </p>
//           </div>
//         </>
//       )}
//       <div className="text-center my-8">
//         <p className="font-semibold mb-2">Did this answer your question?</p>
//         <div className="flex justify-center gap-6 group" onMouseLeave={() => setFeedback(null)}>
//           <button
//             onMouseEnter={() => setFeedback('bad')}
//             onClick={() => handleFeedback('bad')}
//             className={`transition-transform duration-200 transform ${
//               feedback === 'bad'
//                 ? 'scale-110 text-red-500'
//                 : feedback
//                   ? 'grayscale opacity-60'
//                   : 'text-yellow-400'
//             }`}
//           >
//             <Frown size={40} />
//           </button>
//           <button
//             onMouseEnter={() => setFeedback('neutral')}
//             onClick={() => handleFeedback('neutral')}
//             className={`transition-transform duration-200 transform ${
//               feedback === 'neutral'
//                 ? 'scale-110 text-yellow-500'
//                 : feedback
//                   ? 'grayscale opacity-60'
//                   : 'text-yellow-400'
//             }`}
//           >
//             <Meh size={40} />
//           </button>
//           <button
//             onMouseEnter={() => setFeedback('good')}
//             onClick={() => handleFeedback('good')}
//             className={`transition-transform duration-200 transform ${
//               feedback === 'good'
//                 ? 'scale-110 text-green-500'
//                 : feedback
//                   ? 'grayscale opacity-60'
//                   : 'text-yellow-400'
//             }`}
//           >
//             <Smile size={40} />
//           </button>
//         </div>
//         {/* Reaction buttons dưới 3 icon feedback */}
//         <div className="flex justify-center gap-4 mt-6">
//           <button
//             className={`flex items-center gap-1 px-3 py-1 rounded ${userReaction === 'bad' ? 'bg-red-100 text-red-600' : 'bg-gray-100'}`}
//             onClick={() => handleReaction('bad')}
//           >
//             <Frown size={20} /> {reactionCounts['bad'] || 0}
//           </button>
//           <button
//             className={`flex items-center gap-1 px-3 py-1 rounded ${userReaction === 'neutral' ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100'}`}
//             onClick={() => handleReaction('neutral')}
//           >
//             <Meh size={20} /> {reactionCounts['neutral'] || 0}
//           </button>
//           <button
//             className={`flex items-center gap-1 px-3 py-1 rounded ${userReaction === 'good' ? 'bg-green-100 text-green-600' : 'bg-gray-100'}`}
//             onClick={() => handleReaction('good')}
//           >
//             <Smile size={20} /> {reactionCounts['good'] || 0}
//           </button>
//         </div>
//       </div>
//       <div className="bg-gray-50 p-6 rounded-xl mt-10">
//         <h2 className="font-bold text-lg mb-4">Related Articles</h2>
//         <ul className="space-y-2">
//           {[
//             'How to reset my password?',
//             'Why can’t I log into my account?',
//             'How to track my order?',
//             'How to cancel or change an order?',
//             'How to contact customer support?',
//           ].map((title, i) => (
//             <li key={i} className="flex justify-between items-center border-b pb-2">
//               {title} <span className="text-green-500">&gt;</span>
//             </li>
//           ))}
//         </ul>
//       </div>
//       <div className="border border-gray-200 rounded-xl p-6 mt-10 bg-white">
//         <div className="flex gap-2 mb-4">
//           <input
//             type="text"
//             placeholder="Enter your question"
//             className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
//             value={commentInput}
//             onChange={(e) => setCommentInput(e.target.value)}
//             disabled={commentLoading}
//           />
//           <button
//             className="w-10 h-10 flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-100 transition"
//             onClick={handleSendComment}
//             disabled={commentLoading}
//           >
//             <SendHorizonal className="w-4 h-4 text-gray-700" />
//           </button>
//         </div>
//         <p className="font-semibold mb-4">
//           If you have any questions, please comment below and we will respond soon
//         </p>
//         {comments.length === 0 && <div className="text-gray-400">No comments yet.</div>}
//         {comments.map((c) => (
//           <div key={c.id} className="flex items-start gap-3 mb-6 relative">
//             <Image
//               src="/images/userdetail.jpg"
//               width={40}
//               height={40}
//               className="rounded-full"
//               alt="User avatar"
//             />
//             <div className="flex-1">
//               <p className="font-semibold">{c.User?.name || c.userId}</p>
//               <p className="text-xs text-gray-500 mb-1">{new Date(c.createdAt).toLocaleString()}</p>
//               {editingCommentId === c.id ? (
//                 <div className="flex gap-2">
//                   <input
//                     className="border px-2 py-1 rounded flex-1"
//                     value={editContent}
//                     onChange={(e) => setEditContent(e.target.value)}
//                     autoFocus
//                   />
//                   <button
//                     className="text-green-600 font-semibold"
//                     onClick={() => handleSaveEdit(c.id)}
//                   >
//                     Save
//                   </button>
//                   <button className="text-gray-400" onClick={() => setEditingCommentId(null)}>
//                     Cancel
//                   </button>
//                 </div>
//               ) : (
//                 <p className="text-sm text-gray-700">{c.content}</p>
//               )}
//             </div>
//             <div className="relative flex flex-col items-end">
//               <button
//                 onClick={() => toggleMenu(c.id)}
//                 className="text-gray-500 hover:text-black text-xl px-2"
//               >
//                 ⋮
//               </button>
//               {openMenuIndex === c.id && (
//                 <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 shadow-md rounded-md z-10">
//                   <button
//                     className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
//                     onClick={() => {
//                       handleEditComment(c.id, c.content);
//                       setOpenMenuIndex(null); // Đóng menu khi bắt đầu edit
//                     }}
//                   >
//                     Edit comment
//                   </button>
//                   <button
//                     className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
//                     onClick={() => setConfirmDeleteId(c.id)}
//                   >
//                     Delete comment
//                   </button>
//                 </div>
//               )}
//               {confirmDeleteId === c.id && (
//                 <ConfirmExitDialog
//                   open={true}
//                   onOpenChange={(open) => !open && setConfirmDeleteId(null)}
//                   onConfirmExit={() => {
//                     handleDeleteComment(c.id);
//                     setConfirmDeleteId(null);
//                   }}
//                   onCancelExit={() => setConfirmDeleteId(null)}
//                 />
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }
import Image from 'next/image';
import useSWR from 'swr';
import { useState } from 'react';
import { Smile, Meh, Frown, ChevronDown, SendHorizonal, Pencil, Trash2 } from 'lucide-react';
import ConfirmExitDialog from './ConfirmExitDialog';
import ParsedFaqContent from './ParsedFaqContent';

interface FaqDetailViewProps {
  id: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function FIORAFAQ({ id }: FaqDetailViewProps) {
  const { data, error, isLoading, mutate } = useSWR(id ? `/api/faqs/${id}` : null, fetcher);

  const [commentInput, setCommentInput] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [openMenuIndex, setOpenMenuIndex] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Reaction state lấy từ data
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

  // Gửi comment mới
  const handleSendComment = async () => {
    if (!commentInput.trim()) return;
    setCommentLoading(true);
    const res = await fetch(`/api/faqs/${id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: commentInput }),
    });
    if (res.ok) {
      setCommentInput('');
      mutate();
    }
    setCommentLoading(false);
  };

  // Xóa comment
  const handleDeleteComment = async (cid: string) => {
    const res = await fetch(`/api/faqs/${id}/comments/${cid}`, { method: 'DELETE' });
    if (res.ok) mutate();
  };

  // Sửa comment
  const handleEditComment = (cid: string, content: string) => {
    setEditingCommentId(cid);
    setEditContent(content);
  };
  const handleSaveEdit = async (cid: string) => {
    const res = await fetch(`/api/faqs/${id}/comments/${cid}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: editContent }),
    });
    if (res.ok) {
      setEditingCommentId(null);
      setEditContent('');
      mutate();
    }
  };

  // Reaction
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
  const toggleMenu = (id: string) => setOpenMenuIndex(openMenuIndex === id ? null : id);

  if (isLoading) return <div>Loading...</div>;
  if (error || !faq) return <div>FAQ not found.</div>;

  return (
    <section className="max-w-4xl mx-auto px-4 py-10 text-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">{faq.title}</h1>
        {faq.User?.role === 'CS' && (
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-100 transition">
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
                    ? `scale-110 ${colorClass}` // Hover
                    : userReaction === type
                      ? `scale-110 ${colorClass}` // Đã chọn
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
        {comments.length === 0 && <div className="text-gray-400">No comments yet.</div>}
        {comments.map((c) => (
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
              {editingCommentId === c.id ? (
                <div className="flex gap-2">
                  <input
                    className="border px-2 py-1 rounded flex-1"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    autoFocus
                  />
                  <button
                    className="text-green-600 font-semibold"
                    onClick={() => handleSaveEdit(c.id)}
                  >
                    Save
                  </button>
                  <button className="text-gray-400" onClick={() => setEditingCommentId(null)}>
                    Cancel
                  </button>
                </div>
              ) : (
                <p className="text-sm text-gray-700">{c.content}</p>
              )}
            </div>
            <div className="relative flex flex-col items-end">
              <button
                onClick={() => toggleMenu(c.id)}
                className="text-gray-500 hover:text-black text-xl px-2"
              >
                ⋮
              </button>
              {openMenuIndex === c.id && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 shadow-md rounded-md z-10">
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
                    onClick={() => {
                      handleEditComment(c.id, c.content);
                      setOpenMenuIndex(null);
                    }}
                  >
                    Edit comment
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    onClick={() => setConfirmDeleteId(c.id)}
                  >
                    Delete comment
                  </button>
                </div>
              )}
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
          </div>
        ))}
      </div>
    </section>
  );
}
