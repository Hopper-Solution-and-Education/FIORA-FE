import { NodeViewWrapper } from '@tiptap/react';
import Image from '@tiptap/extension-image';
import { ReactNodeViewRenderer, NodeViewProps } from '@tiptap/react';

const ResizableImageComponent = (props: NodeViewProps) => {
  const { node, updateAttributes } = props;

  const handleMouseDown = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;

    const imgElement = e.currentTarget.previousSibling as HTMLImageElement;
    const startWidth = imgElement.offsetWidth;
    const startHeight = imgElement.offsetHeight;

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
    <NodeViewWrapper as="span" className="inline-block relative">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={node.attrs.src}
        alt={node.attrs.alt}
        title={node.attrs.title}
        style={{
          width: node.attrs.width || 'auto',
          height: node.attrs.height || 'auto',
          maxWidth: '100%',
          display: 'block',
        }}
        contentEditable={false}
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

const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: { default: 'auto' },
      height: { default: 'auto' },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageComponent);
  },
});

export default ResizableImage;
