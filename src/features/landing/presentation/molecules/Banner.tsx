'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton'; // Assuming you have a Skeleton component (e.g., from shadcn/ui)
import { SectionType } from '@prisma/client';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import Link from 'next/link'; // Import Link for navigation
import { useGetSection } from '../../hooks/useGetSection';
const defaultURL = 'https://www.facebook.com/HopperSolutionAndEducation';

export function Banner() {
  const { section, isError, isLoading } = useGetSection(SectionType.BANNER);

  // Skeleton Component
  const BannerSkeleton = () => (
    <Carousel className="w-full">
      <CarouselContent className="flex">
        {Array.from({ length: 3 }).map((_, index) => (
          <CarouselItem key={index} className="flex-[0_0_100%]">
            <Card>
              <CardContent className="p-0">
                <div className="relative w-full">
                  <div className="w-full h-[800px] sm:h-[750px] md:h-[900px] lg:h-[1440px]">
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
  if (isError || !section) return <p>Error loading banners.</p>;

  return (
    <div className="mt-16 md:mt-20 lg:mt-20">
      <Carousel
        opts={{ loop: true }}
        plugins={[
          Autoplay({
            delay: 5000,
            stopOnInteraction: false,
            playOnInit: true,
            stopOnMouseEnter: true,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent className="flex">
          {section?.medias.map((image, index) => (
            <CarouselItem key={index} className="flex-[0_0_100%]">
              <Card>
                <CardContent className="p-0 relative">
                  <Link
                    target="_blank"
                    href={image.redirect_url || defaultURL}
                    className="block cursor-pointer"
                  >
                    <div className="relative w-full">
                      <div className="w-full h-[250px] sm:h-[300px] md:h-[650px] lg:h-[850px]">
                        <Image
                          src={image.media_url ?? ''}
                          alt={image.description || `Banner ${index + 1}`}
                          fill
                          className="object-fill"
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
    </div>
  );
}
