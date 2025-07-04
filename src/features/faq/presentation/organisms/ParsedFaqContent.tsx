'use client';

import parse, { domToReact, Element } from 'html-react-parser';
import Image from 'next/image';
import React from 'react';

interface Props {
  htmlContent: string;
}

const youtubeRegex =
  /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})(?:[&?][^\s<"]*)?/g;

const ParsedFaqContent: React.FC<Props> = ({ htmlContent }) => {
  let content = htmlContent;

  if (!/<[a-z][\s\S]*>/i.test(content)) {
    content = `<p>${content}</p>`;
  }

  content = content.replace(
    /<a [^>]*href=["']?(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})(?:[&?][^\s<"]*)?["']?[^>]*>(.*?)<\/a>/gi,
    (match, videoId) =>
      `<iframe width="100%" height="360" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen class="rounded-lg my-4"></iframe>`,
  );

  content = content.replace(
    youtubeRegex,
    (match, videoId) =>
      `<iframe width="100%" height="360" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen class="rounded-lg my-4"></iframe>`,
  );

  return (
    <div className="prose max-w-none">
      {parse(content, {
        replace: (domNode) => {
          if (domNode instanceof Element) {
            if (domNode.name === 'iframe') {
              return (
                <div className="mb-6">
                  <iframe
                    src={domNode.attribs.src}
                    width={domNode.attribs.width || '100%'}
                    height={domNode.attribs.height || '360'}
                    frameBorder={domNode.attribs.frameborder || 0}
                    allowFullScreen
                    className="rounded-lg w-full"
                  />
                </div>
              );
            }

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
