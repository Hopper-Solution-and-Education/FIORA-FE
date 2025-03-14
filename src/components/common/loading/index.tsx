'use client';
import React from 'react';

const Loading = () => {
  return (
    <div className="w-[70px] h-[70px] grid grid-cols-3 gap-[5px]">
      <span className="w-full h-full bg-[#a5a5b0] animate-[blink_0.6s_alternate_infinite_linear]"></span>
      <span className="w-full h-full bg-[#a5a5b0] animate-[blink_0.6s_alternate_infinite_linear] [animation-delay:200ms]"></span>
      <span className="w-full h-full bg-[#a5a5b0] animate-[blink_0.6s_alternate_infinite_linear] [animation-delay:300ms]"></span>
      <span className="w-full h-full bg-[#a5a5b0] animate-[blink_0.6s_alternate_infinite_linear] [animation-delay:400ms]"></span>
      <span className="w-full h-full bg-[#a5a5b0] animate-[blink_0.6s_alternate_infinite_linear] [animation-delay:500ms]"></span>
      <span className="w-full h-full bg-[#a5a5b0] animate-[blink_0.6s_alternate_infinite_linear] [animation-delay:600ms]"></span>

      <style jsx>{`
        @keyframes blink {
          0% {
            opacity: 0.3;
            transform: scale(0.5) rotate(5deg);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default Loading;
