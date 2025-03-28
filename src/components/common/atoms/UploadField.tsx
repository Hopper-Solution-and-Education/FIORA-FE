import React from 'react';
import { FieldError } from 'react-hook-form';

interface UploadFieldProps {
  onChange?: (file: File | null) => void;
  error?: FieldError;
  label?: string;
}

const UploadField: React.FC<UploadFieldProps> = ({ onChange = () => {}, error, label }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    onChange(file);
  };

  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <input
        type="file"
        onChange={handleFileChange}
        className={`mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${error ? 'border-red-500' : ''}`}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
  );
};

export default UploadField;
