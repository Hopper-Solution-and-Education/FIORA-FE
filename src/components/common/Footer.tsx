import FacebookIcon from '@public/icons/facebook.png';
import InstagramIcon from '@public/icons/instagram.png';
import ThreadsIcon from '@public/icons/threads.png';
import TiktokIcon from '@public/icons/tiktok.jpg';
import WhatAppsIcon from '@public/icons/whatsapp.png';
import XIcon from '@public/icons/x.webp';
import YoutubeIcon from '@public/icons/youtube.png';
import Image from 'next/image';
import Link from 'next/link';

const IconList = [
  { icon: FacebookIcon, url: 'https://www.facebook.com', name: 'Facebook' },
  { icon: InstagramIcon, url: 'https://www.instagram.com', name: 'Instagram' },
  { icon: YoutubeIcon, url: 'https://www.youtube.com', name: 'YouTube' },
  { icon: XIcon, url: 'https://www.x.com', name: 'X' },
  { icon: ThreadsIcon, url: 'https://www.threads.net', name: 'Threads' },
  { icon: TiktokIcon, url: 'https://www.tiktok.com', name: 'TikTok' },
  { icon: WhatAppsIcon, url: 'https://www.whatsapp.com', name: 'WhatsApp' },
];

export default function Footer() {
  return (
    <footer className=" border-border py-12">
      <div className="mt-10 border-t pt-6 flex flex-col md:flex-row items-center justify-between px-10">
        <div className="flex space-x-6">
          {IconList.map((icon, index) => (
            <Link key={index} href={icon.url} className="hover:scale-110 transition-transform">
              <Image
                alt={icon.name}
                src={icon.icon}
                width={100}
                height={100}
                className="h-10 w-10 rounded-full"
              />
            </Link>
          ))}
        </div>
        <p className="mt-4 md:mt-0 text-sm">&copy; 2025 Hopper Company. All rights reserved.</p>
      </div>
    </footer>
  );
}
