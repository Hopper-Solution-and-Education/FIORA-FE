'use client';

import dynamic from 'next/dynamic';
import QuillResizeImage from 'quill-resize-image';
import { useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import 'react-quill-new/dist/quill.snow.css';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

if (typeof window !== 'undefined') {
  import('react-quill-new').then(({ Quill }) => {
    Quill.register('modules/resize', QuillResizeImage);
  });
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  // Custom image handler for file uploads
  const handleImageUpload = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = () => {
      const file = input.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          // ReactQuill will handle the image insertion through its internal editor instance
          const quill = (window as any).Quill?.find(document.querySelector('.ql-editor'));
          if (quill) {
            const range = quill.getSelection();
            const index = range ? range.index : 0;
            quill.insertEmbed(index, 'image', reader.result, 'user');
            quill.setSelection(index + 1);
          }
        };
        reader.readAsDataURL(file);
      }
    };
  }, []);

  // Custom video handler for YouTube/Vimeo embeds
  const handleVideoUpload = useCallback(() => {
    const url = prompt('Enter video URL (YouTube or Vimeo):');
    if (url) {
      let embedUrl = url;

      // Convert YouTube watch URLs to embed URLs
      if (url.includes('youtube.com/watch?v=')) {
        const videoId = url.split('watch?v=')[1]?.split('&')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }
      // Convert Vimeo URLs to embed URLs
      else if (url.includes('vimeo.com/')) {
        const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
        embedUrl = `https://player.vimeo.com/video/${videoId}`;
      }

      // ReactQuill will handle the video insertion through its internal editor instance
      const quill = (window as any).Quill?.find(document.querySelector('.ql-editor'));
      if (quill) {
        const range = quill.getSelection();
        const index = range ? range.index : 0;

        // Insert video as iframe
        const videoEmbed = `<iframe width="560" height="315" src="${embedUrl}" frameborder="0" allowfullscreen></iframe>`;
        quill.clipboard.dangerouslyPasteHTML(index, videoEmbed);
        quill.setSelection(index + 1);
      }
    }
  }, []);

  // ReactQuill modules configuration
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ font: [] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ color: [] }, { background: [] }],
          [{ script: 'sub' }, { script: 'super' }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ indent: '-1' }, { indent: '+1' }],
          [{ direction: 'rtl' }],
          [{ align: [] }],
          ['blockquote', 'code-block'],
          ['link', 'image', 'video'],
        ],
        handlers: {
          image: handleImageUpload,
          video: handleVideoUpload,
        },
      },
      clipboard: {
        matchVisual: false,
      },
      resize: {
        locale: {},
        keepAspectRatio: false,
      },
    }),
    [handleImageUpload, handleVideoUpload],
  );

  // ReactQuill formats configuration
  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'color',
    'background',
    'script',
    'list',
    'bullet',
    'indent',
    'direction',
    'align',
    'blockquote',
    'code-block',
    'link',
    'image',
    'video',
  ];

  // Handle file drop - simplified for ReactQuill
  const handleFileUpload = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = () => {
            // For drag and drop, we'll add the image to the end of the content
            const imageHtml = `<img src="${reader.result}" alt="Uploaded image"  />`;
            onChange(value + imageHtml);
          };
          reader.readAsDataURL(file);
        } else {
          alert(`Unsupported file type: ${file.type}`);
        }
      });
    },
    [onChange, value],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileUpload,
    accept: {
      'image/*': [],
    },
    noClick: true,
  });

  return (
    <div className="border rounded h-full flex flex-col">
      {/* Editor Content with Drag & Drop */}
      <div className="flex-1 overflow-auto">
        <div {...getRootProps()} className="relative h-full">
          <input {...getInputProps()} />

          {/* Drag overlay */}
          {isDragActive && (
            <div className="absolute inset-0 bg-blue-100 bg-opacity-50 flex items-center justify-center pointer-events-none z-10">
              <p className="text-blue-600 text-lg font-medium">Drop images here...</p>
            </div>
          )}

          {/* ReactQuill Editor */}
          <ReactQuill
            theme="snow"
            value={value}
            onChange={(content) => {
              onChange(content);
            }}
            modules={modules}
            formats={formats}
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
}
