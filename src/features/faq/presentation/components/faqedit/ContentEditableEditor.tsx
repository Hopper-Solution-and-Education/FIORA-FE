'use client';

import { useRef, useEffect } from 'react';

interface ContentEditableEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function ContentEditableEditor({ content, onChange }: ContentEditableEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  const exec = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML && content) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  return (
    <div className="border rounded-md p-2 space-y-2">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b pb-2 mb-2 text-sm">
        <button type="button" onClick={() => exec('bold')}>
          <b>B</b>
        </button>
        <button type="button" onClick={() => exec('italic')}>
          <i>I</i>
        </button>
        <button type="button" onClick={() => exec('underline')}>
          U
        </button>
        <button type="button" onClick={() => exec('insertOrderedList')}>
          1.
        </button>
        <button type="button" onClick={() => exec('insertUnorderedList')}>
          •
        </button>
        <button type="button" onClick={() => exec('formatBlock', 'H1')}>
          H1
        </button>
        <button type="button" onClick={() => exec('formatBlock', 'H2')}>
          H2
        </button>
        <button type="button" onClick={() => exec('formatBlock', 'P')}>
          P
        </button>
        <button type="button" onClick={() => exec('createLink', prompt('Enter URL') || '')}>
          🔗
        </button>
        <button type="button" onClick={() => exec('insertImage', prompt('Image URL') || '')}>
          🖼
        </button>
      </div>

      {/* Editable Content */}
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[200px] p-2 border rounded bg-white prose max-w-full outline-none"
        onInput={handleInput}
        suppressContentEditableWarning
        spellCheck
      />
    </div>
  );
}
