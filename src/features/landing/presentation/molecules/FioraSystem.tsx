import { Icons } from '@/components/Icon';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import Image from 'next/image';
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
    const animation = animate(angle, initialAngle + 360, {
      duration: speed * 1.5,
      ease: 'linear',
      repeat: Infinity,
    });

    return () => animation.stop();
  }, [angle, speed, initialAngle, radius]);

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
              {iconSrc && <Icon className="w-[60%] h-[60%] text-white" />}
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-gray-800 text-white px-3 py-1 rounded-md text-sm font-bold shadow-lg z-50">
            {label}
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

  const baseSystemWidth = 1200;

  const scaleFactor = containerSize > 0 ? containerSize / baseSystemWidth : 1;

  const scaledOrbitLevels = orbitLevels.map((orbit) => ({
    ...orbit,
    radius: orbit.radius * scaleFactor,
  }));

  const scaledShadowRings = shadowRings.map((ring) => ({
    ...ring,
    radius: ring.radius * scaleFactor,
  }));

  const scaledCategoryLabels = categoryLabels.map((label) => ({
    ...label,
    radius: label.radius * scaleFactor,
  }));

  return (
    <section className="mx-auto font-sans">
      <div className="mx-auto">
        <div className="pt-4">
          <div className="mx-auto max-w-3xl text-center">
            {isLoading ? (
              <div className="my-2 sm:my-4 h-10 sm:h-12 w-3/4 mx-auto bg-gray-200 rounded animate-pulse" />
            ) : (
              <h1 className="my-2 sm:my-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800">
                {section?.name}
              </h1>
            )}
          </div>

          <div className="flex justify-center relative">
            <div
              ref={containerRef}
              className="relative flex items-center justify-center w-full max-w-[1200px] aspect-square mx-auto overflow-hidden"
            >
              <motion.div
                className="absolute flex flex-col items-center justify-center bg-white rounded-full shadow-lg z-50"
                style={{
                  width: `${160 * scaleFactor}px`,
                  height: `${160 * scaleFactor}px`,
                  boxShadow: '0 0 10px 2px rgba(0, 0, 0, 0.2)',
                }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src="https://placehold.co/100x100/4CAF50/FFFFFF?text=Fiora"
                  alt="Fiora Logo"
                  width={100 * scaleFactor}
                  height={100 * scaleFactor}
                  className="rounded-full object-contain"
                />
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
                <OrbitalCategoryLabel
                  key={label.label}
                  label={label.label}
                  initialAngle={label.initialAngle}
                  radius={label.radius}
                  scaleFactor={scaleFactor}
                  speed={label.speed}
                  iconSrc={label.iconSrc as keyof typeof Icons}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FioraSystem;
