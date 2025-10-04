'use client';

import { EmailDesign, EmailTemplateEditor } from '@/components/common/atoms/EmailTemplateEditor';
import { useState } from 'react';

export default function EmailTemplateEditorPage() {
  const [exportedHtml, setExportedHtml] = useState<string>('');
  const [exportedDesign, setExportedDesign] = useState<EmailDesign | null>(null);

  const handleExport = (html: string, design: EmailDesign): void => {
    setExportedHtml(html);
    setExportedDesign(design);
    console.log('Template exported successfully');
  };

  const handleLoad = (design: EmailDesign): void => {
    console.log('Template loaded:', design);
  };

  return (
    <div className="h-screen flex flex-col">
      <EmailTemplateEditor onExport={handleExport} onLoad={handleLoad} />

      {exportedHtml && (
        <div className="hidden">
          <p>HTML exported: {exportedHtml.length} characters</p>
          <p>Design exported: {exportedDesign ? 'Yes' : 'No'}</p>
        </div>
      )}
    </div>
  );
}
