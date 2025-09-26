'use client';

import React, { useRef } from 'react';
import 'react-image-crop/dist/ReactCrop.css';
import 'reactjs-tiptap-editor/style.css';

interface ParsedNewsContentProps {
  htmlContent: string;
}

const ParsedNewsContent: React.FC<ParsedNewsContentProps> = ({ htmlContent }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // If no HTML tags are present, wrap with <div>
  const rawContent = !/<[a-z][\s\S]*>/i.test(htmlContent)
    ? `<div>${htmlContent}</div>`
    : htmlContent;

  return (
    <div className="reactjs-tiptap-editor">
      <div className="richtext-relative">
        <div
          ref={contentRef}
          className="tiptap ProseMirror parsed-content"
          style={{
            display: 'block',
            width: '100%',
            maxWidth: '100%',
            overflow: 'visible',
            flexDirection: 'column',
          }}
          dangerouslySetInnerHTML={{ __html: rawContent }}
        ></div>
      </div>
    </div>
  );
};

export default ParsedNewsContent;
