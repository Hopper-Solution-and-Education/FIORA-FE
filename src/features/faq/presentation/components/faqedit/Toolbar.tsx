'use client';

import { useRef, useState } from 'react';
import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,


  VideoIcon,

  ChevronDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ToolbarProps {
  editor: Editor;
}

export default function Toolbar({ editor }: ToolbarProps) {

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedColor, setSelectedColor] = useState('#000000');

  // Label & icon động cho căn lề

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedColor, setSelectedColor] = useState('#000000');


  const getCurrentAlignment = () => {
    if (editor.isActive({ textAlign: 'left' }))
      return (
        <span className="flex items-center gap-1">
          <AlignLeft size={16} /> Left
        </span>
      );
    if (editor.isActive({ textAlign: 'center' }))
      return (
        <span className="flex items-center gap-1">
          <AlignCenter size={16} /> Center
        </span>
      );
    if (editor.isActive({ textAlign: 'right' }))
      return (
        <span className="flex items-center gap-1">
          <AlignRight size={16} /> Right
        </span>
      );
    return (
      <span className="flex items-center gap-1">
        <AlignLeft size={16} /> Align
      </span>
    );
  };

  const insertLink = () => {
    const url = window.prompt('Enter URL');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };


  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;


  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      editor.chain().focus().setImage({ src: base64 }).run();
    };
    reader.readAsDataURL(file);
  };



  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Tạo URL tạm thời từ file (blob URL)
    const url = URL.createObjectURL(file);

    // Chèn video vào editor
    editor
      .chain()
      .focus()
      .insertContent({
        type: 'video',
        attrs: {
          src: url,
          width: '560',
          height: '315',
        },
      })
      .run();
  };


  const activeBtn = 'bg-blue-100 text-blue-700 border border-blue-500 shadow-sm';
  const normalBtn = 'bg-transparent text-black hover:bg-blue-50 border border-transparent';

  return (
    <div className="flex flex-wrap items-center gap-2 px-4 py-2 border-b border-border bg-muted rounded-t">

      {/* Hidden image input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Heading dropdown */}

      {/* Hidden inputs */}
      <input
        type="file"
        accept="image/*"
        ref={imageInputRef}
        onChange={handleImageUpload}
        className="hidden"
      />
      <input
        type="file"
        accept="video/*"
        ref={videoInputRef}
        onChange={handleVideoUpload}
        className="hidden"
      />

      {/* Heading */}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 w-[130px] justify-between"
          >
            {editor.isActive('heading', { level: 1 })
              ? 'Heading 1'
              : editor.isActive('heading', { level: 2 })
                ? 'Heading 2'
                : 'Normal text'}
            <ChevronDown size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => editor.chain().focus().setParagraph().run()}>
            Normal text
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          >
            Heading 1
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            Heading 2
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Formatting */}
      <Toggle
        pressed={editor.isActive('bold')}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
        className={
          (editor.isActive('bold') ? activeBtn : normalBtn) +
          ' w-9 h-9 flex items-center justify-center rounded'
        }
      >
        <Bold size={18} />
      </Toggle>
      <Toggle
        pressed={editor.isActive('italic')}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        className={
          (editor.isActive('italic') ? activeBtn : normalBtn) +
          ' w-9 h-9 flex items-center justify-center rounded'
        }
      >
        <Italic size={18} />
      </Toggle>
      <Toggle
        pressed={editor.isActive('underline')}
        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
        className={
          (editor.isActive('underline') ? activeBtn : normalBtn) +
          ' w-9 h-9 flex items-center justify-center rounded'
        }
      >
        <Underline size={18} />
      </Toggle>
      <Toggle
        pressed={editor.isActive('strike')}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        className={
          (editor.isActive('strike') ? activeBtn : normalBtn) +
          ' w-9 h-9 flex items-center justify-center rounded'
        }
      >
        <Strikethrough size={18} />
      </Toggle>


      {/* Quote, code block */}

      {/* Quote, code */}

      <Toggle
        pressed={editor.isActive('blockquote')}
        onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
        className={
          (editor.isActive('blockquote') ? activeBtn : normalBtn) +
          ' w-9 h-9 flex items-center justify-center rounded'
        }
      >
        <Quote size={18} />
      </Toggle>
      <Toggle
        pressed={editor.isActive('codeBlock')}
        onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
        className={
          (editor.isActive('codeBlock') ? activeBtn : normalBtn) +
          ' w-9 h-9 flex items-center justify-center rounded'
        }
      >
        <Code size={18} />
      </Toggle>

      {/* Lists */}
      <Toggle
        pressed={editor.isActive('bulletList')}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
        className={
          (editor.isActive('bulletList') ? activeBtn : normalBtn) +
          ' w-9 h-9 flex items-center justify-center rounded'
        }
      >
        <List size={18} />
      </Toggle>
      <Toggle
        pressed={editor.isActive('orderedList')}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
        className={
          (editor.isActive('orderedList') ? activeBtn : normalBtn) +
          ' w-9 h-9 flex items-center justify-center rounded'
        }
      >
        <ListOrdered size={18} />
      </Toggle>


      {/* Alignment dropdown */}

      {/* Align */}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 w-[110px] justify-between"
          >
            {getCurrentAlignment()}
            <ChevronDown size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => editor.chain().focus().setTextAlign('left').run()}>
            <AlignLeft size={16} className="mr-2" /> Left
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => editor.chain().focus().setTextAlign('center').run()}>
            <AlignCenter size={16} className="mr-2" /> Center
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => editor.chain().focus().setTextAlign('right').run()}>
            <AlignRight size={16} className="mr-2" /> Right
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>


      {/* Color dropdown */}

      {/* Color */}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 w-[60px] justify-between"
          >
            <div className="w-4 h-4 rounded-sm border" style={{ backgroundColor: selectedColor }} />
            <ChevronDown size={14} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="grid grid-cols-5 gap-1 p-2 w-40">
          {['#000000', '#EF4444', '#10B981', '#3B82F6', '#EAB308'].map((color) => (
            <button
              key={color}
              onClick={() => {
                editor.chain().focus().setColor(color).run();
                setSelectedColor(color);
              }}
              className="w-6 h-6 rounded-sm border"
              style={{ backgroundColor: color }}
            />
          ))}
        </DropdownMenuContent>
      </DropdownMenu>


      {/* Link / Image */}

      {/* Link, Image, Video */}

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={insertLink}
        className="w-9 h-9 flex items-center justify-center rounded"
      >
        <LinkIcon size={18} />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"

        onClick={() => fileInputRef.current?.click()}

        onClick={() => imageInputRef.current?.click()}

        className="w-9 h-9 flex items-center justify-center rounded"
      >
        <ImageIcon size={18} />
      </Button>


      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => videoInputRef.current?.click()}
        className="w-9 h-9 flex items-center justify-center rounded"
      >
        <VideoIcon size={18} />
      </Button>

    </div>
  );
}
