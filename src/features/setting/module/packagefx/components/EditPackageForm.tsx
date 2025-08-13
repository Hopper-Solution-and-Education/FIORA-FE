'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Check } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import useUpdatePackageFx from '../hooks/useUpdatePackageFx';

interface EditPackageFormProps {
  pkg: any;
  onCancel: () => void;
  onSubmit: (data: any) => void;
}

function truncateFileName(fileName?: string, maxLength = 18) {
  if (!fileName || typeof fileName !== 'string') return '';
  if (fileName.length <= maxLength) return fileName;
  const dotIndex = fileName.lastIndexOf('.');
  const nameWithoutExt = dotIndex > -1 ? fileName.slice(0, dotIndex) : fileName;
  const ext = dotIndex > -1 ? fileName.slice(dotIndex + 1) : '';
  if (!ext) return fileName.slice(0, maxLength - 3) + '...';
  if (ext.length > 5) return fileName.slice(0, 8) + '...';
  const available = maxLength - ext.length - 4;
  if (available <= 2) return nameWithoutExt.slice(0, 5) + '...' + '.' + ext.slice(0, 2);
  return nameWithoutExt.slice(0, available) + '...' + '.' + ext;
}

const EditPackageForm = ({ pkg, onCancel, onSubmit }: EditPackageFormProps) => {
  const methods = useForm({ defaultValues: { fxAmount: '' } });
  const { handleSubmit, reset, register } = methods;

  const [existingAttachments, setExistingAttachments] = useState<any[]>([]);
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);
  const { updatePackageFx, loading } = useUpdatePackageFx();
  const [removedAttachmentIds, setRemovedAttachmentIds] = useState<string[]>([]);

  useEffect(() => {
    if (pkg) {
      reset({ fxAmount: pkg.fxAmount?.toString() || '' });
      setExistingAttachments(Array.isArray(pkg.attachments) ? pkg.attachments : []);
      setAttachmentFiles([]);
    }
  }, [pkg, reset]);

  const onFormSubmit = async (data: any) => {
    const value = parseFloat(data.fxAmount);
    if (Number.isNaN(value) || value <= 0) {
      toast.error('FX Amount must be greater than 0');
      return;
    }
    try {
      await updatePackageFx({
        id: pkg.id,
        fxAmount: value,
        attachments: attachmentFiles,
        removeAttachmentIds: removedAttachmentIds.length > 0 ? removedAttachmentIds : undefined,
      }).unwrap();
      toast.success('Package updated successfully!');
      handleClose();
      if (typeof onSubmit === 'function') onSubmit(data);
    } catch (e: any) {
      if (
        e?.message?.includes('deposit request') ||
        e?.message?.includes('active deposit request') ||
        e?.message?.includes('PACKAGE_FX_HAS_ACTIVE_DEPOSIT_REQUEST')
      ) {
        toast.error('Cannot update package with active deposit request');
      } else {
        toast.error(e?.message || 'Failed to update package');
      }
    }
  };

  const handleRemoveExistingAttachment = (id: string) => {
    setExistingAttachments((prev) => prev.filter((att) => att.id !== id));
    setRemovedAttachmentIds((prev) => [...prev, id]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles: File[] = [];

    files.forEach((file) => {
      const isImage = /^image\/(jpeg|png|jpg|gif|webp|svg\+xml|bmp|ico|avif|jfif|tiff|apng)$/i.test(
        file.type,
      );
      const maxSize = 5 * 1024 * 1024;

      if (!isImage) {
        toast.error(`File "${file.name}" is not a supported image format`);
        return;
      }

      if (file.size > maxSize) {
        toast.error(`File "${file.name}" is too large. Max size is 5MB.`);
        return;
      }

      validFiles.push(file);
    });

    const shortFiles = validFiles.map((file) => {
      const shortName = truncateFileName(file.name, 100);
      return new File([file], shortName, { type: file.type });
    });

    setAttachmentFiles((prev) => [...prev, ...shortFiles]);
    e.target.value = '';
  };

  const removeFile = (index: number) =>
    setAttachmentFiles((prev) => prev.filter((_, i) => i !== index));

  const handleClose = () => {
    reset();
    setAttachmentFiles([]);
    setExistingAttachments([]);
    setRemovedAttachmentIds([]);
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-2xl border p-6 w-full max-w-md relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          onClick={handleClose}
          aria-label="Close"
        >
          ×
        </button>

        <h2 className="text-[22px] font-bold mb-3 text-center">Edit Package</h2>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fxAmount" className="text-[14px] font-medium">
                FX Amount <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fxAmount"
                {...register('fxAmount', { required: true, pattern: /^[0-9.]+$/ })}
                placeholder="0"
                className="w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>

            {existingAttachments.length > 0 && (
              <div className="flex gap-2 mb-4 flex-wrap">
                {existingAttachments.map((att, i) => (
                  <div key={att.id ?? i} className="relative group">
                    <Image
                      src={att.url || '/images/logo.jpg'}
                      alt="Attachment"
                      width={48}
                      height={48}
                      className="w-12 h-12 object-cover rounded border"
                      onError={(e) => {
                        e.currentTarget.src = '/images/logo.jpg';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingAttachment(att.id)}
                      className="absolute -top-1.5 -right-1.5 bg-white text-black border border-black shadow-md rounded p-0 flex items-center justify-center transition hover:bg-black hover:text-white hover:border-black"
                      style={{ width: 18, height: 18, minWidth: 18, minHeight: 18 }}
                      title="Remove"
                    >
                      <svg width="10" height="10" viewBox="0 0 20 20" fill="none">
                        <rect
                          x="2"
                          y="2"
                          width="16"
                          height="16"
                          rx="2"
                          fill="currentColor"
                          opacity="0.12"
                        />
                        <path
                          d="M7 7l6 6M13 7l-6 6"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-[14px] font-medium">Add more attachments</Label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-2 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold text-blue-600">Click to Upload</span>
                    </p>
                    <p className="text-xs text-gray-500">or drag and drop</p>
                    <p className="text-xs text-gray-500">(Max. File Size: 5 MB)</p>
                  </div>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
              {attachmentFiles.length > 0 && (
                <div className="mt-3 border rounded-lg bg-white">
                  <div className="divide-y divide-gray-100">
                    {attachmentFiles.map((file, index) => (
                      <div key={index} className="p-2 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 min-w-0 overflow-hidden flex items-center gap-3">
                            <Image
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              width={48}
                              height={48}
                              unoptimized
                              className="w-12 h-12 object-cover rounded border flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <p
                                className="text-sm font-medium text-gray-900 truncate leading-tight"
                                title={file.name}
                              >
                                {truncateFileName(file.name)}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {(file.size / 1024).toFixed(2)} KB
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-0.5 rounded transition-colors flex-shrink-0"
                              aria-label="Remove file"
                            >
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-1">
                            <div className="bg-green-500 h-1 rounded-full w-full"></div>
                          </div>
                          <span className="text-xs text-green-600 font-medium w-8 text-center flex-shrink-0">
                            100%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="min-w-[100px]"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center px-4 py-5 bg-blue-400 hover:bg-blue-500 text-white rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default EditPackageForm;
