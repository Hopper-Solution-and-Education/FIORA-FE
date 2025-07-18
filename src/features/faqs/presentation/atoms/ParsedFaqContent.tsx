'use client';

import React from 'react';
import 'react-quill-new/dist/quill.snow.css';

interface ParsedFaqContentProps {
  htmlContent: string;
}

const ParsedFaqContent: React.FC<ParsedFaqContentProps> = ({ htmlContent }) => {
  // If no HTML tags are present, wrap with <div>
  const rawContent = !/<[a-z][\s\S]*>/i.test(htmlContent)
    ? `<div>${htmlContent}</div>`
    : htmlContent;

  return (
    <div className="ql-container ql-snow !border-none">
      <div className="ql-editor" dangerouslySetInnerHTML={{ __html: rawContent }}></div>
    </div>
  );
};

export default ParsedFaqContent;
