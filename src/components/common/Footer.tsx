import hopperLogo from '@public/images/logo.jpg';
import { Facebook, Github, Instagram, Twitter } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const footerLinks = [
  {
    title: 'Fiora',
    links: ['About', 'Features', 'Projects', 'Contact'],
  },
  {
    title: 'About',
    links: ['Company', 'FAQs', 'News', 'Recent Updates'],
  },
  {
    title: 'Resources',
    links: ['Courses', 'Development Tutorials', 'Documentation', 'Blog'],
  },
  {
    title: 'Support',
    links: ['Customer Support', 'Project Updates', 'Terms & Conditions', 'Privacy Policy'],
  },
];

const socialIcons = [
  { icon: Facebook, link: '#' },
  { icon: Twitter, link: '#' },
  { icon: Instagram, link: '#' },
  { icon: Github, link: '#' },
];

export default function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="max-w mx-auto px-6 lg:px-32">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Logo & Company */}
          <div>
            <Image
              src={hopperLogo}
              width={1280}
              height={720}
              className="w-[10vw] rounded-full"
              alt={'hopper-logo'}
            />
          </div>

          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-lg font-semibold">{section.title}</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {section.links.map((link) => (
                  <li key={link}>
                    <Link href="#" className="hover:underline">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Icons & Copyright */}
        <div className="mt-10 border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex space-x-6">
            {socialIcons.map(({ icon: Icon, link }, index) => (
              <Link key={index} href={link} className="hover:scale-110 transition-transform">
                <Icon className="h-5 w-5" />
              </Link>
            ))}
          </div>

          <p className="mt-4 md:mt-0 text-sm">&copy; 2025 Hopper Company. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
