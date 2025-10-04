import { EmailDesign } from './types';

/**
 * Replace variables in HTML template with actual values
 * @param html - HTML string with variables in {{variable_name}} format
 * @param variables - Object with variable names as keys and replacement values
 * @returns HTML string with variables replaced
 */
export const replaceTemplateVariables = (
  html: string,
  variables: Record<string, string>,
): string => {
  let result = html;

  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, value);
  });

  return result;
};

/**
 * Extract variables from HTML template
 * @param html - HTML string with variables in {{variable_name}} format
 * @returns Array of variable names found in the template
 */
export const extractTemplateVariables = (html: string): string[] => {
  const regex = /{{(\w+)}}/g;
  const variables: string[] = [];
  let match;

  while ((match = regex.exec(html)) !== null) {
    if (!variables.includes(match[1])) {
      variables.push(match[1]);
    }
  }

  return variables;
};

/**
 * Validate email design structure
 * @param design - Email design object to validate
 * @returns true if valid, false otherwise
 */
export const validateEmailDesign = (design: unknown): design is EmailDesign => {
  if (!design || typeof design !== 'object') {
    return false;
  }

  const d = design as Partial<EmailDesign>;

  if (!d.body || typeof d.body !== 'object') {
    return false;
  }

  if (!Array.isArray(d.body.rows)) {
    return false;
  }

  return true;
};

/**
 * Convert email design to JSON string
 * @param design - Email design object
 * @returns JSON string representation
 */
export const serializeEmailDesign = (design: EmailDesign): string => {
  return JSON.stringify(design);
};

/**
 * Parse JSON string to email design object
 * @param json - JSON string representation of email design
 * @returns Email design object or null if invalid
 */
export const deserializeEmailDesign = (json: string): EmailDesign | null => {
  try {
    const parsed = JSON.parse(json);
    return validateEmailDesign(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

/**
 * Create a minimal email design from HTML content
 * @param html - HTML content to wrap in email design
 * @returns Email design object
 */
export const createDesignFromHtml = (html: string): EmailDesign => {
  return {
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
                    html,
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  };
};

/**
 * Extract HTML content from email design
 * @param design - Email design object
 * @returns HTML content string
 */
export const extractHtmlFromDesign = (design: EmailDesign): string => {
  const htmlParts: string[] = [];

  design.body.rows.forEach((row) => {
    row.columns.forEach((column) => {
      column.contents.forEach((content) => {
        if (content.type === 'html' && content.values.html) {
          htmlParts.push(content.values.html);
        }
      });
    });
  });

  return htmlParts.join('\n');
};

/**
 * Generate a full HTML document from template HTML
 * @param html - Template HTML content
 * @param title - Document title
 * @returns Complete HTML document string
 */
export const generateFullHtmlDocument = (
  html: string,
  title: string = 'Email Template',
): string => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body>
  ${html}
</body>
</html>`;
};

/**
 * Download HTML content as a file
 * @param html - HTML content to download
 * @param filename - Name of the file (without extension)
 */
export const downloadHtmlFile = (html: string, filename: string = 'email-template'): void => {
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}-${Date.now()}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Download design JSON as a file
 * @param design - Email design object
 * @param filename - Name of the file (without extension)
 */
export const downloadDesignFile = (
  design: EmailDesign,
  filename: string = 'email-design',
): void => {
  const json = serializeEmailDesign(design);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const getDefaultDesign = (): EmailDesign => {
  return {
    body: {
      rows: [
        {
          cells: [1],
          columns: [
            {
              contents: [],
            },
          ],
        },
      ],
    },
  };
};
