/* eslint-disable @next/next/no-img-element */
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

export const ReviewSection = () => {
  return (
    <section className="my-10 w-full">
      <div className="w-full mx-auto">
        <div className="mx-auto max-w-3xl text-center mb-8">
          <h1
            data-aos="fade-up"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-pretty mb-6"
          >
            Reviews
          </h1>
        </div>
        <Carousel
          className="w-full"
          plugins={[Autoplay({ delay: 3000, stopOnInteraction: false, playOnInit: true })]}
          opts={{
            slidesToScroll: 1,
          }}
        >
          <CarouselContent>
            {Array.from({ length: 10 }).map((_, index) => (
              <CarouselItem
                key={index}
                className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 px-2"
              >
                <Card className="w-full max-w-[400px] h-[300px] mx-auto shadow-md">
                  <CardContent className="flex items-start p-4 h-full">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden mr-3 sm:mr-4 flex-shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1575936123452-b67c3203c357?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D"
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-xs sm:text-sm line-clamp-6">
                        Review {index + 1} - This is a sample review content that will be truncated
                        if too long. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      </p>
                    </div>
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
