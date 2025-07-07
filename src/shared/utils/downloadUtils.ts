/**
 * Download a blob as a file using native browser APIs
 * This replaces the need for the file-saver library
 */
export const downloadBlob = (blob: Blob, filename: string): void => {
  // Create a temporary URL for the blob
  const url = URL.createObjectURL(blob);

  // Create a temporary anchor element for download
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';

  // Append to body, click, and cleanup
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Release the blob URL to free memory
  URL.revokeObjectURL(url);
};

/**
 * Download text content as a file
 */
export const downloadTextFile = (
  content: string,
  filename: string,
  mimeType: string = 'text/plain',
): void => {
  const blob = new Blob([content], { type: mimeType });
  downloadBlob(blob, filename);
};

/**
 * Download JSON data as a file
 */
export const downloadJsonFile = (data: any, filename: string): void => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  downloadBlob(blob, filename);
};
