import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { MediaEmbedded } from '../components/MediaEmbedded';

const sections = [
  {
    title: 'Our Story',
    description:
      'We started with a mission to revolutionize the industry by bringing innovation and passion into our work.',
    image: 'https://supereval.com/wp-content/uploads/2022/12/AdobeStock_121069878-scaled.jpeg',
  },
  {
    title: 'Our Vision',
    description:
      'Our vision is to create a world where technology empowers businesses and individuals to reach new heights.',
    image: 'https://supereval.com/wp-content/uploads/2022/12/AdobeStock_121069878-scaled.jpeg',
  },
  {
    title: 'Our Mission',
    description:
      'We are committed to delivering high-quality solutions that drive success and foster innovation.',
    image: 'https://supereval.com/wp-content/uploads/2022/12/AdobeStock_121069878-scaled.jpeg',
  },
];

const VisionMission = () => {
  return (
    <section className="w-full px-20 py-10">
      <div className="mx-auto max-w-3xl pb-12 text-center md:pb-20">
        <div className="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-linear-to-r before:from-transparent before:to-indigo-200/50 after:h-px after:w-8 after:bg-linear-to-l after:from-transparent after:to-indigo-200/50">
          <span className="inline-flex bg-gradient-to-r from-green-500 via-green-300 to-pink-500 bg-clip-text text-2xl text-transparent">
            Our Vision and Mission
          </span>
        </div>
        <h2 className="bg-gradient-to-r from-green-500 via-gray-300 to-pink-500 bg-clip-text text-transparent pb-4 text-3xl font-semibold md:text-4xl">
          Map your product journey
        </h2>
        <p className="text-lg text-gray-500 dark:text-white-200/65">
          Simple and elegant interface to start collaborating with your team in minutes. It
          seamlessly integrates with your code and your favorite programming languages.
        </p>
      </div>
      <div className="w-full mx-auto flex flex-col gap-12">
        {sections.map((section, index) => (
          <motion.div
            key={index}
            className={`flex flex-col-reverse lg:flex-row items-center gap-8 ${
              index % 2 === 0 ? 'lg:flex-row-reverse' : ''
            }`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            viewport={{ once: true }}
          >
            {/* Text Section */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <h3 className="text-lg md:text-xl lg:text-2xl font-semibold">{section.title}</h3>
              <p className="text-gray-600 text-sm md:text-base lg:text-lg mt-2">
                {section.description}
              </p>
              <div data-aos="fade-up" data-aos-delay={400}>
                <Button className="mb-4 w-full sm:mb-0 sm:w-auto bg-gradient-to-t from-green-500 to-green-900 text-white shadow-lg hover:bg-indigo-700">
                  <span className="relative inline-flex items-center">
                    Start Learning Now
                    <span className="ml-1 tracking-normal text-white/50 transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </span>
                </Button>
              </div>
            </div>

            {/* Image Section */}
            <div className="w-full lg:w-1/2 relative h-64 md:h-72 lg:h-96">
              <Image
                src={section.image}
                alt={section.title}
                layout="fill"
                objectFit="cover"
                className="rounded-lg shadow-lg"
              />
            </div>
          </motion.div>
        ))}
        <MediaEmbedded />
      </div>
    </section>
  );
};

export default VisionMission;
