'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { MediaType } from '@prisma/client';
import Autoplay from 'embla-carousel-autoplay';
import { ArrowLeftCircle, ArrowRightCircle, StarIcon } from 'lucide-react';
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
                        <Card className="w-full max-w-[1450px] min-h-[350px] h-auto mx-auto shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col md:flex-row rounded-xl px-2 md:px-8 lg:px-16 py-4 md:py-8 gap-4 md:gap-0">
                          {/* CardContent: Reviewer info and review */}
                          <CardContent className="flex flex-col gap-4 w-full md:w-2/5 justify-center items-center md:items-start px-2 md:px-6 lg:px-10 py-4 md:py-10">
                            <div className="flex flex-col sm:flex-row items-center md:items-start w-full gap-4">
                              <Image
                                src={reviewerAvatarUrl}
                                alt="Reviewer Avatar"
                                width={90}
                                height={90}
                                className="rounded-full object-cover flex-shrink-0 w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] md:w-[80px] md:h-[80px] lg:w-[90px] lg:h-[90px]"
                              />
                              <div className="flex flex-col items-center md:items-start gap-1 w-full">
                                <h3 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl text-center md:text-left">
                                  {reviewerName}
                                </h3>
                                <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-1 text-center md:text-left">
                                  {reviewerTitle}
                                </p>
                                <div className="flex items-center gap-1 sm:gap-2">
                                  {Array.from({ length: 5 }).map((_, idx) => (
                                    <StarIcon
                                      key={idx}
                                      className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400"
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <Divider />
                            {/* review section text */}
                            <div className="w-full">
                              <p className="text-gray-700 text-xs sm:text-sm md:text-base flex-grow overflow-hidden mb-2 text-center md:text-left line-clamp-5">
                                {reviewText}
                              </p>

                              <div className="flex justify-center md:justify-end gap-2 mt-2 text-gray-400">
                                <ArrowLeftCircle className="w-6 h-6 cursor-pointer" />
                                <ArrowRightCircle className="w-6 h-6 cursor-pointer" />
                              </div>
                            </div>
                          </CardContent>
                          {/* Media section */}
                          <div className="w-full md:w-3/5 p-2 md:p-6 lg:p-10 flex items-center justify-center">
                            {media.media_type === MediaType.EMBEDDED && media.embed_code ? (
                              <div
                                className="w-full h-[200px] sm:h-[300px] md:h-[350px] lg:h-[400px] rounded-xl overflow-hidden"
                                dangerouslySetInnerHTML={{
                                  __html: `<style>iframe { width: 100% !important; height: 100% !important; border: none; }</style>${media.embed_code}`,
                                }}
                              />
                            ) : (
                              <div className="w-full h-[200px] sm:h-[300px] md:h-[350px] lg:h-[400px] flex items-center justify-center bg-gray-100 rounded-xl">
                                <span className="text-gray-400">No media</span>
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

const Divider = () => {
  return (
    <div className="flex justify-center w-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 20"
        className="h-5 w-full"
        fill="none"
        preserveAspectRatio="none"
      >
        {/* Left gray line */}
        <line x1="0" y1="10" x2="40.5" y2="10" stroke="#c0c0c0" strokeWidth="3" />
        <line x1="35.5" y1="10" x2="47.5" y2="10" stroke="#2e7d32" strokeWidth="3" />
        {/* Deeper green V-shaped polyline */}
        <polyline
          points="47,9 50,17 52.6,9.4 77.5,10"
          stroke="#2e7d32"
          strokeWidth="1.25"
          fill="none"
        />

        {/* Right gray line */}
        <line x1="52.5" y1="10" x2="77.5" y2="10" stroke="#2e7d32" strokeWidth="3" />
        <line x1="63" y1="10" x2="100" y2="10" stroke="#c0c0c0" strokeWidth="3" />
      </svg>
    </div>
  );
};
