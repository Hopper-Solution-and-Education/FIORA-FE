'use client';

import { useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import { useDropzone } from 'react-dropzone';

import Toolbar from './Toolbar';
import ResizableImage from './ImageResizable';
import ResizableVideo from './ResizableVideo';
import FontSize from './FontSize';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
      }),
      BulletList.configure({
        keepMarks: true,
        keepAttributes: false,
      }),
      OrderedList.configure({
        keepMarks: true,
        keepAttributes: false,
      }),
      ListItem,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
      FontSize,
      // Link,
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

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        if (!editor) return;

        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = () => {
            editor
              .chain()
              .focus()
              .setImage({
                src: reader.result as string,
              })
              .run();
          };
          reader.readAsDataURL(file);
        } else {
          alert(`Unsupported file type: ${file.type}`);
        }
      });
    },
    [editor],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
    },
    noClick: true,
  });

  const handleIndent = () => {
    if (editor) {
      if (!editor.isActive('bulletList') && !editor.isActive('orderedList')) {
        editor.chain().focus().toggleBulletList().run();
      }
      editor.chain().focus().sinkListItem('listItem').run();
    }
  };

  const handleOutdent = () => {
    if (editor) {
      editor.chain().focus().liftListItem('listItem').run();
    }
  };

  return (
    <div className="border rounded">
      <div className="sticky top-0 z-10 flex justify-between items-center border-b px-4 py-2 bg-white">
        <div className="flex items-center gap-2">
          {editor && <Toolbar editor={editor} />}
          <div className="flex gap-1">
            <button
              type="button"
              onClick={handleOutdent}
              className="border rounded p-1 bg-gray-100 hover:bg-gray-200 text-xs"
            >
              ⬅
            </button>
            <button
              type="button"
              onClick={handleIndent}
              className="border rounded p-1 bg-gray-100 hover:bg-gray-200 text-xs"
            >
              ➡
            </button>
          </div>
        </div>
        {/* <button
          className="text-sm text-blue-600 hover:underline"
          onClick={() => setPreview(!preview)}
        >
          {preview ? 'Edit' : 'Preview'}
        </button> */}
      </div>

      {preview ? (
        <div
          className="p-4 prose max-w-none border rounded overflow-auto min-h-[200px] max-h-[600px]"
          dangerouslySetInnerHTML={{ __html: editor?.getHTML() || '' }}
        />
      ) : (
        <div className="w-full overflow-x-auto">
          <div
            {...getRootProps()}
            className="relative border border-dashed rounded p-2 min-h-[600px] max-h-[1000px] overflow-auto"
          >
            <input {...getInputProps()} />
            {isDragActive && (
              <div className="absolute inset-0 bg-blue-100 bg-opacity-50 flex items-center justify-center pointer-events-none">
                <p className="text-blue-600 text-lg">Thả ảnh vào đây...</p>
              </div>
            )}
            <div className="min-w-[1200px]">
              {' '}
              {/* Cho rộng hơn khung để tạo thanh cuộn ngang */}
              <EditorContent editor={editor} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
