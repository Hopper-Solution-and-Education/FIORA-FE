import { FormItem } from '@/components/ui/form';
import { isImageFile, isUrl } from '@/shared/lib/utils';
import { memo, useCallback, useEffect, useState } from 'react';
import UploadField from './UploadField';

interface UploadImageFieldProps {
  value?: string;
  onChange?: (url: string | null) => void;
  name: string;
  onBlur?: () => void;
  disabled?: boolean;
  required?: boolean;
  previewShape?: 'square' | 'circle';
  label?: string;
  placeholder?: string;
  size?: 'small' | 'medium' | 'large';
}

const UploadImageField = ({
  value,
  onChange,
  name,
  onBlur,
  disabled = false,
  required,
  previewShape = 'square',
  label = 'Upload Image',
  placeholder = 'Choose image',
  size = 'medium',
}: UploadImageFieldProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Đảm bảo onChange luôn ổn định
  const stableOnChange = useCallback(
    (url: string | null) => {
      onChange?.(url); // Truyền URL đến parent form
    },
    [onChange],
  );

  // Handle khi giá trị `value` thay đổi
  useEffect(() => {
    if (value && (isUrl(value) || isImageFile(value))) {
      setImageUrl(value);
      if (!value.startsWith('blob:')) {
        setFile(null);
      }
    } else {
      setImageUrl(null);
    }
  }, [value]);

  useEffect(() => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    setImageUrl(url);
    stableOnChange(url);
  }, [file, stableOnChange]);

  return (
    <FormItem>
      {label && (
        <label className="block text-sm font-medium mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <UploadField
        name={name}
        value={file}
        onChange={(newFile) => {
          setFile(newFile);
          if (!newFile) {
            setImageUrl(null);
            stableOnChange(null);
          }
        }}
        onBlur={onBlur}
        disabled={disabled}
        required={required}
        previewShape={previewShape}
        initialImageUrl={imageUrl}
        accept="image/*"
        placeholder={placeholder}
        size={size}
      />
    </FormItem>
  );
};

export default memo(UploadImageField);
