import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export const MediaEmbedded = () => {
  const videoUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ';

  return (
    <div className="relative flex items-center justify-center">
      {/* Ảnh thumbnail của video */}
      <Image
        src="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg"
        alt="Video Thumbnail"
        className="w-full object-contain rounded-lg"
        width={1280}
        height={720}
      />

      <Dialog>
        <DialogTrigger asChild>
          <Button className="absolute flex items-center text-sm font-medium rounded-full bg-black/70 text-white px-4 py-2">
            ▶ Watch - 3:47
          </Button>
        </DialogTrigger>

        {/* Điều chỉnh kích thước video lớn hơn */}
        <DialogContent className="w-[80vw] max-w-4xl h-auto py pt-8 pb-4 border-none rounded-lg">
          <DialogTitle>
            <VisuallyHidden>Video Player</VisuallyHidden>
          </DialogTitle>

          <div className="relative w-full h-[450px] md:h-[500px] lg:h-[550px]">
            <iframe src={videoUrl} allowFullScreen className="w-full h-full rounded-lg" />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
