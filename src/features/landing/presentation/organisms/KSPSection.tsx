'use client'; // Đảm bảo đây là client component vì sử dụng hook và framer-motion

import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { useIsMobile } from '@/shared/hooks/useIsMobile';
import Autoplay from 'embla-carousel-autoplay';
import { motion } from 'framer-motion';
import { ImageIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { SectionTypeEnum } from '../../constants';
import { Media } from '../../domain/models/Media';
import { useGetSection } from '../../hooks/useGetSection';

const containerWidthDesktop = 1300;
const containerWidthMobile = 300;
const numberOfItemsDesktop = 3;
const numberOfItemsMobile = 1;
const gapDesktop = 5;
const gapMobile = 10;
const itemHeightDesktop = '750px';
const itemHeightMobile = '500px';

const KSPSection = () => {
  const { isLoading, section } = useGetSection(SectionTypeEnum.KPS);
  const isMobile = useIsMobile();

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

  return (
    <section className="sm:pt-10 font-inter">
      <div className="mx-auto max-w-6xl text-center pt-6">
        <h1 data-aos="fade-up" className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold">
          {section?.name}
        </h1>
      </div>
      <Carousel
        className={`mx-auto  ${isMobile ? 'max-w-[100vw]' : 'max-w-[1300px]'}`}
        opts={{
          loop: true,
          direction: 'ltr',
        }}
        plugins={[
          Autoplay({
            delay: 5000,
            stopOnInteraction: false,
            playOnInit: true,
            jump: false,
            stopOnFocusIn: true,
            stopOnMouseEnter: true,
          }),
        ]}
      >
        <CarouselContent className="flex" style={{ height: itemHeight }}>
          {section?.medias?.map((item, index) => (
            <CarouselItem
              key={item.id ?? index}
              style={{
                marginRight: `${gap}px`,
                marginLeft: `${gap}px`,
                maxWidth: itemWidth,
                height: itemHeight,
              }}
            >
              <FlippingItemContent
                item={item as unknown as Media}
                className="border-none shadow-none py-20"
                style={{
                  maxWidth: itemWidth,
                  height: itemHeight,
                }}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
};

// New component to encapsulate the flipping logic for the CarouselItem's content
const FlippingItemContent = ({
  item,
  className,
  style,
}: {
  item: Media;
  className: string;
  style: React.CSSProperties;
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <Link href={item.redirect_url || ''} target="_blank">
      <div
        className={`w-full rounded-lg shadow-md border relative overflow-hidden card-container cursor-pointer ${className} `}
        style={{ perspective: '1000px', ...style }} // Added perspective to the container for 3D effect
        onMouseEnter={() => setIsFlipped(true)}
        onMouseLeave={() => setIsFlipped(false)}
      >
        <motion.div
          className="card w-full h-full relative"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.8 }}
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Front Side - pass item data */}
          <div
            className="card-front absolute w-full h-full flex justify-center items-center backface-hidden rounded-lg bg-white"
            style={{
              backfaceVisibility: 'hidden',
            }}
          >
            <CardFront item={item} />
          </div>

          {/* Back Side - pass item data */}
          <div
            className="card-back absolute w-full h-full flex justify-center items-center backface-hidden rounded-lg bg-white"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <CardBack item={item} />
          </div>
        </motion.div>
      </div>
    </Link>
  );
};

const CardFront = ({ item }: { item: Media }) => {
  return (
    <div className="relative w-full h-full">
      {item.media_url ? (
        <Image
          src={item.media_url}
          alt={item.description || 'Front Side'}
          className="w-full h-full object-cover rounded-lg"
          fill
          sizes="100%"
        />
      ) : (
        <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
          <ImageIcon />
        </div>
      )}
    </div>
  );
};

const CardBack = ({ item }: { item: Media }) => {
  return (
    <div className="relative w-full h-full">
      {item.media_url_2 ? (
        <Image
          src={item.media_url_2}
          alt={item.description || 'Back Side'}
          className="w-full h-full object-cover rounded-lg"
          fill
          sizes="100%"
        />
      ) : (
        <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
          <ImageIcon />
        </div>
      )}
    </div>
  );
};

export default KSPSection;
