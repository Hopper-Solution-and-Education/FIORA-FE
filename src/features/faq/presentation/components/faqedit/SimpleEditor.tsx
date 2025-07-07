'use client';

import { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface SimpleEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SimpleEditor({ value, onChange }: SimpleEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const execCommand = (cmd: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(cmd);
    }
  };

  return (
    <div className="border rounded">
      <div className="flex gap-2 p-2 border-b bg-muted sticky top-0 z-10">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('outdent')}
          className="w-9 h-9 flex items-center justify-center rounded"
        >
          <ArrowLeft size={18} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('indent')}
          className="w-9 h-9 flex items-center justify-center rounded"
        >
          <ArrowRight size={18} />
        </Button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={() => onChange(editorRef.current?.innerHTML || '')}
        style={{
          minHeight: '400px',
          padding: '1rem',
          backgroundColor: 'white',
        }}
        className="focus:outline-none max-h-[600px] overflow-y-auto"
      ></div>
    </div>
  );
}
