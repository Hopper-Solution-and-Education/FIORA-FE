'use client';

import { Button } from '@/components/ui/button';
import { uploadToFirebaseWithProgress } from '@/shared/lib';
import { cn } from '@/shared/utils';
import { Download, Upload } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';
import { EmailEditorProps } from 'react-email-editor';
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
  minHeight = 'calc(100vh - 80px)',
  className,
  uploadBasePath = 'attachments/email-templates',
}) => {
  const emailEditorRef = useRef<any>(null);
  const [isReady, setIsReady] = useState<boolean>(false);

  const onReady: EmailEditorProps['onReady'] = (unlayer) => {
    console.log('✅ Email editor is ready', unlayer);
    setIsReady(true);

    // Store unlayer instance in ref for later use
    if (emailEditorRef.current) {
      emailEditorRef.current.editor = unlayer;
    }

    const design = initialDesign || getDefaultDesign();

    // Load initial design
    unlayer.loadDesign(design as any);
    onLoad?.(design);

    unlayer.addEventListener('imageUpload', (event: any) => {
      console.log('Image upload event:', event);
    });

    console.log('✅ Upload method set to custom');

    // Register image upload callback
    // The callback signature expects: (file, done)
    unlayer.registerCallback('image', (file: any, done: any) => {
      console.log('🖼️ Image callback triggered!', file);

      // Handle the file upload
      handleImageUpload(file, done);
    });

    console.log('✅ Image callback registered');
  };

  const handleImageUpload = async (file: any, done: any) => {
    try {
      console.log('📤 Starting upload...', file);

      // The file object structure from Unlayer
      const actualFile = file.attachments?.[0] || file;

      if (!actualFile) {
        console.error('❌ No file found in callback data');
        done({ progress: 0 });
        return;
      }

      console.log('📁 File to upload:', actualFile.name || actualFile);

      // Upload with progress
      const url = await uploadToFirebaseWithProgress({
        file: actualFile,
        path: uploadBasePath,
        onProgress: (progress) => {
          console.log(`📊 Upload progress: ${progress}%`);
          done({ progress });
        },
      });

      console.log('✅ Upload complete:', url);

      // Return the URL to Unlayer
      done({ progress: 100, url });
    } catch (error) {
      console.error('❌ Upload error:', error);
      done({ progress: 0 });
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
        <header className="pb-4 shadow-sm">
          <div className="flex items-center justify-between max-w-full mx-auto">
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
        <EmailEditor
          ref={emailEditorRef}
          onReady={onReady}
          minHeight={minHeight}
          options={{
            version: '1.157.0',
            appearance: {
              theme: 'modern_light',
            },
            features: {
              imageEditor: true,
            },
            customCSS: [],
            customJS: [],
          }}
        />
      </div>
    </div>
  );
};
