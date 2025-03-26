import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { SectionType } from '@prisma/client';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { useGetSection } from '../../hooks/useGetSection';

const containerWidth = 1400;
const numberOfItems = 3;
const gap = 15;
const totalGapWidth = gap * (numberOfItems - 1);
const itemWidth = `${(containerWidth - totalGapWidth) / numberOfItems}px`;
const itemHeight = '600px';

const KPSSection = () => {
  const { isError, isLoading, section } = useGetSection(SectionType.KPS);

  if (isLoading) {
    return (
      <section className="py-8">
        <div className="mx-auto max-w-3xl text-center mt-10">
          <h1 className="my-6 text-3xl md:text-5xl font-bold text-pretty">Why FIORA?</h1>
          <p>Loading...</p>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-8">
        <div className="mx-auto max-w-3xl text-center mt-10">
          <h1 className="my-6 text-3xl md:text-5xl font-bold text-pretty">Why FIORA?</h1>
          <p className="text-red-500">Error loading data</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 mb-20">
      <div className="mx-auto max-w-3xl text-center md:py-20 border-t">
        <h1 data-aos="fade-up" className="my-4 text-3xl md:text-5xl lg:text-6xl font-bold h-full">
          {section?.name}
        </h1>
      </div>
      <Carousel
        className="mx-auto max-w-[1400px]"
        opts={{
          loop: true,
          direction: 'ltr',
        }}
        plugins={[
          Autoplay({
            delay: 3000,
            stopOnInteraction: false,
            playOnInit: true,
            jump: false,
          }),
        ]}
      >
        <CarouselContent className="flex" style={{ gap: `${gap}px`, height: itemHeight }}>
          {section?.medias?.map((item, index) => (
            <CarouselItem
              key={index}
              className="basis-full sm:basis-1/2 md:basis-1/3 pb-10"
              style={{
                maxWidth: itemWidth,
                height: itemHeight,
              }}
            >
              <div
                className={`w-full h-[90%] rounded-lg shadow-md border relative ${
                  index % 2 === 0 ? 'mt-20' : ''
                } overflow-hidden`}
              >
                <Image
                  src={item.media_url ?? ''}
                  alt={`KPS ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
};

export default KPSSection;
