import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { SectionType } from '@prisma/client';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { useGetSection } from '../../hooks/useGetSection';

export const PartnerLogo = () => {
  const { isLoading, section, isError } = useGetSection(SectionType.PARTNER_LOGO);

  if (isLoading) return <p>Loading...</p>;
  if (isError || !section?.medias) return <p>Error loading partner logos.</p>;

  return (
    <section className="w-full my-10 flex flex-col items-center px-4 pt-10">
      <h1 data-aos="fade-up" className="my-6 text-5xl font-bold text-pretty lg:text-6xl">
        {section?.name}
      </h1>

      <div className="w-full mx-auto">
        <Carousel
          className="w-full"
          plugins={[Autoplay({ delay: 3000, stopOnInteraction: false, playOnInit: true })]}
          opts={{
            loop: true,
            slidesToScroll: 1,
            direction: 'ltr',
          }}
        >
          <CarouselContent className="flex">
            {section.medias.concat(section.medias).map((logo, index) => (
              <CarouselItem
                key={index}
                className="basis-auto md:basis-1/3 lg:basis-1/5 flex justify-center p-2"
              >
                <Card className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 flex items-center justify-center shadow-md rounded-full overflow-hidden border border-gray-300 transition-transform hover:scale-105">
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
