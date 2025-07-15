import { SectionType } from '@prisma/client';
import Image from 'next/image';
import { useGetSection } from '../../hooks/useGetSection';

export const FioraSystem = () => {
  const { isLoading, section } = useGetSection(SectionType.SYSTEM);

  return (
    <section className="mx-auto w-[90%] my-8">
      <div className="mx-auto">
        <div className="border-t">
          {/* Section Header */}
          <div className="mx-auto max-w-3xl text-center md:pb-6">
            {isLoading ? (
              <div
                className="my-4 sm:my-6 h-10 sm:h-12 w-3/4 mx-auto bg-gray-200 rounded animate-pulse"
                data-aos="fade-up"
              />
            ) : (
              <h1
                data-aos="fade-up"
                className="my-4 sm:my-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-pretty"
              >
                {section?.name}
              </h1>
            )}
          </div>

          {/* Features Image */}
          <div className="flex justify-center pb-2" data-aos="fade-up">
            <div className="relative max-w-full">
              {isLoading ? (
                <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] bg-gray-200 rounded-md animate-pulse" />
              ) : (
                <Image
                  className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] object-cover rounded-md"
                  src={section?.medias[0]?.media_url || ''}
                  width={1920}
                  height={1080}
                  alt="Features"
                  priority={true}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
