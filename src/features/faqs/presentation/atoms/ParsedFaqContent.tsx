'use client';

import parse, { domToReact, Element } from 'html-react-parser';
import Image from 'next/image';
import React from 'react';

interface ParsedFaqContentProps {
  htmlContent: string;
}

const ParsedFaqContent: React.FC<ParsedFaqContentProps> = ({ htmlContent }) => {
  // If no HTML tags are present, wrap with <p>
  if (!/<[a-z][\s\S]*>/i.test(htmlContent)) {
    htmlContent = `<p>${htmlContent}</p>`;
  }

  return (
    <div className="prose max-w-none">
      {parse(htmlContent, {
        replace: (domNode) => {
          if (domNode instanceof Element) {
            // Handle <video>
            if (domNode.name === 'video') {
              const sourceTag = domNode.children.find(
                (c) => c instanceof Element && c.name === 'source',
              ) as Element | undefined;

              const videoSrc = sourceTag?.attribs?.src;
              const poster = domNode.attribs.poster || '';

              if (!videoSrc) return null;

              return (
                <div className="mb-6">
                  <video
                    controls
                    poster={poster}
                    className="rounded-lg w-full"
                    width={800}
                    height={400}
                  >
                    <source src={videoSrc} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              );
            }

            // Handle <img>
            if (domNode.name === 'img') {
              const src = domNode.attribs.src;
              const alt = domNode.attribs.alt || '';

              if (!src || (!src.startsWith('/') && !src.startsWith('http'))) {
                return null;
              }

              return (
                <div className="mb-4">
                  <Image
                    src={src}
                    alt={alt}
                    width={600}
                    height={300}
                    className="rounded-lg w-full object-cover"
                    unoptimized
                  />
                </div>
              );
            }

            // Handle <p>
            if (domNode.name === 'p') {
              return <p className="mb-4">{domToReact(domNode.children as any)}</p>;
            }
          }
        },
      })}
    </div>
  );
};

export default ParsedFaqContent;
