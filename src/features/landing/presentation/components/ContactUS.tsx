import FacebookIcon from '@public/icons/facebook.png';
import InstagramIcon from '@public/icons/instagram.png';
import ThreadsIcon from '@public/icons/threads.png';
import XIcon from '@public/icons/x.webp';
import YoutubeIcon from '@public/icons/youtube.png';
import TiktokIcon from '@public/icons/tiktok.jpg';
import WhatAppsIcon from '@public/icons/whatsapp.png';
import Image from 'next/image';

const IconList = [
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
  XIcon,
  ThreadsIcon,
  TiktokIcon,
  WhatAppsIcon,
];

const ContactUS = () => {
  return (
    <section className="w-full my-10 flex flex-col items-center px-4">
      <h2
        data-aos="fade-up"
        className="mb-12 bg-gradient-to-r from-green-400 via-green-400 to-pink-400 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent sm:text-3xl md:text-4xl lg:text-5xl text-center"
      >
        Contact Us
      </h2>

      <div className="w-full mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 sm:gap-6 justify-center max-w-6xl">
        {IconList.map((logo, index) => (
          <div
            key={index}
            className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center shadow-md rounded-full overflow-hidden border border-gray-300 transition-transform hover:scale-105"
          >
            <div className="relative w-full h-full">
              <Image
                src={logo}
                alt={`Logo ${index + 1}`}
                fill
                style={{ objectFit: 'contain', objectPosition: 'center' }}
                className="rounded-full"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ContactUS;
