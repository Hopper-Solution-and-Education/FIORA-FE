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
    <Carousel className="w-full" data-test="banner-skeleton">
      <CarouselContent className="flex" data-test="banner-skeleton-content">
        {Array.from({ length: 3 }).map((_, index) => (
          <CarouselItem
            key={index}
            className="flex-[0_0_100%]"
            data-test={`banner-skeleton-item-${index}`}
          >
            <Card data-test="banner-skeleton-card">
              <CardContent className="p-0" data-test="banner-skeleton-card-content">
                <div className="relative w-full" data-test="banner-skeleton-image-container">
                  <div
                    className="w-full h-[800px] sm:h-[750px] md:h-[920px] lg:h-[1460px]"
                    data-test="banner-skeleton-image-wrapper"
                  >
                    <Skeleton
                      className="w-full h-full bg-gray-300 animate-pulse"
                      data-test="banner-skeleton-image"
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

  if (isLoading) return <BannerSkeleton />;
  if (isError || !section) return <p data-test="banner-error">Error loading banners.</p>;

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
      data-test="banner-section"
    >
      <CarouselContent className="flex" data-test="banner-content">
        {section?.medias.map((image, index) => {
          const isFirst = index === 0;
          return (
            <CarouselItem
              key={image.id ?? index}
              className="flex-[0_0_100%]"
              data-test={`banner-item-${index}`}
            >
              <Card data-test={`banner-card-${index}`}>
                <CardContent className="p-0 relative" data-test={`banner-card-content-${index}`}>
                  <Link
                    target="_blank"
                    href={image.redirect_url || defaultURL}
                    className="block cursor-pointer"
                    data-test={`banner-link-${index}`}
                  >
                    <div className="relative w-full">
                      <div className="w-full aspect-[16/9] md:aspect-[21/9]">
                        <Image
                          src={image.media_url ?? ''}
                          alt={image.description || `Banner ${index + 1}`}
                          fill
                          unoptimized
                          priority={isFirst}
                          fetchPriority={isFirst ? 'high' : 'auto'}
                          loading={isFirst ? 'eager' : 'lazy'}
                          decoding="async"
                          sizes="(min-width: 1024px) 100vw, (min-width: 768px) 100vw, 100vw"
                          quality={70}
                          data-test={`banner-image-${index}`}
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
