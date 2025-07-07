import { Node, mergeAttributes } from '@tiptap/core';
import { NodeViewWrapper } from '@tiptap/react';
import { ReactNodeViewRenderer, NodeViewProps } from '@tiptap/react';

const ResizableVideoComponent = (props: NodeViewProps) => {
  const { node, updateAttributes } = props;

  const handleMouseDown = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;

    const iframeElement = e.currentTarget.previousSibling as HTMLIFrameElement;
    const startWidth = iframeElement.offsetWidth;
    const startHeight = iframeElement.offsetHeight;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = startWidth + (moveEvent.clientX - startX);
      const newHeight = startHeight + (moveEvent.clientY - startY);

      updateAttributes({
        width: `${newWidth}px`,
        height: `${newHeight}px`,
      });
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

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
      <span
        onMouseDown={handleMouseDown}
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '10px',
          height: '10px',
          background: 'blue',
          cursor: 'nwse-resize',
        }}
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
      width: { default: '560px' },
      height: { default: '315px' },
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
