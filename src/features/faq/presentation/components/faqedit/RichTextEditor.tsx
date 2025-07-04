'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Toolbar from './Toolbar';
import { useRef } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onUploadSuccess?: (id: string) => void;
}

export default function RichTextEditor({ value, onChange, onUploadSuccess }: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/faqs/faqupload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (data?.data?.[0]?.url && data?.data?.[0]?.id) {
      editor?.chain().focus().setImage({ src: data.data[0].url }).run();

      if (onUploadSuccess) onUploadSuccess(data.data[0].id);
    }
  };

  function CustomToolbar({ editor }: { editor: any }) {
    return (
      <div className="flex gap-2 border-b p-2 bg-gray-50">
        <Toolbar editor={editor} />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-2 py-1 border rounded text-xs bg-white hover:bg-gray-100"
        >
          Upload Image
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={async (e) => {
            if (e.target.files && e.target.files[0]) {
              await handleImageUpload(e.target.files[0]);
              e.target.value = '';
            }
          }}
        />
      </div>
    );
  }

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      BulletList,
      OrderedList,
      ListItem,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
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
      {editor && <CustomToolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
}
