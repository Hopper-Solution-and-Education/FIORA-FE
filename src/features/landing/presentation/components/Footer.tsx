import { Skeleton } from '@/components/ui/skeleton';
import { SectionType } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { useGetSection } from '../../hooks/useGetSection';
const defaultURL = 'https://www.facebook.com/HopperSolutionAndEducation';

export default function Footer() {
  const { section, isError, isLoading } = useGetSection(SectionType.FOOTER);

  if (isLoading) {
    return (
      <footer className="border-border py-12">
        <div className="mt-10 border-t pt-6 flex flex-col md:flex-row items-center justify-between px-10">
          <div className="flex space-x-6">
            {Array.from({ length: section?.medias.length ?? 0 }).map((_, index) => (
              <div key={index} className="h-8 w-8 rounded-full">
                <Skeleton className="rounded-full h-8 w-8" />
              </div>
            ))}
          </div>
          <Skeleton className="mt-4 md:mt-0 w-[200px] h-4" />
        </div>
      </footer>
    );
  }

  if (isError || !section?.medias) {
    return (
      <footer className="border-border py-12">
        <div className="mt-10 border-t pt-6 flex flex-col md:flex-row items-center justify-between px-10">
          <p>Error loading footer data.</p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-border border-t pb-4">
      <div className="mt-6 flex flex-col md:flex-row items-center justify-between px-10">
        <div className="flex space-x-6">
          {section.medias.map((icon, index) => (
            <Link
              target="_blank"
              key={index}
              href={icon.redirect_url ?? defaultURL}
              className="hover:scale-110 transition-transform"
            >
              <Image
                alt={icon.description ?? ''}
                src={icon.media_url ?? ''}
                width={120}
                height={120}
                className="h-6 w-6 rounded-full"
              />
            </Link>
          ))}
        </div>
        <p className="mt-4 md:mt-0 text-sm">Copyright &copy; FIORA.live</p>
      </div>
    </footer>
  );
}
