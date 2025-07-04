'use client';

import { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Link from '@tiptap/extension-link';

import Toolbar from './Toolbar';
import ResizableImage from './ImageResizable';
import ResizableVideo from './ResizableVideo';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [preview, setPreview] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({}),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
      Link,
      ResizableImage,
      ResizableVideo,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'min-h-[200px] px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 rounded-b bg-white border border-t-0',
      },
      handlePaste(view, event) {
        const text = event.clipboardData?.getData('text/plain');
        if (text && (text.includes('youtube.com') || text.includes('vimeo.com'))) {
          let embedUrl = text;
          if (text.includes('watch?v=')) {
            embedUrl = text.replace('watch?v=', 'embed/');
          }
          view.dispatch(
            view.state.tr.replaceSelectionWith(
              view.state.schema.nodes.video.create({
                src: embedUrl,
                width: '560',
                height: '315',
              }),
            ),
          );
          return true;
        }
        return false;
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
        <div
          className="p-4 prose max-w-none"
          dangerouslySetInnerHTML={{ __html: editor?.getHTML() || '' }}
        />
      ) : (
        <EditorContent editor={editor} />
      )}
    </div>
  );
}
