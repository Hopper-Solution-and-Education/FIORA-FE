import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import FacebookIcon from '@public/icons/facebook.png';
import InstagramIcon from '@public/icons/instagram.png';
import ThreadsIcon from '@public/icons/threads.png';
import TiktokIcon from '@public/icons/tiktok.jpg';
import WhatAppsIcon from '@public/icons/whatsapp.png';
import XIcon from '@public/icons/x.webp';
import YoutubeIcon from '@public/icons/youtube.png';
import Image from 'next/image';
import Link from 'next/link'; // Import Link for navigation

// Define the IconList with corresponding URLs
const IconList = [
  { icon: FacebookIcon, url: 'https://www.facebook.com', name: 'Facebook' },
  { icon: InstagramIcon, url: 'https://www.instagram.com', name: 'Instagram' },
  { icon: YoutubeIcon, url: 'https://www.youtube.com', name: 'YouTube' },
  { icon: XIcon, url: 'https://www.x.com', name: 'X' },
  { icon: ThreadsIcon, url: 'https://www.threads.net', name: 'Threads' },
  { icon: TiktokIcon, url: 'https://www.tiktok.com', name: 'TikTok' },
  { icon: WhatAppsIcon, url: 'https://www.whatsapp.com', name: 'WhatsApp' },
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

      <div className="w-full">
        <Carousel className="w-full">
          <CarouselContent className="flex">
            {IconList.map((item, index) => (
              <CarouselItem
                key={index}
                className="flex-[0_0_50%] sm:flex-[0_0_33.33%] md:flex-[0_0_25%] lg:flex-[0_0_14.28%]"
              >
                <div className="flex items-center justify-center py-5">
                  <Link
                    href={item.url}
                    target="_blank" // Open in new tab
                    rel="noopener noreferrer" // Security best practice
                    aria-label={`Visit our ${item.name} page`} // Accessibility
                    className="flex items-center justify-center"
                  >
                    <div className="w-28 h-28 flex items-center justify-center shadow-md rounded-full overflow-hidden border border-gray-300 transition-transform hover:scale-105">
                      <div className="relative w-full h-full">
                        <Image
                          src={item.icon}
                          alt={`${item.name} Logo`}
                          fill
                          style={{ objectFit: 'contain', objectPosition: 'center' }}
                          className="rounded-full"
                        />
                      </div>
                    </div>
                  </Link>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export default ContactUS;
