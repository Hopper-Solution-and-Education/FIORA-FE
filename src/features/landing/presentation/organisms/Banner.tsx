import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import banner from '@public/images/banner.png';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { useRef } from 'react';

const images = [banner, banner, banner, banner];

export function Banner() {
  const autoplayPlugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: false }));

  return (
    <section className="w-full">
      <Carousel
        plugins={[autoplayPlugin.current]}
        onMouseEnter={autoplayPlugin.current.stop}
        onMouseLeave={autoplayPlugin.current.reset}
        className="w-full"
      >
        <CarouselContent className="flex">
          {images.map((src, index) => (
            <CarouselItem key={index} className="flex-[0_0_100%]">
              <Card className="p-0 border-none shadow-none">
                <CardContent className="p-0">
                  <Image
                    src={src}
                    alt={`Banner ${index + 1}`}
                    width={1920}
                    height={850}
                    className="w-full h-[850px] object-cover rounded-lg"
                    priority
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
