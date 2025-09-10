'use client';

import { useState } from 'react';

export const useFileUpload = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileUpload = (file: File | null) => {
    setUploadedFile(file);
  };

  const resetFile = () => {
    setUploadedFile(null);
  };

  return {
    uploadedFile,
    handleFileUpload,
    resetFile,
  };
};
