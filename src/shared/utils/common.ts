import { SUPPORTED_IMAGE_TYPES } from '../constants';

export function sanitizeDateFilters(filters: any) {
  const cloned = { ...filters };

  if (cloned.dob) {
    const dob = { ...cloned.dob };

    if (dob.gte && typeof dob.gte === 'string') {
      dob.gte = new Date(dob.gte);
    }

    if (dob.lte && typeof dob.lte === 'string') {
      dob.lte = new Date(dob.lte);
    }

    cloned.dob = dob;
  }

  return cloned;
}

export function generateSixDigitNumber() {
  return Math.floor(100000 + Math.random() * 900000);
}

// ATTACHMENT
export const isPDF = (attachment: { type?: string; path?: string }) => {
  if (attachment.type === 'application/pdf') return true;
  if (attachment.path) {
    const ext = attachment.path.split('.').pop()?.toLowerCase();
    return ext === 'pdf';
  }
  return false;
};

export const isImage = (
  attachment: { type?: string; path?: string },
  supportedImageTypes?: string[],
) => {
  const _supportedImageTypes = supportedImageTypes || SUPPORTED_IMAGE_TYPES;
  if (attachment.type && attachment.type.startsWith('image/')) {
    const ext = attachment.type.split('/').pop()?.toLowerCase();
    return !!ext && _supportedImageTypes.includes(ext);
  }

  if (attachment.path) {
    const ext = attachment.path.split('.').pop()?.toLowerCase();
    return !!ext && _supportedImageTypes.includes(ext);
  }
  return false;
};

export const getFileName = (path: string) => {
  if (!path) return '';
  const parts = path.split('/');
  return parts[parts.length - 1];
};

export const formatFileSize = (size: string) => {
  const bytes = parseInt(size);
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
