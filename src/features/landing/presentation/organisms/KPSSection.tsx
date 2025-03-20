import { SectionType } from '@prisma/client';
import Image from 'next/image';
import { useGetSection } from '../../hooks/useGetSection';

const KPSSection = () => {
  const { isError, isLoading, section } = useGetSection(SectionType.KPS);

  if (isLoading) {
    return (
      <section>
        <div className="mx-auto max-w-3xl text-center mt-10">
          <div className="inline-flex items-center gap-3 pb-3">
            <span className="inline-flex bg-gradient-to-r from-green-500 via-green-300 to-pink-500 bg-clip-text text-2xl text-transparent">
              Why FIORA?
            </span>
          </div>
          <h2 className="bg-gradient-to-r from-green-500 via-gray-300 to-pink-500 bg-clip-text text-transparent pb-4 text-3xl font-semibold md:text-4xl">
            Loading...
          </h2>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center min-h-10 gap-5 px-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className={`w-full h-0 pb-[100%] m-2.5 rounded-lg shadow-md border flex items-center justify-center relative 
                ${index % 2 === 0 ? 'mt-32' : 'mt-0'}`}
            >
              <div className="animate-pulse bg-gray-300 w-20 h-20 rounded-full"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section>
        <div className="mx-auto max-w-3xl text-center mt-10">
          <div className="inline-flex items-center gap-3 pb-3">
            <span className="inline-flex bg-gradient-to-r from-green-500 via-green-300 to-pink-500 bg-clip-text text-2xl text-transparent">
              {section?.name}
            </span>
          </div>
          <h2 className="bg-gradient-to-r from-green-500 via-gray-300 to-pink-500 bg-clip-text text-transparent pb-4 text-3xl font-semibold md:text-4xl">
            Error loading data.
          </h2>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center min-h-10 gap-5 px-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className={`w-full h-0 pb-[100%] m-2.5 rounded-lg shadow-md border flex items-center justify-center relative 
                ${index % 2 === 0 ? 'mt-32' : 'mt-0'}`}
            >
              <p className="text-red-500">Error</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="mx-auto max-w-3xl text-center mt-10 border-t">
        <h1 data-aos="fade-up" className="my-6 text-5xl font-bold text-pretty lg:text-6xl">
          Why FIORA?
        </h1>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-center min-h-10 gap-5 px-5">
        {section?.medias &&
          section.medias.map((item, index) => (
            <div
              key={index}
              className={`w-full h-60 m-5 rounded-lg shadow-md border relative 
          ${index % 2 === 0 ? 'mt-32' : 'mt-0'}`}
            >
              <Image
                src={item.media_url ?? ''}
                alt={`KPS ${index + 1}`}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          ))}
      </div>
    </section>
  );
};

export default KPSSection;
