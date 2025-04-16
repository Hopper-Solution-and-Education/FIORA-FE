'use client'; // Đảm bảo đây là client component vì sử dụng hook và framer-motion

import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { SectionType } from '@prisma/client';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { useGetSection } from '../../hooks/useGetSection';
import { useIsMobile } from '@/shared/hooks/useIsMobile';
import { motion } from 'framer-motion';

// Định nghĩa các giá trị responsive
const containerWidthDesktop = 1400;
const containerWidthMobile = 300; // Giảm chiều rộng container trên mobile
const numberOfItemsDesktop = 3;
const numberOfItemsMobile = 1; // Chỉ hiển thị 1 item trên mobile
const gapDesktop = 15;
const gapMobile = 10; // Giảm gap trên mobile
const itemHeightDesktop = '600px';
const itemHeightMobile = '400px'; // Giảm chiều cao trên mobile

const KPSSection = () => {
  const { isError, isLoading, section } = useGetSection(SectionType.KPS);
  const isMobile = useIsMobile();

  // Sử dụng các giá trị responsive dựa trên isMobile
  const containerWidth = isMobile ? containerWidthMobile : containerWidthDesktop;
  const numberOfItems = isMobile ? numberOfItemsMobile : numberOfItemsDesktop;
  const gap = isMobile ? gapMobile : gapDesktop;
  const totalGapWidth = gap * (numberOfItems - 1);
  const itemWidth = `${(containerWidth - totalGapWidth) / numberOfItems}px`;
  const itemHeight = isMobile ? itemHeightMobile : itemHeightDesktop;

  if (isLoading) {
    return (
      <section className="py-6 sm:py-8">
        <div className="mx-auto max-w-3xl text-center mt-8 sm:mt-10">
          <h1 className={`my-4 sm:my-6 text-2xl sm:text-3xl md:text-5xl font-bold text-pretty`}>
            Why FIORA?
          </h1>
          <p>Loading...</p>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-6 sm:py-8">
        <div className="mx-auto max-w-3xl text-center mt-8 sm:mt-10">
          <h1 className={`my-4 sm:my-6 text-2xl sm:text-3xl md:text-5xl font-bold text-pretty`}>
            Why FIORA?
          </h1>
          <p className="text-red-500">Error loading data</p>
        </div>
      </section>
    );
  }

  // Định nghĩa hiệu ứng lên xuống cho các item
  const itemVariants = (index: number) => ({
    animate: {
      y: index % 2 === 0 ? [-10, 10] : [10, -10],
      transition: {
        y: {
          repeat: Infinity,
          repeatType: 'reverse' as const,
          duration: 2,
          ease: 'easeInOut',
        },
      },
    },
  });

  return (
    <section className="sm:py-10 py-8">
      <div className="mx-auto max-w-3xl text-center md:py-12 border-t">
        <h1
          data-aos="fade-up"
          className="my-3 sm:my-4 text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold h-full"
        >
          {section?.name}
        </h1>
      </div>
      <Carousel
        className={`mx-auto ${isMobile ? 'max-w-[90vw]' : 'max-w-[1400px]'}`} // Responsive container width
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
              className={`${
                isMobile ? 'basis-full' : 'basis-full sm:basis-1/2 md:basis-1/3'
              } sm:py-10 py-12`}
              style={{
                maxWidth: itemWidth,
                height: itemHeight,
              }}
            >
              <motion.div
                className={`w-full h-[90%] rounded-lg shadow-md border relative ${
                  index % 2 === 0 ? 'mt-12 sm:mt-20' : ''
                } overflow-hidden`}
                variants={itemVariants(index)}
                animate="animate"
              >
                <Image
                  src={item.media_url ?? ''}
                  alt={`KPS ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
};

export default KPSSection;
