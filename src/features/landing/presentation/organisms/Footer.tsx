import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import Link from 'next/link';
import { SectionTypeEnum } from '../../constants';
import { useGetSection } from '../../hooks/useGetSection';

const DEFAULT_URL = 'https://www.facebook.com/HopperSolutionAndEducation';

const FooterContent = ({ medias, description }: { medias: any[]; description: string }) => (
  <footer className="bg-[#2E4F2E] text-white py-8 px-4 md:px-10 rounded-t-3xl">
    <div className="flex flex-col md:flex-row items-center justify-between pb-2 px-4 lg:px-20">
      <h2 className="text-2xl font-bold">FIORA</h2>
      <div className="flex space-x-4">
        {medias.map((icon, index) => (
          <Link
            key={index}
            href={icon.redirect_url ?? DEFAULT_URL}
            target="_blank"
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
    </div>

    <hr className="border-t border-gray-600 mb-6 md:mb-8" />

    <div className="md:text-left leading-relaxed px-4 lg:px-20">
      <p className="text-sm md:text-base">{description}</p>
    </div>
  </footer>
);

const FooterSkeleton = () => (
  <footer className="bg-[#2E4F2E] text-white py-8 px-4 md:px-10 rounded-t-3xl">
    <div className="flex flex-col md:flex-row items-center justify-between pb-6 md:pb-8">
      <Skeleton className="h-6 w-32 mb-4 md:mb-0" />
      <div className="flex space-x-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-6 w-6 rounded-full" />
        ))}
      </div>
    </div>

    <hr className="border-t border-gray-600 mb-6 md:mb-8" />

    <div className="text-sm text-center md:text-left leading-relaxed">
      <Skeleton className="w-full h-4 mb-2" />
      <Skeleton className="w-4/5 h-4 mb-2" />
      <Skeleton className="w-3/4 h-4 mb-2" />
      <Skeleton className="w-1/2 h-4" />
    </div>
  </footer>
);

const FooterError = () => (
  <footer className="bg-[#2E4F2E] text-white py-8 px-4 md:px-10 rounded-t-3xl">
    <div className="flex flex-col md:flex-row items-center justify-between pb-6 md:pb-8">
      <h2 className="text-2xl font-bold mb-4 md:mb-0">Company</h2>
      <div className="flex space-x-4 text-sm text-red-300 italic">Failed to load social icons</div>
    </div>

    <hr className="border-t border-gray-600 mb-6 md:mb-8" />

    <div className="text-sm text-center md:text-left leading-relaxed text-red-200 italic">
      Error loading footer data. Please try again later.
    </div>
  </footer>
);

const Footer = () => {
  const { section, isError, isLoading } = useGetSection(SectionTypeEnum.FOOTER);

  if (isLoading) return <FooterSkeleton />;
  if (isError || !section?.medias) return <FooterError />;

  return (
    <FooterContent
      medias={section.medias}
      description={
        section.name ??
        `Aspire has also been granted a temporary exemption from holding a license under the PS Act...`
      }
    />
  );
};

export default Footer;
