import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useGetSection } from '../../hooks/useGetSection';
import { SectionType, MediaType } from '@prisma/client';
import Image from 'next/image';

export const ReviewSection = () => {
  const { isError, section, isLoading } = useGetSection(SectionType.REVIEW);

  // Skeleton Component
  const SkeletonReview = () => (
    <CarouselItem className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 px-2">
      <Card className="w-full max-w-[400px] h-[300px] mx-auto shadow-md">
        <CardContent className="flex items-start p-4 h-full">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 animate-pulse mr-3 sm:mr-4 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
          </div>
        </CardContent>
      </Card>
    </CarouselItem>
  );

  // Error Component
  const ErrorMessage = () => (
    <div className="text-center py-10">
      <h2 className="text-xl font-semibold text-red-600">Something went wrong</h2>
      <p className="text-gray-500 mt-2">Unable to load reviews. Please try again later.</p>
    </div>
  );

  return (
    <section className="my-10 w-full">
      <div className="w-full mx-auto">
        <div className="mx-auto max-w-3xl text-center mb-8">
          {isLoading ? (
            <div
              className="h-12 w-1/4 mx-auto bg-gray-200 rounded animate-pulse mb-6"
              data-aos="fade-up"
            />
          ) : (
            <h1
              data-aos="fade-up"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-pretty mb-6"
            >
              {section?.name}
            </h1>
          )}
        </div>

        {isError ? (
          <ErrorMessage />
        ) : isLoading ? (
          <Carousel className="w-full">
            <CarouselContent>
              {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonReview key={index} />
              ))}
            </CarouselContent>
          </Carousel>
        ) : (
          <Carousel
            className="w-full mx-5"
            opts={{
              loop: true,

              direction: 'ltr',
            }}
            plugins={[
              Autoplay({
                delay: 3000,
                stopOnFocusIn: true,
                playOnInit: true,
                jump: false,
              }),
            ]}
          >
            <CarouselContent>
              {section?.medias && section.medias.length > 0 ? (
                section.medias.map((media, index) => (
                  <CarouselItem
                    key={index}
                    className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 px-2"
                  >
                    <Card className="w-full max-w-[400px] h-[300px] mx-auto shadow-md">
                      <CardContent className="p-0 h-full">
                        {media.media_type === MediaType.EMBEDDED && media.embed_code ? (
                          <div
                            className="w-full h-full"
                            dangerouslySetInnerHTML={{
                              __html: `<style>iframe { width: 100% !important; height: 100% !important; border: none; }</style>${media.embed_code}`,
                            }}
                          />
                        ) : media.media_type === MediaType.IMAGE && media.media_url ? (
                          <Image
                            src={media.media_url}
                            alt={media.description || `Review ${index + 1}`}
                            width={400}
                            height={300}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://via.placeholder.com/400x300?text=Image+Not+Found';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <p className="text-gray-500 text-sm">No content available</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))
              ) : (
                <div className="text-center py-10 w-full">
                  <p className="text-gray-500">No reviews available at the moment.</p>
                </div>
              )}
            </CarouselContent>
          </Carousel>
        )}
      </div>
    </section>
  );
};
