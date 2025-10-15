export function generateRefCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// utils function to format underline with space and capitalize first letter
export function formatUnderlineString(input: string): string {
  return input
    .split('_') // split by underscore
    .filter(Boolean) // remove empty parts (in case of double "__")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function shortenFileName(fileName: string, maxLength = 100) {
  if (fileName.length > maxLength) {
    const ext = fileName.includes('.') ? '.' + fileName.split('.').pop() : '';
    return fileName.slice(0, maxLength - ext.length) + ext;
  }
  return fileName;
}
