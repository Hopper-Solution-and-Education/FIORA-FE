'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton'; // Assuming you have a Skeleton component (e.g., from shadcn/ui)
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import Link from 'next/link'; // Import Link for navigation
import { useRef } from 'react';
import { useMedia } from '../../hooks/useMedia';
const defaultURL = 'https://www.facebook.com/HopperSolutionAndEducation';

export function Banner() {
  const { media, isError, isLoading } = useMedia('BANNER');
  const autoplayPlugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: false }));

  // Skeleton Component
  const BannerSkeleton = () => (
    <Carousel className="w-full mt-20">
      <CarouselContent className="flex">
        {Array.from({ length: 3 }).map((_, index) => (
          <CarouselItem key={index} className="flex-[0_0_100%]">
            <Card>
              <CardContent className="p-0">
                <div className="relative w-full">
                  <div className="w-full h-[300px] sm:h-[450px] md:h-[550px] lg:h-[750px]">
                    <Skeleton className="w-full h-full bg-gray-300 animate-pulse" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );

  if (isLoading) return <BannerSkeleton />;
  if (isError || !media) return <p>Error loading banners.</p>;

  return (
    <Carousel
      plugins={[autoplayPlugin.current]}
      onMouseEnter={autoplayPlugin.current.stop}
      onMouseLeave={autoplayPlugin.current.reset}
      className="w-full mt-5"
    >
      <CarouselContent className="flex">
        {media.map((image, index) => (
          <CarouselItem key={index} className="flex-[0_0_100%]">
            <Card>
              <CardContent className="p-0 relative">
                <Link
                  target="_blank"
                  href={image.redirect_url || defaultURL}
                  className="block cursor-pointer"
                >
                  <div className="relative w-full">
                    <div className="w-full h-[300px] sm:h-[450px] md:h-[550px] lg:h-[750px]">
                      <Image
                        src={image.media_url ?? ''}
                        alt={image.description || `Banner ${index + 1}`}
                        fill
                        objectFit="cover"
                        className="pt-20"
                        priority
                      />
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
