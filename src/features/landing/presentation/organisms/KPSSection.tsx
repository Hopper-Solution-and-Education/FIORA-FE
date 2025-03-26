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
const itemHeight = '520px';

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
    <section className="py-5">
      <div className="mx-auto max-w-3xl text-center md:py-20 border-t">
        <h1
          data-aos="fade-up"
          className="my-6 text-3xl md:text-5xl lg:text-6xl font-bold text-pretty"
        >
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
            delay: 3000, // Loại bỏ delay để tạo scroll liên tục
            stopOnInteraction: false, // Không dừng khi tương tác
            playOnInit: true, // Chạy ngay khi khởi tạo
            jump: false, // Không nhảy từng bước mà scroll mượt
          }),
        ]}
      >
        <CarouselContent className="flex" style={{ gap: `${gap}px` }}>
          {section?.medias?.map((item, index) => (
            <CarouselItem
              key={index}
              className="basis-full sm:basis-1/2 md:basis-1/3"
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

      {/* Thêm CSS tùy chỉnh để tăng tính mượt mà */}
      <style jsx>{`
        .embla__container {
          animation: scroll 20s linear infinite; /* Tùy chỉnh thời gian scroll */
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </section>
  );
};

export default KPSSection;
