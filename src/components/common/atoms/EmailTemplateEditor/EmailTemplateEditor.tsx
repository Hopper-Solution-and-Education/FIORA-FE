'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/shared/utils';
import { Download, Upload } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';
import { EmailDesign, EmailTemplateEditorProps, ExportHtmlData } from './types';
import { getDefaultDesign } from './utils';

const EmailEditor = dynamic(() => import('react-email-editor').then((mod) => mod.EmailEditor), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen bg-muted/30">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading Email Editor...</p>
      </div>
    </div>
  ),
});

export const EmailTemplateEditor: React.FC<EmailTemplateEditorProps> = ({
  onExport,
  onLoad,
  initialDesign,
  showHeader = true,
  headerTitle = 'Email Template Editor',
  headerDescription = 'Create and customize email templates with a professional drag-and-drop editor',
  minHeight = 'calc(100vh - 80px)',
  className,
}) => {
  const emailEditorRef = useRef<any>(null);
  const [isReady, setIsReady] = useState<boolean>(false);

  const onReady = (): void => {
    setIsReady(true);
    const design = initialDesign || getDefaultDesign();

    if (emailEditorRef.current?.editor) {
      emailEditorRef.current.editor.loadDesign(design);
      onLoad?.(design);
    }
  };

  const handleExportHTML = (): void => {
    if (emailEditorRef.current?.editor) {
      emailEditorRef.current.editor.exportHtml((data: ExportHtmlData) => {
        const { html, design } = data;
        const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Template</title>
</head>
<body>
  ${html}
</body>
</html>`;

        if (onExport) {
          onExport(fullHTML, design);
        } else {
          const blob = new Blob([fullHTML], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `email-template-${Date.now()}.html`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      });
    }
  };

  const handleImportHTML = (): void => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.html';
    input.onchange = (e: Event): void => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event: ProgressEvent<FileReader>): void => {
          const content = event.target?.result as string;

          if (emailEditorRef.current?.editor) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(content, 'text/html');
            const bodyContent = doc.body.innerHTML || content;

            const design: EmailDesign = {
              body: {
                rows: [
                  {
                    cells: [1],
                    columns: [
                      {
                        contents: [
                          {
                            type: 'html',
                            values: {
                              html: bodyContent,
                            },
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            };
            emailEditorRef.current.editor.loadDesign(design);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className={cn('flex flex-col h-screen bg-background', className)}>
      {showHeader && (
        <header className="border-b bg-card px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between max-w-full mx-auto">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">{headerTitle}</h1>
              <p className="text-sm text-muted-foreground mt-1">{headerDescription}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleImportHTML} disabled={!isReady}>
                <Upload className="w-4 h-4 mr-2" />
                Import HTML
              </Button>
              <Button size="sm" onClick={handleExportHTML} disabled={!isReady}>
                <Download className="w-4 h-4 mr-2" />
                Export HTML
              </Button>
            </div>
          </div>
        </header>
      )}

      <div className="flex-1 overflow-hidden">
        <EmailEditor ref={emailEditorRef} onReady={onReady} minHeight={minHeight} />
      </div>
    </div>
  );
};
