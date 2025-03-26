import BlurredShapeGray from '@public/images/blurred-shape-gray.svg';
import BlurredShape from '@public/images/blurred-shape.svg';
import FeaturesImage from '@public/images/features.png';
import Image from 'next/image';

export const FioraSystem = () => {
  return (
    <section className="mx-auto w-[90%] my-10">
      {/* Background Shapes */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 -z-10 -translate-x-1/2"
        aria-hidden="true"
      >
        <Image
          className="max-w-none"
          src={BlurredShapeGray}
          width={760}
          height={668}
          alt="Blurred shape"
        />
      </div>
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -z-10 -mb-80 -translate-x-[120%] opacity-50"
        aria-hidden="true"
      >
        <Image
          className="max-w-none"
          src={BlurredShape}
          width={760}
          height={668}
          alt="Blurred shape"
        />
      </div>

      <div className="mx-auto">
        <div className="border-t">
          {/* Section Header */}
          <div className="mx-auto max-w-3xl text-center md:pb-6">
            <h1 data-aos="fade-up" className="my-6 text-5xl font-bold text-pretty lg:text-6xl">
              What is FIORA ?
            </h1>
          </div>

          {/* Features Image */}
          <div className="flex justify-center pb-2" data-aos="fade-up">
            <div className="relative w-full max-w-full">
              <Image
                className="w-screen h-[500px] md:h-[600px] lg:h-[700px] object-cover rounded-md"
                src={FeaturesImage}
                width={1920}
                height={1080}
                alt="Features"
                priority={true}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
