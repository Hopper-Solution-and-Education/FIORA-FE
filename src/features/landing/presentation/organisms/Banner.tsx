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
    <section className="w-full">
      <Carousel
        plugins={[autoplayPlugin.current]}
        onMouseEnter={autoplayPlugin.current.stop}
        onMouseLeave={autoplayPlugin.current.reset}
        className="w-full"
      >
        <CarouselContent className="flex">
          {media.map((image, index) => (
            <CarouselItem key={index} className="flex-[0_0_100%]">
              <Card className="p-0 border-none shadow-none">
                <CardContent className="p-0">
                  <div className="relative w-full h-[850px]">
                    <Image
                      src={image.media_url ?? ''}
                      alt={image.description || `Banner ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                      priority
                    />
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
