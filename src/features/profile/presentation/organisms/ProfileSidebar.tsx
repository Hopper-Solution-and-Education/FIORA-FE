import { Button } from '@/components/ui/button';
import Image from 'next/image';

type Props = {
  profileImageSrc: string;
  brandLogoSrc: string;
};

export default function ProfileSidebar({ profileImageSrc, brandLogoSrc }: Props) {
  return (
    <div className="w-full lg:w-1/4">
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Profile Picture</h3>
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
              <Image src={profileImageSrc} alt="Profile" width={128} height={128} />
            </div>
            <Button variant="outline" className="w-full mt-2" aria-label="Upload profile picture">
              Upload
            </Button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Brand Logo</h3>
          <div className="flex flex-col items-center">
            <div className="w-40 h-auto mb-4">
              <Image src={brandLogoSrc} alt="Brand Logo" width={160} height={100} />
            </div>
            <Button variant="outline" className="w-full mt-2" aria-label="Upload brand logo">
              Upload
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
