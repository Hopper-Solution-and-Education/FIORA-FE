import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import hopperLogo from '@public/images/logo.jpg';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { useRef } from 'react';

export const PartnerLogo = () => {
  const autoplayPlugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: false }));

  return (
    <section className="w-full my-10 flex flex-col items-center">
      <h2
        data-aos="fade-up"
        className="mb-20 bg-gradient-to-r from-green-400 via-green-400 to-pink-400 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent sm:text-4xl md:text-5xl text-center"
      >
        Hopper SE Partners: Growing Together for a Brighter Future
      </h2>

      <div className="w-full px-4">
        <Carousel className="w-full" plugins={[autoplayPlugin.current]}>
          <CarouselContent className="flex gap-4 animate-marquee">
            {Array.from({ length: 20 }).map((_, index) => (
              <CarouselItem
                key={index}
                className="flex justify-center"
                style={{
                  flex: '0 0 calc(100% / 8)',
                }}
              >
                <Card className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 flex items-center justify-center shadow-md rounded-full overflow-hidden border border-gray-300">
                  <CardContent className="relative w-full h-full">
                    <Image
                      src={hopperLogo}
                      alt={`Logo ${(index % 10) + 1}`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-full"
                    />
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};
