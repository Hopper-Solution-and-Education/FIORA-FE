'use client';

import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { shortenFileName } from '@/shared/utils/shortfilename';
import { yupResolver } from '@hookform/resolvers/yup';
import { ArrowLeft, Check, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import useCreatePackageFx from '../hooks/useCreatePackageFx';
import { createPackageSchema } from '../slices/utils/formSchema';

interface CreatePackageFormProps {
  open: boolean;
  onClose: () => void;
  onCreated?: (newPackage: any) => void;
}

const CreatePackageForm = ({ open, onClose, onCreated }: CreatePackageFormProps) => {
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);
  const { createPackageFx, loading, error } = useCreatePackageFx();
  const methods = useForm({
    resolver: yupResolver(createPackageSchema),
    defaultValues: {
      fxAmount: '',
    },
  });
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = methods;

  const onFormSubmit = async (formData: { fxAmount: string }) => {
    const fxAmountValue = formData.fxAmount;
    if (!fxAmountValue || parseFloat(fxAmountValue) <= 0) {
      toast.error('FX Amount must be greater than 0');
      return;
    }
    if (attachmentFiles.length === 0) {
      toast.error('Vui lòng chọn file đính kèm');
      return;
    }
    try {
      const newPackage = await createPackageFx({
        fxAmount: parseFloat(fxAmountValue),
        attachments: attachmentFiles,
      });
      toast.success('Package created successfully!');
      if (newPackage && onCreated) {
        onCreated(newPackage);
      }
      handleClose();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create package');
    }
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
      const shortName = shortenFileName(file.name, 100);
      return new File([file], shortName, { type: file.type });
    });

    setAttachmentFiles((prev) => [...prev, ...shortFiles]);
    e.target.value = '';
  };

  const removeFile = (index: number) => {
    setAttachmentFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const truncateFileName = (fileName: string) => {
    const maxLength = 18;
    if (fileName.length <= maxLength) return fileName;
    const extension = fileName.split('.').pop();
    const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
    if (!extension) return fileName.substring(0, maxLength - 3) + '...';
    if (extension.length > 5) return fileName.substring(0, 8) + '...';
    const availableLength = maxLength - extension.length - 4;
    if (availableLength <= 2)
      return fileName.substring(0, 5) + '...' + '.' + extension.substring(0, 2);
    return nameWithoutExt.substring(0, availableLength) + '...' + '.' + extension;
  };

  const handleClose = () => {
    reset();
    setAttachmentFiles([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => (!open ? handleClose() : undefined)}>
      <div className="fixed inset-0 bg-black bg-opacity-30 z-40" />
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl border p-6 w-full max-w-md relative">
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            onClick={handleClose}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-[22px] font-bold mb-3 text-center">Create New Package</h2>

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
                {errors.fxAmount && (
                  <span className="text-xs text-red-500">
                    FX Amount is required and must be a number
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-[14px] font-medium">
                  Attachments <span className="text-red-500">*</span>
                </Label>
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
                  <div className="mt-3 border rounded-lg bg-white max-h-40 overflow-y-auto">
                    <div className="divide-y divide-gray-100">
                      {attachmentFiles.map((file, index) => (
                        <div key={index} className="p-2 hover:bg-gray-50 transition-colors ">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 min-w-0 overflow-hidden flex items-center gap-3 ">
                              <Image
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                width={48}
                                height={48}
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
                  className="flex items-center justify-center px-4 py-5 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-md font-medium min-w-[100px]"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button
                  type="submit"
                  disabled={
                    loading ||
                    !watch('fxAmount') ||
                    parseFloat(watch('fxAmount')) <= 0 ||
                    attachmentFiles.length === 0
                  }
                  className="flex items-center justify-center px-4 py-5 bg-blue-400 hover:bg-blue-500 text-white rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
                >
                  <Check className="h-4 w-4" />
                </Button>
              </div>
              {error && <div className="text-xs text-red-500 mt-2 text-center">{error}</div>}
            </form>
          </FormProvider>
        </div>
      </div>
    </Dialog>
  );
};

export default CreatePackageForm;
