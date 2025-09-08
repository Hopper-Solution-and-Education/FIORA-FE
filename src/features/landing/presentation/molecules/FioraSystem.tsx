import { Icons } from '@/components/Icon';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { SectionTypeEnum } from '../../constants';
import { categoryLabels, orbitLevels, shadowRings } from '../../constants/fiora-system';
import { useGetSection } from '../../hooks/useGetSection';
import { OrbitalItem } from '../atoms';

const OrbitalCategoryLabel = ({
  label,
  initialAngle,
  radius,
  scaleFactor,
  speed,
  iconSrc,
}: {
  label: string;
  initialAngle: number;
  radius: number;
  scaleFactor: number;
  speed: number;
  iconSrc?: keyof typeof Icons;
}) => {
  const angle = useMotionValue(initialAngle);

  const x = useTransform(
    angle,
    (currentAngle) => radius * Math.cos((currentAngle * Math.PI) / 180),
  );

  const y = useTransform(
    angle,
    (currentAngle) => radius * Math.sin((currentAngle * Math.PI) / 180),
  );

  useEffect(() => {
    let frameId: number;
    let lastTime = performance.now();

    function update(now: number) {
      const delta = now - lastTime;
      lastTime = now;
      const degreesPerMs = 360 / (speed * 1000);
      angle.set(angle.get() + degreesPerMs * delta);
      frameId = requestAnimationFrame(update);
    }

    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [angle, speed]);

  const baseCategoryDotSize = 40;

  const scaledCategoryDotSize = baseCategoryDotSize * scaleFactor;

  const Icon = Icons[iconSrc as keyof typeof Icons] || Icons.dashboard;

  return (
    <TooltipProvider delayDuration={0}>
      <motion.div
        key={label}
        className="absolute z-40"
        style={{
          left: '50%',
          top: '50%',
          x: x,
          y: y,
        }}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className="bg-green-800 rounded-full shadow-xl -translate-x-1/2 -translate-y-1/2 relative flex items-center justify-center overflow-hidden"
              style={{
                width: `${scaledCategoryDotSize}px`,
                height: `${scaledCategoryDotSize}px`,
                cursor: 'pointer',
              }}
            >
              {iconSrc &&
                (iconSrc.startsWith('http') ? (
                  <Image
                    src={iconSrc}
                    alt={label}
                    width={scaledCategoryDotSize}
                    height={scaledCategoryDotSize}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Icon className="w-[60%] h-[60%] text-white" />
                ))}
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-gray-800 text-white px-3 py-1 rounded-md text-sm font-bold shadow-lg z-50 max-w-[200px]">
            <div className="line-clamp-4 break-words whitespace-normal">{label}</div>
          </TooltipContent>
        </Tooltip>
      </motion.div>
    </TooltipProvider>
  );
};

export const FioraSystem = () => {
  const { isLoading, section } = useGetSection(SectionTypeEnum.SYSTEM);

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState(0);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize(containerRef.current.offsetWidth);
      }
    };

    updateSize();

    window.addEventListener('resize', updateSize);

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Chỉ render component khi đã fetch xong data
  if (isLoading || !section) {
    return null;
  }

  const baseSystemWidth = 1200;
  const maxOrbitRadius = 500; // Radius lớn nhất từ orbitLevels
  const padding = 40; // Padding để tránh sát mép màn hình

  // Tính toán scale factor để đảm bảo tất cả orbits vừa trong màn hình
  const maxRequiredWidth = maxOrbitRadius * 2 + padding;
  const scaleFactor =
    containerSize > 0
      ? Math.min(containerSize / baseSystemWidth, (containerSize - padding) / maxRequiredWidth)
      : 1;

  const scaledOrbitLevels = orbitLevels.map((orbit) => ({
    ...orbit,
    radius: orbit.radius * scaleFactor,
  }));

  const scaledShadowRings = shadowRings.map((ring) => ({
    ...ring,
    radius: ring.radius * scaleFactor,
  }));

  const scaledCategoryLabels = categoryLabels.map((label, index) => ({
    ...label,
    radius: label.radius * scaleFactor,
    iconSrc: section?.medias?.[index + 1]?.media_url ?? label.iconSrc,
    label: section?.medias?.[index + 1]?.description ?? label.label,
    href: section?.medias?.[index + 1]?.redirect_url ?? label.href,
  }));

  const fioraLogo = section?.medias?.[0]?.media_url;

  return (
    <section className="font-sans pt-8 sm:pt-12 md:pt-0 lg:pt-0 lg:mt-2">
      <div className="mx-auto">
        <div>
          <div className="mx-auto max-w-3xl text-center -mb-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
              {section?.name}
            </h1>
          </div>

          <div className="flex justify-center relative">
            <div
              ref={containerRef}
              className="relative flex items-center justify-center w-full max-w-[1200px] aspect-square mx-auto overflow-hidden"
            >
              <motion.div
                className="absolute flex flex-col items-center justify-center bg-white rounded-full shadow-lg z-10"
                style={{
                  width: `${160 * scaleFactor}px`,
                  height: `${160 * scaleFactor}px`,
                  boxShadow: '0 0 10px 2px rgba(0, 0, 0, 0.2)',
                }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {fioraLogo ? (
                  fioraLogo.startsWith('http') ? (
                    <Image
                      src={fioraLogo}
                      alt="Fiora Logo"
                      width={120 * scaleFactor}
                      height={120 * scaleFactor}
                      className="rounded-full object-contain"
                    />
                  ) : (
                    <Icons.dashboard className="w-[100%] h-[100%] text-white" />
                  )
                ) : (
                  <Image
                    src="https://cdn.pixabay.com/photo/2017/09/12/06/26/home-2741413_960_720.png"
                    alt="Fiora Logo"
                    width={120 * scaleFactor}
                    height={120 * scaleFactor}
                    className="rounded-full object-contain"
                  />
                )}
              </motion.div>

              {scaledOrbitLevels.map((orbit) => {
                const baseStrokeWidth = 2;
                const baseDash = 10;
                const baseGap = 14;

                const strokeWidth = baseStrokeWidth * scaleFactor;
                const dash = baseDash * scaleFactor;
                const gap = baseGap * scaleFactor;

                const circumference = 2 * Math.PI * orbit.radius;
                const unitLength = dash + gap;
                const units = Math.floor(circumference / unitLength);
                const adjustedDash = (dash / unitLength) * (circumference / units) + 6;
                const adjustedGap = (gap / unitLength) * (circumference / units) + 6;

                const svgSize = orbit.radius * 2 + strokeWidth;
                const center = orbit.radius + strokeWidth / 2;

                return (
                  <motion.svg
                    key={orbit.id}
                    width={svgSize}
                    height={svgSize}
                    className="absolute"
                    style={{
                      transform: 'translate(-50%, -50%)',
                      transformOrigin: 'center center',
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: orbit.speed * 1.5, repeat: Infinity, ease: 'linear' }}
                  >
                    <circle
                      cx={center}
                      cy={center}
                      r={orbit.radius}
                      fill="none"
                      stroke="#d7d7d7"
                      strokeWidth={strokeWidth}
                      strokeDasharray={`${adjustedDash} ${adjustedGap}`}
                      strokeDashoffset="1"
                      strokeLinecap="butt"
                    />
                  </motion.svg>
                );
              })}

              {scaledOrbitLevels.map((orbit) =>
                orbit.items.map((item) => (
                  <OrbitalItem key={item.id} item={item} orbit={orbit} scaleFactor={scaleFactor} />
                )),
              )}

              {scaledShadowRings.map((ring, idx) => {
                const spreadRadius = ring.radius * 0.0125 * idx + 30;
                return (
                  <div
                    key={ring.id}
                    className="absolute rounded-full"
                    style={{
                      width: `${ring.radius * 2}px`,
                      height: `${ring.radius * 2}px`,
                      boxShadow: `0 0 ${spreadRadius}px 5px rgba(117, 117, 117, 0.2)`,
                    }}
                  />
                );
              })}
              {scaledCategoryLabels.map((label) => (
                <Link href={label.href ?? '#'} target="_blank" key={label.label}>
                  <OrbitalCategoryLabel
                    label={label.label}
                    initialAngle={label.initialAngle}
                    radius={label.radius}
                    scaleFactor={scaleFactor}
                    speed={label.speed}
                    iconSrc={label.iconSrc as keyof typeof Icons}
                    key={label.label}
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FioraSystem;
