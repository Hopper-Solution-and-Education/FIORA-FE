import { Node, mergeAttributes } from '@tiptap/core';
import { NodeViewWrapper } from '@tiptap/react';
import { ReactNodeViewRenderer, NodeViewProps } from '@tiptap/react';

const ResizableVideoComponent = (props: NodeViewProps) => {
  const { node } = props; // Removed updateAttributes to avoid ESLint unused var

  return (
    <NodeViewWrapper className="relative inline-block">
      <iframe
        src={node.attrs.src}
        width={node.attrs.width || '560'}
        height={node.attrs.height || '315'}
        frameBorder="0"
        allowFullScreen
        className="block max-w-full"
      />
    </NodeViewWrapper>
  );
};

const ResizableVideo = Node.create({
  name: 'video',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      width: { default: '560' },
      height: { default: '315' },
    };
  },

  parseHTML() {
    return [{ tag: 'iframe[src]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'iframe',
      mergeAttributes(HTMLAttributes, { frameborder: '0', allowfullscreen: 'true' }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableVideoComponent);
  },
});

export default ResizableVideo;
