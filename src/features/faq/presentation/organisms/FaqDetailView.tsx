import Image from 'next/image';
import { useState } from 'react';
import { Smile, Meh, Frown } from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import { SendHorizonal } from 'lucide-react';
import { Pencil, Trash2 } from 'lucide-react';
import ConfirmExitDialog from './ConfirmExitDialog';

export default function FIORAFAQ() {
  const [expanded, setExpanded] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const toggleExpanded = () => setExpanded(!expanded);
  const handleFeedback = (type) => setFeedback(type);
  const [showConfirm, setShowConfirm] = useState(false);

  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const toggleMenu = (index: number) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };
  return (
    <section className="max-w-4xl mx-auto px-4 py-10 text-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Is FIORA a bank?</h1>
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-100 transition">
            <Pencil className="w-5 h-5 text-gray-700" />
          </button>
          <button className="w-9 h-9 flex items-center justify-center rounded-md border border-gray-300 hover:bg-red-100 transition">
            <Trash2 className="w-5 h-5 text-red-500" />
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-2">Posted by Admin FIORA</p>
      <p className="text-sm text-gray-400 mb-4">Updated over 7 months ago</p>
      <p className="mb-4">
        No, FIORA is not a bank, either in Singapore or in any other country where it currently
        operates. FIORA is a Payment Services Institution, providing financial services to customers
        subject to the relevant laws and regulations of the jurisdictions where it operates.
      </p>
      <div className="mb-6">
        <div className="mb-6">
          <video
            controls
            width={800}
            height={400}
            className="rounded-lg w-full"
            poster="/images/faqdwtail1.png"
          >
            <source src="/videos/faqdwtail1.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
      <p className="mb-4">
        As a payment institution, FIORA can accept, hold and move client funds for the purposes of
        providing payment services. FIORA holds all client funds in segregated accounts with tier 1
        banks, such as DBS Singapore and DBS Hong Kong, and does not use any client funds to finance
        its operations.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col gap-4">
          <Image
            src="/images/faqdwtail2.png"
            alt="Traditional houses"
            width={600}
            height={300}
            className="rounded-lg w-full object-cover"
          />
          <Image
            src="/images/faqdwtail3.png"
            alt="Restaurant curtain"
            width={600}
            height={300}
            className="rounded-lg w-full object-cover"
          />
        </div>
        <Image
          src="/images/faqdwtail4.png"
          alt="Modern and traditional buildings"
          width={600}
          height={620}
          className="rounded-lg w-full h-full object-cover"
        />
      </div>
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
        <div className="flex justify-center gap-6 group" onMouseLeave={() => setFeedback(null)}>
          <button
            onMouseEnter={() => setFeedback('bad')}
            onClick={() => handleFeedback('bad')}
            className={`transition-transform duration-200 transform ${
              feedback === 'bad'
                ? 'scale-110 text-red-500'
                : feedback
                  ? 'grayscale opacity-60'
                  : 'text-yellow-400'
            }`}
          >
            <Frown size={40} />
          </button>
          <button
            onMouseEnter={() => setFeedback('neutral')}
            onClick={() => handleFeedback('neutral')}
            className={`transition-transform duration-200 transform ${
              feedback === 'neutral'
                ? 'scale-110 text-yellow-500'
                : feedback
                  ? 'grayscale opacity-60'
                  : 'text-yellow-400'
            }`}
          >
            <Meh size={40} />
          </button>
          <button
            onMouseEnter={() => setFeedback('good')}
            onClick={() => handleFeedback('good')}
            className={`transition-transform duration-200 transform ${
              feedback === 'good'
                ? 'scale-110 text-green-500'
                : feedback
                  ? 'grayscale opacity-60'
                  : 'text-yellow-400'
            }`}
          >
            <Smile size={40} />
          </button>
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
          />
          <button className="w-10 h-10 flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-100 transition">
            <SendHorizonal className="w-4 h-4 text-gray-700" />
          </button>
        </div>
        <p className="font-semibold mb-4">
          If you have any questions, please comment below and we will respond soon
        </p>
        <div className="flex items-start gap-3 mb-6 relative">
          <Image
            src="/images/userdetail.jpg"
            width={40}
            height={40}
            className="rounded-full"
            alt="User avatar"
          />
          <div className="flex-1">
            <p className="font-semibold">Vladimir Putin</p>
            <p className="text-xs text-gray-500 mb-1">1 minute ago</p>
            <p className="text-sm text-gray-700">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet,
              consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
              magna aliqua.
            </p>
            <div className="flex items-start gap-3 mt-4 pl-4 border-l-2 border-gray-200">
              <Image
                src="/images/admin-avatar.jpg"
                width={40}
                height={40}
                className="rounded-full"
                alt="Admin avatar"
              />
              <div>
                <p className="font-semibold text-blue-600">Admin Support</p>
                <p className="text-sm text-gray-700">
                  Thank you for your comment, <span className="text-blue-600">@Vladimir Putin</span>
                  . We appreciate your feedback and will get back to you shortly!
                </p>
                <p className="text-xs text-gray-400 mt-1">Replied by Admin · 2 minutes ago</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => toggleMenu(0)}
              className="text-gray-500 hover:text-black text-xl px-2"
            >
              ⋮
            </button>
            {openMenuIndex === 0 && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 shadow-md rounded-md z-10">
                <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                  Delete comment
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-start gap-3 mb-6 relative">
          <Image
            src="/images/userdetail2.jpg"
            width={40}
            height={40}
            className="rounded-full"
            alt="User avatar"
          />
          <div className="flex-1">
            <p className="font-semibold">Vladimir</p>
            <p className="text-xs text-gray-500 mb-1">April 1, 2025</p>
            <p className="text-sm text-gray-700">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
          <div className="relative">
            <button
              onClick={() => toggleMenu(1)}
              className="text-gray-500 hover:text-black text-xl px-2"
            >
              ⋮
            </button>
            {openMenuIndex === 1 && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 shadow-md rounded-md z-10">
                <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                  Delete comment
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-start gap-3 relative">
          <Image
            src="/images/userdetail3.jpg"
            width={40}
            height={40}
            className="rounded-full"
            alt="User avatar"
          />
          <div className="flex-1">
            <p className="font-semibold">Vladimir Hi</p>
            <p className="text-xs text-gray-500 mb-1">April 2, 2025</p>
            <p className="text-sm text-gray-700">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua.
            </p>
          </div>

          <div className="relative">
            <button
              onClick={() => toggleMenu(2)}
              className="text-gray-500 hover:text-black text-xl px-2"
            >
              ⋮
            </button>
            {openMenuIndex === 2 && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 shadow-md rounded-md z-10">
                <button
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  onClick={() => setShowConfirm(true)}
                >
                  Delete comment
                </button>
              </div>
            )}
            <ConfirmExitDialog
              open={showConfirm}
              onOpenChange={setShowConfirm}
              onConfirmExit={() => setShowConfirm(false)}
              onCancelExit={() => setShowConfirm(false)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
