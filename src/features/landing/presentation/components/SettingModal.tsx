'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { useState } from 'react';

type SettingModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SettingModal({ isOpen, onClose }: SettingModalProps) {
  const [settings, setSettings] = useState({
    bannerUrl: '',
    logoUrl: '',
    previewImage: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onClose(); // Đóng modal sau khi lưu
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl mx-auto p-6">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            Settings
            <DialogClose asChild />
          </DialogTitle>
        </DialogHeader>

        {/* Content Layout */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left: Input fields */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Banner URL</label>
              <Input
                type="file"
                name="bannerUrl"
                value={settings.bannerUrl}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Logo URL</label>
              <Input
                type="file"
                name="logoUrl"
                value={settings.logoUrl}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                placeholder="Enter logo URL"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Upload Image</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const imageUrl = URL.createObjectURL(file);
                    setSettings({ ...settings, previewImage: imageUrl });
                  }
                }}
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>

          {/* Right: Image Preview */}
          <div className="flex items-center justify-center border rounded-md p-4">
            {settings.previewImage ? (
              <Image src={settings.previewImage} alt="Preview" className="max-h-48 rounded-md" />
            ) : (
              <p className="text-gray-500">No image selected</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end space-x-2">
          <DialogClose asChild>
            <button className="px-4 py-2 bg-gray-300 text-gray-900 rounded-md hover:bg-gray-400">
              Cancel
            </button>
          </DialogClose>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80"
          >
            Save
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
