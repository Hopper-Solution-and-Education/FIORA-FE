import BlurredShape from '@public/images/blurred-shape.svg';
import Image from 'next/image';
import React from 'react';
import { Button } from '@/components/ui/button';

const OTS = () => {
  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -z-10 -mb-24 ml-20 -translate-x-1/2"
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
      <div className="max-w6xl mx-auto px-5 sm:px-6">
        <div className="bg-linear-to-r from-transparent via-gray-800/50 py-12 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2
              data-aos="fade-up"
              className="my-2 bg-gradient-to-r from-green-400 via-green-400 to-pink-400 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl md:text-5xl"
            >
              Learn and Grow with Hopper Solution & Education
            </h2>

            <div className="mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-center">
              <div data-aos="fade-up" data-aos-delay={400}>
                <Button className="mb-4 w-full sm:mb-0 sm:w-auto bg-gradient-to-t from-green-600 to-green-500 text-white shadow-lg hover:bg-indigo-700">
                  <span className="relative inline-flex items-center">
                    Start Learning Now
                    <span className="ml-1 tracking-normal text-white/50 transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </span>
                </Button>
              </div>

              <div data-aos="fade-up" data-aos-delay={600}>
                <Button
                  variant="outline"
                  className="w-full sm:ml-4 sm:w-auto border-gray-600 text-gray-300 bg-gradient-to-b from-gray-800 to-gray-700 hover:bg-gray-600"
                >
                  Get a Free Consultation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OTS;
