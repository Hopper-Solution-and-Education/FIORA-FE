import { SectionType } from '@prisma/client';
import { useGetSection } from '../../hooks/useGetSection';

const VisionMission = () => {
  const { section, isError, isLoading } = useGetSection(SectionType.VISION_MISSION);

  if (isLoading) {
    return (
      <section>
        <div className="mx-auto max-w-3xl pb-12 text-center md:pb-20">
          <div className="mb-10 md:mb-20">
            <div className="animate-pulse bg-gray-300 h-10 w-64 mx-auto mb-2 rounded-md"></div>
          </div>
        </div>
        <div>
          <div className="bg-muted-2 grid items-center gap-8 lg:grid-cols-2">
            <div className="flex flex-col items-center p-16 text-center lg:items-start lg:text-left">
              <div className="animate-pulse bg-gray-300 h-6 w-24 mb-4 rounded-md"></div>
              <div className="animate-pulse bg-gray-300 h-12 w-80 mb-6 rounded-md"></div>
              <div className="animate-pulse bg-gray-300 h-8 w-96 mb-8 rounded-md"></div>
              <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
                <div className="animate-pulse bg-gray-300 h-10 w-32 rounded-md mr-2"></div>
                <div className="animate-pulse bg-gray-300 h-10 w-32 rounded-md"></div>
              </div>
            </div>
            <div className="relative lg:h-[500px] h-[300px] overflow-hidden justify-center mx-4">
              <div className="animate-pulse bg-gray-300 absolute inset-0 rounded-md"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isError || !section?.medias) {
    return (
      <section>
        <div className="mx-auto max-w-3xl pb-12 text-center md:pb-20">
          <div className="mb-10 md:mb-20">
            <h2 className="mb-2 text-center text-3xl font-semibold lg:text-5xl">
              Vision and Mission
            </h2>
          </div>
        </div>
        <div>
          <div className="bg-muted-2 grid items-center gap-8 lg:grid-cols-2">
            <div className="flex flex-col items-center p-16 text-center lg:items-start lg:text-left">
              <p>Error loading data.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const embedCode = section.medias.length > 0 ? section.medias[0].embed_code : null;

  return (
    <section>
      <div className="mt-20">
        <div className="bg-muted-2 grid items-center gap-8 lg:grid-cols-3">
          <div className="relative col-span-2 lg:h-[700px] h-[500px] overflow-hidden justify-center mx-4">
            {embedCode ? (
              <div
                className="absolute inset-0"
                dangerouslySetInnerHTML={{
                  __html: `<style>iframe { width: 100% !important; height: 100% !important; border: none; border-radius: 8px; object-fit: cover;}</style>${embedCode}`,
                }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-md">
                <p className="text-gray-500">No embedded content available</p>
              </div>
            )}
          </div>
          <div className="flex flex-col items-center p-16 text-center lg:items-start lg:text-left">
            <h1 className="my-6 text-4xl font-bold text-pretty lg:text-6xl"> {section?.name}</h1>
            <p className="mb-8 max-w-xl text-muted-foreground lg:text-xl">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Elig doloremque mollitia
              fugiat omnis! Porro facilis quo animi consequatur. Explicabo.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionMission;
