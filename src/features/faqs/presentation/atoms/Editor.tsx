'use client';

import RichTextEditor, { BaseKit } from 'reactjs-tiptap-editor';

import { uploadToFirebase } from '@/shared/lib';
import { Bold } from 'reactjs-tiptap-editor/bold';
import { BulletList } from 'reactjs-tiptap-editor/bulletlist';
import { Code } from 'reactjs-tiptap-editor/code';
import { CodeBlock } from 'reactjs-tiptap-editor/codeblock';
import { Color } from 'reactjs-tiptap-editor/color';
import { FontFamily } from 'reactjs-tiptap-editor/fontfamily';
import { FontSize } from 'reactjs-tiptap-editor/fontsize';
import { Heading } from 'reactjs-tiptap-editor/heading';
import { Highlight } from 'reactjs-tiptap-editor/highlight';
import { History } from 'reactjs-tiptap-editor/history';
import { HorizontalRule } from 'reactjs-tiptap-editor/horizontalrule';
import { Iframe } from 'reactjs-tiptap-editor/iframe';
import { Image } from 'reactjs-tiptap-editor/image';
import { Indent } from 'reactjs-tiptap-editor/indent';
import { Italic } from 'reactjs-tiptap-editor/italic';
import { LineHeight } from 'reactjs-tiptap-editor/lineheight';
import { Link } from 'reactjs-tiptap-editor/link';
import { MoreMark } from 'reactjs-tiptap-editor/moremark';
import { ColumnActionButton } from 'reactjs-tiptap-editor/multicolumn';
import { OrderedList } from 'reactjs-tiptap-editor/orderedlist';
import { Strike } from 'reactjs-tiptap-editor/strike';
import { Table } from 'reactjs-tiptap-editor/table';
import { TextAlign } from 'reactjs-tiptap-editor/textalign';
import { TextUnderline } from 'reactjs-tiptap-editor/textunderline';
import { Video } from 'reactjs-tiptap-editor/video';

import 'react-image-crop/dist/ReactCrop.css';
import 'reactjs-tiptap-editor/style.css';

const extensions = [
  BaseKit.configure({
    placeholder: false,
    characterCount: false,
  }),

  History,
  FontFamily,
  Heading.configure({ spacer: true }),
  FontSize,
  Bold,
  Italic,
  TextUnderline,
  Strike,
  MoreMark,
  Color.configure({ spacer: true }),
  Highlight,
  BulletList,
  OrderedList,
  TextAlign.configure({ types: ['heading', 'paragraph'], spacer: true }),
  Indent,
  LineHeight,
  Link,
  Image.configure({
    upload: async (files: File) => {
      if (files) {
        const url = await uploadToFirebase({ file: files, path: 'faqs' });
        return url;
      } else {
        return '';
      }
    },
    resourceImage: 'both',
  }),
  Video.configure({
    upload: (files: File) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(URL.createObjectURL(files));
        }, 500);
      });
    },
  }),
  HorizontalRule,
  Code.configure({
    toolbar: false,
  }),
  CodeBlock,
  ColumnActionButton,
  Table,
  Iframe,
];

function Editor({ content, setContent }: { content: string; setContent: (value: string) => void }) {
  return (
    <RichTextEditor
      output="html"
      content={content as any}
      onChangeContent={(value) => {
        setContent(value);
      }}
      extensions={extensions}
      dark={false}
      // hideBubble={true}
    />
  );
}

export default Editor;
