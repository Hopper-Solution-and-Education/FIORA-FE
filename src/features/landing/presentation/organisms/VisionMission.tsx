import { SectionType } from '@prisma/client';
import { useGetSection } from '../../hooks/useGetSection';

const VisionMission = () => {
  const { section, isError, isLoading } = useGetSection(SectionType.VISION_MISSION);

  if (isLoading) {
    return (
      <section>
        <div className="mx-auto max-w-3xl pb-8 sm:pb-12 md:pb-20 text-center">
          <div className="mb-6 sm:mb-10 md:mb-20">
            <div className="animate-pulse bg-gray-300 h-8 sm:h-10 md:h-12 w-48 sm:w-56 md:w-64 mx-auto rounded-md" />
          </div>
        </div>
        <div>
          <div className="bg-muted-2 grid items-center gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-8">
            {/* Text Section (Hiển thị trước trên mobile) */}
            <div className="flex flex-col items-center p-8 sm:p-12 lg:p-16 text-center lg:items-start lg:text-left order-1 lg:order-2">
              <div className="animate-pulse bg-gray-300 h-5 sm:h-6 w-20 sm:w-24 mb-3 sm:mb-4 rounded-md" />
              <div className="animate-pulse bg-gray-300 h-10 sm:h-12 w-64 sm:w-72 md:w-80 mb-4 sm:mb-6 rounded-md" />
              <div className="animate-pulse bg-gray-300 h-6 sm:h-8 w-72 sm:w-80 md:w-96 mb-6 sm:mb-8 rounded-md" />
              <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
                <div className="animate-pulse bg-gray-300 h-8 sm:h-10 w-28 sm:w-32 rounded-md mr-0 sm:mr-2" />
                <div className="animate-pulse bg-gray-300 h-8 sm:h-10 w-28 sm:w-32 rounded-md" />
              </div>
            </div>
            {/* Video Section (Hiển thị sau trên mobile) */}
            <div className="relative h-[200px] sm:h-[250px] md:h-[300px] lg:h-[500px] overflow-hidden justify-center mx-4 order-2 lg:order-1">
              <div className="animate-pulse bg-gray-300 absolute inset-0 rounded-md" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isError || !section?.medias) {
    return (
      <section>
        <div className="mx-auto max-w-3xl pb-8 sm:pb-12 md:pb-20 text-center">
          <div className="mb-6 sm:mb-10 md:mb-20">
            <h2 className="mb-2 text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold">
              Vision and Mission
            </h2>
          </div>
        </div>
        <div>
          <div className="bg-muted-2 grid items-center gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-8">
            <div className="flex flex-col items-center p-8 sm:p-12 lg:p-16 text-center lg:items-start lg:text-left">
              <p className="text-sm sm:text-base">Error loading data.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const embedCode = section.medias.length > 0 ? section.medias[0].embed_code : null;

  return (
    <section>
      <div className="md:mt-20">
        <div className="bg-muted-2 grid items-center gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Text Section (Hiển thị trước trên mobile) */}
          <div className="flex flex-col justify-center items-center sm:p-8 lg:p-10 lg:items-start lg:text-left order-1 lg:order-2">
            <h1
              data-aos="fade-up"
              className="text-center my-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-pretty"
            >
              {section?.name}
            </h1>
          </div>

          {/* Video Section (Hiển thị sau trên mobile) */}
          <div className="relative col-span-2 h-[300px] md:h-[500px] lg:h-[700px] overflow-hidden justify-center mx-2 order-2 lg:order-1">
            {embedCode ? (
              <div
                className="absolute inset-0"
                dangerouslySetInnerHTML={{
                  __html: `<style>iframe { width: 100% !important; height: 100% !important; border: none; border-radius: 8px; object-fit: cover;}</style>${embedCode}`,
                }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-md">
                <p className="text-gray-500 text-sm sm:text-base">No embedded content available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionMission;
