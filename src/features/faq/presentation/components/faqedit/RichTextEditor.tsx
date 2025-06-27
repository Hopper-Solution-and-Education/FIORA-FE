'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';

import Toolbar from './Toolbar';
import { useState } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [preview, setPreview] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      BulletList.configure({}),
      OrderedList.configure({}),
      ListItem.configure({}),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
      Link,
      Image,
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'min-h-[200px] px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 rounded-b bg-white border border-t-0',
      },
    },
  });

  return (
    <div className="border rounded">
      <div className="flex justify-between items-center border-b px-4 py-2 bg-muted">
        {editor && <Toolbar editor={editor} />}
        <button
          className="text-sm text-blue-600 hover:underline"
          onClick={() => setPreview(!preview)}
        >
          {preview ? 'Edit' : 'Preview'}
        </button>
      </div>
      {preview ? (
        <div className="p-4 prose max-w-none" dangerouslySetInnerHTML={{ __html: value }} />
      ) : (
        <EditorContent editor={editor} />
      )}
    </div>
  );
}
