interface MarkdownPreviewProps {
  content: string;
}

export default function MarkdownPreview({ content }: MarkdownPreviewProps) {
  return (
    <div
      className="prose max-w-full"
      dangerouslySetInnerHTML={{
        __html: content || '<p><i>Live preview will appear here...</i></p>',
      }}
    />
  );
}
