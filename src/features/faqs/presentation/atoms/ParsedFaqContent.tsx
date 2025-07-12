'use client';

import React from 'react';
import 'react-quill-new/dist/quill.snow.css';

interface ParsedFaqContentProps {
  htmlContent: string;
}

const ParsedFaqContent: React.FC<ParsedFaqContentProps> = ({ htmlContent }) => {
  // If no HTML tags are present, wrap with <p>
  const rawContent = !/<[a-z][\s\S]*>/i.test(htmlContent) ? `<p>${htmlContent}</p>` : htmlContent;

  return (
    <div
      className="parsed-faq-content prose prose-lg max-w-none 
        prose-headings:font-bold prose-headings:text-gray-900 prose-headings:mb-4 prose-headings:mt-6
        prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-h5:text-base prose-h6:text-sm
        prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
        prose-ul:my-4 prose-ul:pl-6 prose-ol:my-4 prose-ol:pl-6 prose-li:my-1
        prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 prose-blockquote:my-4
        prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono
        prose-pre:bg-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:text-sm prose-pre:font-mono prose-pre:my-4
        prose-img:rounded-lg prose-img:max-w-full prose-img:h-auto prose-img:mx-auto prose-img:my-4
        prose-a:text-blue-600 prose-a:hover:text-blue-800 prose-a:underline
        prose-strong:font-bold prose-em:italic prose-u:underline
        prose-table:border-collapse prose-table:border prose-table:border-gray-300 prose-table:my-4
        prose-th:border prose-th:border-gray-300 prose-th:bg-gray-50 prose-th:p-2 prose-th:font-semibold
        prose-td:border prose-td:border-gray-300 prose-td:p-2
        ql-editor"
      style={
        {
          // Handle ReactQuill-specific classes
          '--tw-prose-body': '#374151',
          '--tw-prose-headings': '#111827',
          '--tw-prose-links': '#2563eb',
          '--tw-prose-bold': '#111827',
          '--tw-prose-counters': '#6b7280',
          '--tw-prose-bullets': '#d1d5db',
          '--tw-prose-hr': '#d1d5db',
          '--tw-prose-quotes': '#111827',
          '--tw-prose-quote-borders': '#d1d5db',
          '--tw-prose-captions': '#374151',
          '--tw-prose-code': '#111827',
          '--tw-prose-pre-code': '#e5e7eb',
          '--tw-prose-pre-bg': '#111827',
          '--tw-prose-th-borders': '#d1d5db',
          '--tw-prose-td-borders': '#e5e7eb',
        } as React.CSSProperties
      }
      dangerouslySetInnerHTML={{ __html: rawContent }}
    />
  );
};

export default ParsedFaqContent;
