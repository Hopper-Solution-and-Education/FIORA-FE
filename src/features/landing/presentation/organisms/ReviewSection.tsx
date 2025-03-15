/* eslint-disable @next/next/no-img-element */
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useRef } from 'react';

export const ReviewSection = () => {
  const autoplayPlugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: false }));

  return (
    <section>
      <div className="w-[100%] mx-auto flex border-t px-20">
        <div className="mx-auto max-w-3xl text-center my-10">
          <h2
            data-aos="fade-up"
            className="bg-gradient-to-r from-green-400 via-green-400 to-pink-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-4xl md:text-5xl text-center"
          >
            Reviews
          </h2>
        </div>
      </div>
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
                  <CardContent className="flex items-start p-4">
                    {' '}
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                      <img
                        src="https://images.unsplash.com/photo-1575936123452-b67c3203c357?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D"
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm">Review {index + 1}</p> {/* Nội dung review */}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
};
