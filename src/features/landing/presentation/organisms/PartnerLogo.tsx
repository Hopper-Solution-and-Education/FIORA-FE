import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { useMedia } from '../../hooks/useMedia';

export const PartnerLogo = () => {
  const { isLoading, media: logos, isError } = useMedia('PARTNER_LOGO');
  const autoplayPlugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: false }));

  if (isLoading) return <p>Loading...</p>;
  if (isError || !logos) return <p>Error loading partner logos.</p>;

  return (
    <section className="w-full my-10 flex flex-col items-center px-4 pd-10 ">
      <h1 data-aos="fade-up" className="my-6 text-5xl font-bold text-pretty lg:text-6xl ">
        FIORA Partners
      </h1>

      <div className="w-full mx-auto">
        <Carousel
          className="w-full"
          plugins={[autoplayPlugin.current]}
          opts={{
            align: 'start',
            loop: true,
            slidesToScroll: 1,
            breakpoints: {
              '(max-width: 639px)': { slidesToScroll: 1, align: 'center' },
              '(min-width: 640px) and (max-width: 767px)': { slidesToScroll: 2, align: 'start' },
              '(min-width: 768px) and (max-width: 1023px)': { slidesToScroll: 3, align: 'start' },
              '(min-width: 1024px)': { slidesToScroll: 4, align: 'start' },
            },
          }}
        >
          <CarouselContent className="flex gap-4">
            {logos.map((logo, index) => (
              <CarouselItem
                key={index}
                className="basis-auto md:basis-1/6 lg:basis-1/7 flex justify-center py-10"
              >
                <Card className=" w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-48 lg:h-48 flex items-center justify-center shadow-md rounded-full overflow-hidden border border-gray-300 transition-transform hover:scale-105">
                  <CardContent className="relative w-full h-full p-0">
                    <Image
                      src={logo.media_url || ''}
                      alt={logo.description || `Partner Logo ${index + 1}`}
                      fill
                      style={{ objectFit: 'contain', objectPosition: 'center' }}
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
