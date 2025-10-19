'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import Link from 'next/link';
import { SectionTypeEnum } from '../../constants';
import { useGetSection } from '../../hooks/useGetSection';
const defaultURL = 'https://www.facebook.com/HopperSolutionAndEducation';

export function Banner() {
  const { section, isError, isLoading } = useGetSection(SectionTypeEnum.BANNER);

  const BannerSkeleton = () => (
    <Carousel className="w-full">
      <CarouselContent className="flex">
        {Array.from({ length: 3 }).map((_, index) => (
          <CarouselItem key={index} className="flex-[0_0_100%]">
            <Card>
              <CardContent className="p-0">
                <div className="relative w-full">
                  <div className="w-full h-[800px] sm:h-[750px] md:h-[920px] lg:h-[1460px]">
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
        {section?.medias.map((image, index) => {
          const isFirst = index === 0;
          return (
            <CarouselItem key={image.id ?? index} className="flex-[0_0_100%]">
              <Card>
                <CardContent className="p-0 relative">
                  <Link
                    target="_blank"
                    href={image.redirect_url || defaultURL}
                    className="block cursor-pointer"
                  >
                    <div className="relative w-full">
                      <div className="w-full aspect-[16/9] md:aspect-[21/9]">
                        <Image
                          src={image.media_url ?? ''}
                          alt={image.description || `Banner ${index + 1}`}
                          fill
                          // Chỉ prefetch ảnh đầu tiên
                          priority={isFirst}
                          fetchPriority={isFirst ? 'high' : 'auto'}
                          loading={isFirst ? 'eager' : 'lazy'}
                          decoding="async"
                          // Hãy dùng cover thay vì fill để tránh bóp méo và giảm reflow
                          className="object-cover"
                          sizes="(min-width: 1024px) 100vw, (min-width: 768px) 100vw, 100vw"
                          quality={70}
                        />
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            </CarouselItem>
          );
        })}
      </CarouselContent>
    </Carousel>
  );
}
