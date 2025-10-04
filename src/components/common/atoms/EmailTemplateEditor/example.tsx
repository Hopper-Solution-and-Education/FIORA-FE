'use client';

import { EmailTemplateEditor, EmailDesign } from './index';

/**
 * Example 1: Basic usage with default settings
 */
export function BasicEmailEditor() {
  return <EmailTemplateEditor />;
}

/**
 * Example 2: Custom export handler
 */
export function EmailEditorWithCustomExport() {
  const handleExport = (html: string, design: EmailDesign): void => {
    console.log('Exported HTML:', html);
    console.log('Design JSON:', design);

    // Example: Send to backend API
    // fetch('/api/email-templates', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ html, design }),
    // });
  };

  return <EmailTemplateEditor onExport={handleExport} />;
}

/**
 * Example 3: Without header (embedded in another component)
 */
export function EmbeddedEmailEditor() {
  return (
    <div className="h-[600px]">
      <EmailTemplateEditor showHeader={false} minHeight="600px" />
    </div>
  );
}

/**
 * Example 4: Custom header text
 */
export function CustomHeaderEmailEditor() {
  return (
    <EmailTemplateEditor
      headerTitle="Marketing Email Builder"
      headerDescription="Design beautiful marketing emails for your campaigns"
    />
  );
}

/**
 * Example 5: With load callback
 */
export function EmailEditorWithLoadCallback() {
  const handleLoad = (design: EmailDesign): void => {
    console.log('Template loaded successfully:', design);
  };

  return <EmailTemplateEditor onLoad={handleLoad} />;
}

/**
 * Example 6: Complete custom implementation
 */
export function FullyCustomEmailEditor() {
  const handleExport = (html: string, design: EmailDesign): void => {
    // Custom export logic
    const timestamp = new Date().toISOString();
    console.log(`Template exported at ${timestamp}`);

    // Save to localStorage as example
    localStorage.setItem('email-template', html);
    localStorage.setItem('email-design', JSON.stringify(design));

    alert('Template saved successfully!');
  };

  const handleLoad = (design: EmailDesign): void => {
    console.log('Editor ready with design:', design);
  };

  return (
    <EmailTemplateEditor
      onExport={handleExport}
      onLoad={handleLoad}
      headerTitle="FIORA Email Template Manager"
      headerDescription="Create professional email templates for your notifications"
      className="border rounded-lg shadow-lg"
    />
  );
}
