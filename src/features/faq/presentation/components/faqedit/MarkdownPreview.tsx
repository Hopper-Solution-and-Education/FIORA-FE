interface MarkdownPreviewProps {
  content: string;
}

export default function MarkdownPreview({ content }: MarkdownPreviewProps) {
  // Tiền xử lý: Chèn <p>&nbsp;</p> giữa các đoạn nếu có chỗ trống
  // Hoặc thêm margin trực tiếp vào thẻ p
  const processedContent = (content || '<p><i>Live preview will appear here...</i></p>')
    // Chèn margin cho mỗi p
    .replace(/<p>/g, '<p style="margin: 0 0 1.5rem 0">');

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: processedContent,
      }}
    />
  );
}
