import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useRef } from 'react';

export const ReviewSection = () => {
  const autoplayPlugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: false }));

  return (
    <section className="w-[100%] mx-auto flex my-20">
      <Carousel
        className="w-full"
        plugins={[autoplayPlugin.current]}
        onMouseEnter={autoplayPlugin.current.stop}
        onMouseLeave={autoplayPlugin.current.reset}
      >
        <CarouselContent>
          {Array.from({ length: 10 }).map((_, index) => (
            <CarouselItem
              key={index}
              className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
            >
              <div>
                <Card className="w-full h-48 shadow-md">
                  <CardContent className="flex items-center justify-center h-full">
                    <span className="text-lg font-semibold">Review {index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* <CarouselPrevious />
    <CarouselNext /> */}
      </Carousel>
    </section>
  );
};
