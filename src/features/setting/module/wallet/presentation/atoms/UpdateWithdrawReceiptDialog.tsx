import { LoadingIndicator } from '@/components/common/atoms';
import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { useRef, useState } from 'react';

interface UpdateWithdrawReceiptDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (file: File) => void;
  isUpdating: boolean;
  currentImageUrl?: string;
  requestCode: string;
}

const UpdateWithdrawReceiptDialog = ({
  open,
  onClose,
  onConfirm,
  isUpdating,
  currentImageUrl,
  requestCode,
}: UpdateWithdrawReceiptDialogProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = () => {
    if (selectedFile) {
      onConfirm(selectedFile);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    onClose();
  };

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl p-6 rounded-2xl bg-white dark:bg-muted shadow-lg">
        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
              <Icons.upload className="text-orange-600 dark:text-orange-400 w-6 h-6" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold text-foreground">
                Update Withdraw Receipt
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Request Code: <span className="font-medium text-blue-600">{requestCode}</span>
              </DialogDescription>
            </div>
          </div>

          <div className="space-y-4 mt-2">
            {currentImageUrl && !previewUrl && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Current Receipt</Label>
                <div className="relative w-full h-64 border rounded-lg overflow-hidden bg-muted/50">
                  <Image
                    src={currentImageUrl}
                    alt="Current receipt"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="receipt" className="text-sm font-medium">
                {currentImageUrl ? 'New Receipt Image' : 'Upload Receipt Image'}
              </Label>
              <div
                onClick={handleBrowse}
                className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-accent/50 transition-colors"
              >
                {previewUrl ? (
                  <div className="space-y-4">
                    <div className="relative w-full h-64 mx-auto">
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        fill
                        className="object-contain rounded-lg"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedFile?.name}
                      <span className="ml-2">({(selectedFile!.size / 1024).toFixed(2)} KB)</span>
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBrowse();
                      }}
                    >
                      Change Image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                      <Icons.upload className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Click to upload</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG or JPEG (max. 5MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <Input
                ref={fileInputRef}
                id="receipt"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          <div className="rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <Icons.info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="text-xs text-blue-900 dark:text-blue-100">
                <p className="font-medium mb-1">Important:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200">
                  <li>Upload clear photo of withdraw receipt</li>
                  <li>Make sure all transaction details are visible</li>
                  <li>Supported formats: PNG, JPG, JPEG</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-row gap-3 mt-6">
          <Button
            variant="outline"
            onClick={handleClose}
            type="button"
            className="flex-1 h-12 border-border hover:bg-accent hover:text-accent-foreground"
            size="lg"
            disabled={isUpdating}
          >
            <Icons.close className="w-5 h-5 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedFile || isUpdating}
            type="button"
            className="flex-1 flex justify-center h-12 bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-medium transition-colors"
            size="lg"
          >
            {isUpdating ? <LoadingIndicator /> : <Icons.upload className="w-5 h-5 mr-2" />}
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateWithdrawReceiptDialog;
