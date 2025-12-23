import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import Image from 'next/image';
import Link from 'next/link';
import { SectionTypeEnum } from '../../constants';
import { useGetSection } from '../../hooks/useGetSection';

const DEFAULT_URL = 'https://www.facebook.com/HopperSolutionAndEducation';

const FooterContent = ({ medias, description }: { medias: any[]; description: string }) => (
  <footer
    className="bg-[#2E4F2E] text-white py-4 px-4 md:px-10 rounded-t-3xl"
    data-test="footer-content"
  >
    <div className="flex flex-col md:flex-row items-center justify-between pb-2 px-4 lg:px-20">
      <h2 className="text-2xl font-bold" data-test="footer-title">
        FIORA
      </h2>
      <div className="flex space-x-4" data-test="footer-social-icons">
        {medias.map((icon, index) => {
          const hasDescription = icon.description && icon.description.trim() !== '';

          if (hasDescription) {
            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Link
                    href={icon.redirect_url ?? DEFAULT_URL}
                    target="_blank"
                    className="hover:scale-110 transition-transform"
                    data-test={`footer-social-icon-link-${index}`}
                  >
                    <Image
                      alt={icon.description}
                      src={icon.media_url ?? ''}
                      width={120}
                      height={120}
                      className="h-6 w-6 rounded-full"
                      data-test={`footer-social-icon-image-${index}`}
                    />
                  </Link>
                </TooltipTrigger>
                <TooltipContent data-test={`footer-social-icon-tooltip-content`}>
                  <p>{icon.description}</p>
                </TooltipContent>
              </Tooltip>
            );
          }

          return (
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
          );
        })}
      </div>
    </div>

    <hr className="border-t border-gray-600 mb-4" />

    <div className="md:text-left leading-relaxed px-4 lg:px-20" data-test="footer-description">
      <p className="text-sm md:text-base">{description}</p>
    </div>
  </footer>
);

const FooterSkeleton = () => (
  <footer
    className="bg-[#2E4F2E] text-white py-8 px-4 md:px-10 rounded-t-3xl"
    data-test="footer-skeleton"
  >
    <div
      className="flex flex-col md:flex-row items-center justify-between pb-6 md:pb-8"
      data-test="footer-skeleton-header"
    >
      <Skeleton className="h-6 w-32 mb-4 md:mb-0" data-test="footer-skeleton-title" />
      <div className="flex space-x-4" data-test="footer-skeleton-icons">
        {[...Array(4)].map((_, i) => (
          <Skeleton
            key={i}
            className="h-6 w-6 rounded-full"
            data-test={`footer-skeleton-icon-${i}`}
          />
        ))}
      </div>
    </div>

    <hr className="border-t border-gray-600 mb-6 md:mb-8" data-test="footer-skeleton-divider" />

    <div
      className="text-sm text-center md:text-left leading-relaxed"
      data-test="footer-skeleton-description"
    >
      <Skeleton className="w-full h-4 mb-2" data-test="footer-skeleton-description-line-1" />
      <Skeleton className="w-4/5 h-4 mb-2" data-test="footer-skeleton-description-line-2" />
      <Skeleton className="w-3/4 h-4 mb-2" data-test="footer-skeleton-description-line-3" />
      <Skeleton className="w-1/2 h-4" data-test="footer-skeleton-description-line-4" />
    </div>
  </footer>
);

const FooterError = () => (
  <footer
    className="bg-[#2E4F2E] text-white py-8 px-4 md:px-10 rounded-t-3xl"
    data-test="footer-error"
  >
    <div
      className="flex flex-col md:flex-row items-center justify-between pb-6 md:pb-8"
      data-test="footer-error-header"
    >
      <hr className="border-t border-gray-600 mb-6 md:mb-8" />
    </div>

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
