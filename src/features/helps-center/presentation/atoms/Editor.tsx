'use client';

import CommonEditor from '@/components/common/atoms/CommonEditor';
// import 'react-image-crop/dist/ReactCrop.css';
// import 'reactjs-tiptap-editor/style.css';

// const extensions = [
//   BaseKit.configure({
//     placeholder: false,
//     characterCount: false,
//   }),

//   History,
//   FontFamily,
//   Heading.configure({ spacer: true }),
//   FontSize,
//   Bold,
//   Italic,
//   TextUnderline,
//   Strike,
//   MoreMark,
//   Color.configure({ spacer: true }),
//   Highlight,
//   BulletList,
//   OrderedList,
//   TextAlign.configure({ types: ['heading', 'paragraph'], spacer: true }),
//   Indent,
//   LineHeight,
//   Link,
//   Image.configure({
//     upload: async (files: File) => {
//       if (files) {
//         const url = await uploadToFirebase({ file: files, path: 'faqs' });
//         return url;
//       } else {
//         return '';
//       }
//     },
//     resourceImage: 'both',
//   }),
//   Video.configure({
//     upload: (files: File) => {
//       return new Promise((resolve) => {
//         setTimeout(() => {
//           resolve(URL.createObjectURL(files));
//         }, 500);
//       });
//     },
//   }),
//   HorizontalRule,
//   Code.configure({
//     toolbar: false,
//   }),
//   CodeBlock,
//   ColumnActionButton,
//   Table,
//   Iframe,
// ];

function Editor({ content, setContent }: { content: string; setContent: (value: string) => void }) {
  return (
    // <RichTextEditor
    //   output="html"
    //   content={content as any}
    //   onChangeContent={setContent}
    //   extensions={extensions}
    //   dark={false}
    //   // hideBubble={true}
    // />
    <div>
      <CommonEditor content={content} output="html" onChangeContent={setContent} />
    </div>
  );
}

export default Editor;
