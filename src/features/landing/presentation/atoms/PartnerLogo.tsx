'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { SectionTypeEnum } from '../../constants';
import { useGetSection } from '../../hooks/useGetSection';

const PartnerLogo = () => {
  const { isLoading, section, isError } = useGetSection(SectionTypeEnum.PARTNER_LOGO);

  if (isLoading)
    return <p className="text-center py-8 sm:py-10 text-sm sm:text-base">Loading...</p>;
  if (isError || !section?.medias)
    return (
      <p className="text-center py-8 sm:py-10 text-sm sm:text-base text-red-500">
        Error loading partner logos.
      </p>
    );

  return (
    <section className="w-full my-8 sm:my-10 flex flex-col items-center px-2 sm:px-4 pt-8 sm:pt-10">
      <h1
        data-aos="fade-up"
        className="my-4 sm:my-20 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-pretty"
      >
        {section?.name}
      </h1>

      <div className="w-full mx-auto relative">
        <Carousel
          className="w-full"
          opts={{
            loop: true,
            direction: 'ltr',
          }}
          plugins={[
            Autoplay({
              delay: 5000,
              stopOnInteraction: true,
              playOnInit: true,
              jump: false,
            }),
          ]}
        >
          <CarouselContent className="flex">
            {section.medias.concat(section.medias).map((logo, index) => (
              <CarouselItem
                key={index}
                className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/4 xl:basis-1/5 flex justify-center"
              >
                <Card className="w-48 h-28 md:w-56 md:h-32 flex items-center justify-center shadow-md rounded-xl overflow-hidden border border-gray-300 transition-transform hover:scale-105">
                  <CardContent className="relative w-full h-full">
                    <Image
                      src={logo.media_url || ''}
                      alt={logo.description || `Partner Logo ${index + 1}`}
                      fill
                      style={{ objectFit: 'contain', objectPosition: 'center' }}
                      className="rounded-xl"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://via.placeholder.com/150?text=Logo+Not+Found';
                      }}
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

export default PartnerLogo;
