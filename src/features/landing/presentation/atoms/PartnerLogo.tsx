'use client';

import Image from 'next/image';
import { SectionTypeEnum } from '../../constants';
import { useGetSection } from '../../hooks/useGetSection';

const PartnerLogo = () => {
  const { isLoading, section, isError } = useGetSection(SectionTypeEnum.PARTNER_LOGO);

  if (isLoading)
    return (
      <p
        className="text-center py-8 sm:py-10 text-sm sm:text-base"
        data-test="partner-logo-loading"
      >
        Loading...
      </p>
    );
  if (isError || !section?.medias)
    return (
      <p
        className="text-center py-8 sm:py-10 text-sm sm:text-base text-red-500"
        data-test="partner-logo-error"
      >
        Error loading partner logos.
      </p>
    );

  return (
    <section
      className="w-full sm:my-10 flex flex-col items-center sm:px-4 pt-8 sm:pt-10"
      data-test="partner-logo-section"
    >
      <h1
        data-aos="fade-up"
        className="my-2 sm:my-10 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-pretty"
        data-test="partner-logo-title"
      >
        {section?.name}
      </h1>
      <div className="overflow-hidden w-full mx-auto relative" data-test="partner-logo-container">
        <div
          className="flex gap-8 animate-marquee p-4"
          style={{
            animation: 'marquee 50s linear infinite',
            width: 'max-content',
          }}
          data-test="partner-logo-marquee"
        >
          {[...section.medias, ...section.medias].map((logo, index) => (
            <div
              key={index}
              className="w-52 h-28 md:w-80 md:h-32 flex items-center justify-center shadow-md rounded-xl overflow-hidden border border-gray-300 transition-transform hover:scale-105"
              data-test={`partner-logo-item-${index}`}
            >
              <div className="relative w-full h-full">
                <Image
                  src={logo.media_url || ''}
                  alt={logo.description || `Partner Logo ${index + 1}`}
                  fill
                  style={{ objectFit: 'contain', objectPosition: 'center' }}
                  className="rounded-xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://via.placeholder.com/150?text=Logo+Not+Found';
                  }}
                  data-test={`partner-logo-image-${index}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          will-change: transform;
        }
      `}</style>
    </section>
  );
};

export default PartnerLogo;
