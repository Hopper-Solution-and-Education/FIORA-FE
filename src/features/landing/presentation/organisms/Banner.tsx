'use client';

import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { useMedia } from '../../hooks/useMedia';

export function Banner() {
  const { media, isError, isLoading } = useMedia('BANNER');
  const autoplayPlugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: false }));

  if (isLoading) return <p>Loading...</p>;
  if (isError || !media) return <p>Error loading banners.</p>;

  return (
    <Carousel
      plugins={[autoplayPlugin.current]}
      onMouseEnter={autoplayPlugin.current.stop}
      onMouseLeave={autoplayPlugin.current.reset}
      className="w-full mt-20"
    >
      <CarouselContent className="flex">
        {media.map((image, index) => (
          <CarouselItem key={index} className="flex-[0_0_100%]">
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  <div className="w-full h-[300px] sm:h-[450px] md:h-[550px] lg:h-[750px]">
                    <Image
                      src={image.media_url ?? ''}
                      layout="fill"
                      alt={image.description || `Banner ${index + 1}`}
                      objectFit="cover"
                      className="pt-20"
                      priority
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
