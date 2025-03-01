'use client';

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import SecondaryIllustration from '@public/images/secondary-illustration.svg';
import type { StaticImageData } from 'next/image';
import Image from 'next/image';
import { useRef } from 'react';

interface ModalVideoProps {
  thumb: StaticImageData;
  thumbWidth: number;
  thumbHeight: number;
  thumbAlt: string;
  video: string;
  videoWidth: number;
  videoHeight: number;
}

export default function ModalVideo({
  thumb,
  thumbWidth,
  thumbHeight,
  thumbAlt,
  video,
  videoWidth,
  videoHeight,
}: ModalVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleOpen = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div className="relative">
      {/* Secondary illustration */}
      <div
        className="pointer-events-none absolute bottom-8 left-1/2 -z-10 -ml-28 -translate-x-1/2 translate-y-1/2"
        aria-hidden="true"
      >
        <Image
          className="md:max-w-none"
          src={SecondaryIllustration}
          width={1165}
          height={1012}
          alt="Secondary illustration"
        />
      </div>

      {/* Video thumbnail */}
      <Dialog onOpenChange={(isOpen) => (isOpen ? handleOpen() : handleClose())}>
        <DialogTrigger
          className="group relative flex items-center justify-center rounded-2xl focus:outline-none focus-visible:ring-3 focus-visible:ring-indigo-200"
          aria-label="Watch demo video"
        >
          <figure className="relative overflow-hidden rounded-2xl">
            <Image
              className="transition-opacity duration-300 group-hover:opacity-80"
              src={thumb}
              width={thumbWidth}
              height={thumbHeight}
              priority
              alt={thumbAlt}
            />
          </figure>
          {/* Play icon */}
          <span className="pointer-events-none absolute p-2.5">
            <span className="relative flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="none">
                <path
                  fill="url(#pla)"
                  fillRule="evenodd"
                  d="M10 20c5.523 0 10-4.477 10-10S15.523 0 10 0 0 4.477 0 10s4.477 10 10 10Zm3.5-10-5-3.5v7l5-3.5Z"
                  clipRule="evenodd"
                />
                <defs>
                  <linearGradient
                    id="pla"
                    x1={10}
                    x2={10}
                    y1={0}
                    y2={20}
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#6366F1" />
                    <stop offset={1} stopColor="#6366F1" stopOpacity=".72" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="text-sm font-medium leading-tight">
                Watch
                <span className="text-gray-600"> - </span>
                3:47
              </span>
            </span>
          </span>
        </DialogTrigger>

        <DialogContent className="max-w-6xl w-full bg-black shadow-2xl overflow-hidden rounded-2xl">
          <DialogTitle>VIDEO</DialogTitle>
          <video ref={videoRef} width={videoWidth} height={videoHeight} loop controls>
            <source src={video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </DialogContent>
      </Dialog>
    </div>
  );
}
