'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { MediaType } from '@prisma/client';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { useRef } from 'react';
import { SectionTypeEnum } from '../../constants';
import { useGetSection } from '../../hooks/useGetSection';

export const FeedbackSection = () => {
  const { section, isLoading } = useGetSection(SectionTypeEnum.REVIEW);
  const autoplayRef = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true, playOnInit: true, jump: false }),
  );

  // Skeleton Component for the new review card UI
  const SkeletonReview = () => (
    // Adjusted max-w and h to match the new card size
    <CarouselItem className="basis-full px-1 sm:px-2">
      <Card className="w-full max-w-[950px] h-[300px] mx-auto shadow-md flex rounded-xl">
        <CardContent className="p-4 flex flex-col justify-between w-1/3">
          {/* Reviewer Info Skeleton */}
          <div className="flex items-center mb-4 p-4">
            {' '}
            {/* Added p-4 for consistent padding */}
            <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse mr-3 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" /> {/* For stars */}
            </div>
          </div>
          {/* Review Text Skeleton */}
          <div className="flex-grow space-y-2 mb-2 p-4">
            {' '}
            {/* Added p-4 for consistent padding */}
            <div className="h-3 bg-gray-200 rounded animate-pulse w-full" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-11/12" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-5/6" />
          </div>
          {/* Social Icons Skeleton */}
          <div className="flex justify-end gap-2 mt-2 p-4">
            {' '}
            {/* Added p-4 for consistent padding */}
            <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
          </div>
        </CardContent>
        {/* Media Placeholder Skeleton */}
        <div className="w-2/3 p-2 flex items-center justify-center">
          <div className="w-full h-full bg-gray-200 rounded-lg animate-pulse" />{' '}
          {/* Adjusted rounded-md to rounded-lg */}
        </div>
      </Card>
    </CarouselItem>
  );

  return (
    <section className="my-8 sm:my-10 w-full">
      <div className="w-full mx-auto">
        <div className="mx-auto max-w-3xl text-center mb-6 sm:mb-8">
          {isLoading ? (
            <div
              className="h-8 sm:h-10 md:h-12 w-1/4 sm:w-1/3 mx-auto bg-gray-200 rounded animate-pulse mb-4 sm:mb-6"
              data-aos="fade-up"
            />
          ) : (
            <h1
              data-aos="fade-up"
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-pretty mb-4 sm:mb-6"
            >
              {section?.name}
            </h1>
          )}
        </div>

        {isLoading ? (
          <Carousel className="w-full">
            <CarouselContent>
              {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonReview key={index} />
              ))}
            </CarouselContent>
          </Carousel>
        ) : (
          <div className="relative">
            <Carousel
              className="w-full px-2 sm:px-5"
              opts={{
                loop: true,
                direction: 'ltr',
              }}
              plugins={[autoplayRef.current]}
              onMouseEnter={() => autoplayRef.current.stop()}
              onMouseLeave={() => autoplayRef.current.play()}
            >
              <CarouselContent>
                {section?.medias && section.medias.length > 0 ? (
                  section.medias.map((media, index) => {
                    // Dummy data for reviewer info as it's not in the `media` object.
                    // In a real application, this data would come from your backend/API
                    const reviewerName = 'Reina Smith';
                    const reviewerTitle = 'Beautician';
                    const reviewerAvatarUrl = `https://i.pravatar.cc/48?img=${index + 1}`; // Unique avatar per item
                    const reviewText =
                      'Nunc quis erat ac nunc lacinia egestas. Donec in placerat ipsum. Mauris nec porta magna. Suspendisse potenti. Ut viverra dui vel est viverra lacinia.';

                    return (
                      <CarouselItem key={index} className="basis-full px-1 sm:px-2">
                        <Card className="w-full max-w-[1350px] h-[450px] mx-auto shadow-md hover:shadow-lg transition-shadow duration-300 flex rounded-xl px-16">
                          <CardContent className="pl-10 mt-10 flex flex-col justify-center items-center w-2/4">
                            <div className="flex justify-start items-center w-full gap-6">
                              <Image
                                src={reviewerAvatarUrl}
                                alt="Reviewer Avatar"
                                width={80}
                                height={80}
                                className="rounded-full object-cover mr-3 flex-shrink-0 w-[50px] h-[50px] sm:w-[40px] sm:h-[40px] md:w-[60px] md:h-[60px] lg:w-[70px] lg:h-[70px] xl:w-[80px] xl:h-[80px]"
                              />
                              <div>
                                <h3 className="font-bold text-lg">{reviewerName}</h3>
                                <p className="text-sm text-gray-600">{reviewerTitle}</p>
                              </div>
                            </div>
                            <p className="text-gray-700 text-sm flex-grow overflow-hidden mb-2">
                              {reviewText}
                            </p>
                          </CardContent>
                          <div className="w-2/4 p-10">
                            {media.media_type === MediaType.EMBEDDED && media.embed_code ? (
                              <div
                                className="w-full h-full rounded-lg overflow-hidden"
                                dangerouslySetInnerHTML={{
                                  __html: `<style>iframe { width: 100% !important; height: 100% !important; border: none; }</style>${media.embed_code}`,
                                }}
                              />
                            ) : media.media_type === MediaType.IMAGE && media.media_url ? (
                              <Image
                                src={media.media_url}
                                alt={media.description || `Review ${index + 1}`}
                                width={600}
                                height={300}
                                className="w-full h-full object-cover rounded-lg"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    'https://via.placeholder.com/600x300?text=Image+Not+Found';
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                                <p className="text-gray-500 text-xs sm:text-sm">
                                  No content available
                                </p>
                              </div>
                            )}
                          </div>
                        </Card>
                      </CarouselItem>
                    );
                  })
                ) : (
                  <div className="text-center py-8 sm:py-10 w-full">
                    <p className="text-gray-500 text-sm sm:text-base">
                      No reviews available at the moment.
                    </p>
                  </div>
                )}
              </CarouselContent>
            </Carousel>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeedbackSection;
