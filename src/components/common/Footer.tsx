import hopperLogo from '@public/images/logo.jpg';
import { Facebook, Github, Instagram, Twitter } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Logo & Company */}
          <div>
            <Image
              src={hopperLogo}
              width={1280}
              height={720}
              className=" w-[10vw]  rounded-full"
              alt={'hopper-logo'}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Fiora</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="#" className="hover:underline">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-lg font-semibold">About</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="#" className="hover:underline">
                  Company
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  News
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Recent Updates
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold">Resources</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="#" className="hover:underline">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Development Tutorials
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold">Support</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="#" className="hover:underline">
                  Customer Support
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Project Updates
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Icons & Copyright */}
        <div className="mt-10 border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between">
          {/* Social Icons */}
          <div className="flex space-x-6">
            <Link href="#" className="hover:scale-110 transition-transform">
              <Facebook className="h-5 w-5" />
            </Link>
            <Link href="#" className="hover:scale-110 transition-transform">
              <Twitter className="h-5 w-5" />
            </Link>
            <Link href="#" className="hover:scale-110 transition-transform">
              <Instagram className="h-5 w-5" />
            </Link>
            <Link href="#" className="hover:scale-110 transition-transform">
              <Github className="h-5 w-5" />
            </Link>
          </div>

          <p className="mt-4 md:mt-0 text-sm">&copy; 2025 Hopper Company. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
