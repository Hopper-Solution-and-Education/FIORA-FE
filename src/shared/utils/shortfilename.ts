export function shortenFileName(fileName: string, maxLength = 100) {
  if (fileName.length > maxLength) {
    const ext = fileName.includes('.') ? '.' + fileName.split('.').pop() : '';
    return fileName.slice(0, maxLength - ext.length) + ext;
  }
  return fileName;
}
