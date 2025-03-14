import BlurredShapeGray from '@public/images/blurred-shape-gray.svg';
import BlurredShape from '@public/images/blurred-shape.svg';
import FeaturesImage from '@public/images/features.png';
import Image from 'next/image';

export const FioraSystem = () => {
  return (
    <section className="mx-auto w-[90%] my-20">
      {/* Background Shapes */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 -z-10 -mt-20 -translate-x-1/2"
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

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="border-t md:py-20">
          {/* Section Header */}
          <div className="mx-auto max-w-3xl pb-4 text-center md:pb-12">
            <h2
              data-aos="fade-up"
              className="bg-gradient-to-r from-green-400 via-green-400 to-pink-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-4xl md:text-5xl text-center"
            >
              Built for modern product teams
            </h2>
          </div>

          {/* Features Image */}
          <div className="flex justify-center pb-4 md:pb-12" data-aos="fade-up">
            <div className="relative w-full max-w-[1104px] px-4 sm:px-6 lg:px-8">
              <Image
                className="w-full h-auto rounded-md"
                src={FeaturesImage}
                width={1104}
                height={384}
                alt="Features"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1104px"
                priority={false} // Optional: Set to true if this image is above the fold
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
