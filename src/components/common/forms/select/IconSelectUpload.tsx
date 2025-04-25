import { FormItem, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { isImageFile, isUrl } from '@/shared/lib/utils';
import { memo, useCallback, useEffect, useState } from 'react';
import { FieldError, Noop } from 'react-hook-form';
import UploadField from '../upload/UploadField';
import IconSelect from './IconSelect';

interface IconSelectUploadProps {
  value?: string;
  onChange?: (value: string) => void;
  name: string;
  onBlur?: Noop;
  error?: FieldError;
  label?: string;
  placeholder?: string;
  accept?: string;
  id?: string;
  required?: boolean;
  previewShape?: 'square' | 'circle';
  initialImageUrl?: string | null;
  disabled?: boolean;
}

type IconFormType = 'dropdown' | 'uploader';

const IconSelectUpload = ({
  value,
  onChange,
  name,
  onBlur,
  error,
  label = 'Icon',
  required = false,
  disabled = false,
  previewShape = 'square',
}: IconSelectUploadProps) => {
  const [selectedTab, setSelectedTab] = useState<IconFormType>(
    value && (isUrl(value) || isImageFile(value)) ? 'uploader' : 'dropdown',
  );

  useEffect(() => {
    if (value) {
      setSelectedTab(isUrl(value) || isImageFile(value) ? 'uploader' : 'dropdown');
    } else {
      setSelectedTab('dropdown');
    }
  }, [value]);

  const handleOnTabChange = (newTab: string) => {
    const newTabType = newTab as IconFormType;
    setSelectedTab(newTabType);
  };

  return (
    <FormItem className="col-span-2">
      {label && (
        <label className="block text-sm font-medium mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <Tabs value={selectedTab} onValueChange={handleOnTabChange}>
        <TabsList>
          <TabsTrigger value="dropdown">Select Icon</TabsTrigger>
          <TabsTrigger value="uploader">Upload Icon</TabsTrigger>
        </TabsList>

        <TabsContent value="uploader">
          <UploadFieldAdapter
            value={
              selectedTab === 'uploader' && (isUrl(value ?? '') || isImageFile(value ?? ''))
                ? (value ?? '')
                : ''
            }
            onChange={(e) => {
              onChange?.(e);
            }}
            name={name}
            onBlur={onBlur}
            disabled={disabled}
            required={required}
            previewShape={previewShape}
          />
        </TabsContent>

        <TabsContent value="dropdown">
          <IconSelect
            isCheckError={!!error}
            selectedIcon={
              selectedTab === 'dropdown' && !(isUrl(value ?? '') || isImageFile(value ?? ''))
                ? (value ?? '')
                : ''
            }
            onIconChange={(value) => {
              onChange?.(value);
            }}
            required={required}
            disabled={disabled}
          />
        </TabsContent>
      </Tabs>

      {error && <FormMessage>{error.message}</FormMessage>}
    </FormItem>
  );
};

export default memo(IconSelectUpload);

interface UploadFieldAdapterProps {
  value: string;
  onChange: (url: string) => void;
  name: string;
  onBlur?: () => void;
  disabled?: boolean;
  required?: boolean;
  previewShape?: 'square' | 'circle';
}

const UploadFieldAdapter = ({
  value, // `value` có thể là URL hoặc là file
  onChange,
  name,
  onBlur,
  disabled,
  required,
  previewShape,
}: UploadFieldAdapterProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Đảm bảo onChange luôn ổn định
  const stableOnChange = useCallback(
    (url: string) => {
      onChange?.(url); // Truyền URL đến parent form
    },
    [onChange],
  );

  // Handle khi giá trị `value` thay đổi
  useEffect(() => {
    if (value && (isUrl(value) || isImageFile(value))) {
      // Nếu giá trị là URL hợp lệ, chỉ cần hiển thị
      setImageUrl(value);
      setFile(null); // Reset file khi có URL
    } else {
      setImageUrl(null); // Reset khi không có giá trị hợp lệ
    }
  }, [value]);

  useEffect(() => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    setImageUrl(url);
    stableOnChange(url);
  }, [file, stableOnChange]);

  return (
    <UploadField
      name={name}
      value={file}
      onChange={(newFile) => {
        setFile(newFile);
      }}
      onBlur={onBlur}
      disabled={disabled}
      required={required}
      previewShape={previewShape}
      initialImageUrl={imageUrl}
    />
  );
};
