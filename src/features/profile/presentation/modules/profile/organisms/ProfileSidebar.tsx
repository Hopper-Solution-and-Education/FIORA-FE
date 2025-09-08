'use client';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { toast } from 'sonner';

type Props = {
  initialImages: {
    avatarUrl: string;
    logoUrl: string;
  };
  setNewImages: Dispatch<SetStateAction<NewImages>>;
  disabled?: boolean;
  setIsImageUpdated: Dispatch<SetStateAction<boolean>>;
};

type NewImages = {
  avatarImage: File | null;
  logoImage: File | null;
};

export default function ProfileSidebar({
  initialImages,
  setNewImages,
  disabled = false,
  setIsImageUpdated,
}: Props) {
  const [currentImages, setCurrentImages] = useState(initialImages);

  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const logoInputRef = useRef<HTMLInputElement | null>(null);

  const acceptedTypes = useMemo(() => ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'], []);
  const maxFileSizeBytes = 5 * 1024 * 1024; // 5MB

  const validateImageFile = useCallback(
    (file: File): string | null => {
      if (!acceptedTypes.includes(file.type)) {
        return 'Please upload a PNG, JPG, or WEBP image.';
      }
      if (file.size > maxFileSizeBytes) {
        return 'File is too large. Max size is 5MB.';
      }
      return null;
    },
    [acceptedTypes],
  );

  const handleChoose = useCallback((type: 'avatar' | 'logo') => {
    if (type === 'avatar') {
      avatarInputRef.current?.click();
      return;
    }
    logoInputRef.current?.click();
  }, []);

  useEffect(() => {
    setCurrentImages((prev) => ({
      ...prev,
      avatarUrl: initialImages.avatarUrl,
      logoUrl: initialImages.logoUrl,
    }));
  }, [initialImages.avatarUrl, initialImages.logoUrl]);

  const handleFileChange = useCallback(
    (kind: 'avatar' | 'logo') => async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const error = validateImageFile(file);
      if (error) {
        toast.error('Invalid image', { description: error });
        e.target.value = '';
        return;
      }
      const localUrl = URL.createObjectURL(file);
      if (kind === 'avatar') {
        setCurrentImages((prev) => {
          if (prev.avatarUrl?.startsWith('blob:')) URL.revokeObjectURL(prev.avatarUrl);
          return { ...prev, avatarUrl: localUrl };
        });
        setNewImages((prev) => ({ ...prev, avatarImage: file }));
      } else {
        setCurrentImages((prev) => {
          if (prev.logoUrl?.startsWith('blob:')) URL.revokeObjectURL(prev.logoUrl);
          return { ...prev, logoUrl: localUrl };
        });
        setNewImages((prev) => ({ ...prev, logoImage: file }));
      }
      setIsImageUpdated(true);
      e.target.value = '';
    },
    [validateImageFile, setNewImages],
  );

  return (
    <div className="w-full lg:w-1/4">
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Profile Picture</h3>
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
              <Image
                key={`${currentImages.avatarUrl}-${Date.now()}`}
                src={currentImages.avatarUrl}
                alt="Profile"
                width={128}
                height={128}
                unoptimized
              />
            </div>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              tabIndex={0}
              aria-label="Choose profile picture"
              className="hidden"
              onChange={handleFileChange('avatar')}
            />
            <Button
              type="button"
              variant="outline"
              className="w-full mt-2"
              aria-label="Upload profile picture"
              onClick={() => handleChoose('avatar')}
              disabled={disabled}
            >
              <Upload />
            </Button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Brand Logo</h3>
          <div className="flex flex-col items-center">
            <div className="w-40 h-auto mb-4">
              <Image
                key={`${currentImages.logoUrl}-${Date.now()}`}
                src={currentImages.logoUrl}
                alt="Brand Logo"
                width={160}
                height={100}
                unoptimized
              />
            </div>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              tabIndex={0}
              aria-label="Choose brand logo"
              className="hidden"
              onChange={handleFileChange('logo')}
            />
            <Button
              type="button"
              variant="outline"
              className="w-full mt-2"
              aria-label="Upload brand logo"
              onClick={() => handleChoose('logo')}
              disabled={disabled}
            >
              <Upload />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
