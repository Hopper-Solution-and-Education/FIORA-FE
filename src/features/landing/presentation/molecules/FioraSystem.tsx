import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { SectionTypeEnum } from '../../constants';
import { useGetSection } from '../../hooks/useGetSection';

// New component for each individual orbiting item
const OrbitalItem = ({
  item,
  orbit,
  scaleFactor,
}: {
  item: any;
  orbit: any;
  scaleFactor: number;
}) => {
  const angle = useMotionValue(item.initialAngle);

  const x = useTransform(
    angle,
    (currentAngle) => orbit.radius * Math.cos((currentAngle * Math.PI) / 180),
  );

  const y = useTransform(
    angle,
    (currentAngle) => orbit.radius * Math.sin((currentAngle * Math.PI) / 180),
  );

  useEffect(() => {
    const animation = animate(angle, item.initialAngle + 360, {
      duration: orbit.speed,
      ease: 'linear',
      repeat: Infinity,
      onComplete: () => {
        angle.set(item.initialAngle);
        animation.play();
      },
    });

    return () => animation.stop();
  }, [angle, orbit.speed, item.initialAngle]);

  const baseDotSize = 16;
  const baseFontSize = 12;

  return (
    <motion.div
      key={item.id}
      className="absolute z-30"
      style={{
        left: '50%',
        top: '50%',
        x: x,
        y: y,
      }}
    >
      <div
        className="bg-blue-500 rounded-full shadow-xl -translate-x-1/2 -translate-y-1/2"
        style={{
          width: `${baseDotSize * scaleFactor}px`,
          height: `${baseDotSize * scaleFactor}px`,
        }}
      ></div>
      <motion.span
        className="absolute font-medium text-gray-700 whitespace-nowrap top-full mt-1 left-1/2 -translate-x-1/2"
        style={{
          fontSize: `${baseFontSize * scaleFactor}px`,
          marginTop: `${4 * scaleFactor}px`,
        }}
      >
        {item.name}
      </motion.span>
    </motion.div>
  );
};

export const FioraSystem = () => {
  const { isLoading, section } = useGetSection(SectionTypeEnum.SYSTEM);

  const orbitLevels = [
    {
      id: 'level1',
      radius: 140,
      items: [
        { id: 'item1-1', name: 'Learning course', initialAngle: 180 },
        { id: 'item1-2', name: 'Mentoring', initialAngle: 270 },
        { id: 'item1-3', name: 'Finance', initialAngle: 0 },
        { id: 'item1-4', name: 'Loans', initialAngle: 90 },
      ],
      speed: 20,
    },
    {
      id: 'level2',
      radius: 260,
      items: [
        { id: 'item2-1', name: 'Talent Portal', initialAngle: 220 },
        { id: 'item2-2', name: 'Safe & Marketing Automation', initialAngle: 100 },
        { id: 'item2-3', name: 'White Label Ecom site', initialAngle: 20 },
        { id: 'item2-4', name: 'Insurance Broker Service', initialAngle: 330 },
        { id: 'item2-5', name: 'Wallet', initialAngle: 0 },
        { id: 'item2-6', name: 'Saving', initialAngle: 60 },
        { id: 'item2-7', name: 'Investment', initialAngle: 90 },
        { id: 'item2-8', name: 'Lending', initialAngle: 120 },
      ],
      speed: 30,
    },
    {
      id: 'level3',
      radius: 380,
      items: [
        { id: 'item3-1', name: 'Ecom Development Service', initialAngle: 120 },
        { id: 'item3-2', name: 'Ecom Insurance Bundling', initialAngle: 300 },
        { id: 'item3-3', name: 'Education Insurance Bundling', initialAngle: 240 },
        { id: 'item3-4', name: 'Finance Insurance Bundling', initialAngle: 180 },
      ],
      speed: 40,
    },
    {
      id: 'level4',
      radius: 500,
      items: [
        { id: 'item4-1', name: 'Global Partnerships', initialAngle: 45 },
        { id: 'item4-2', name: 'AI Integration', initialAngle: 135 },
        { id: 'item4-3', name: 'Blockchain Solutions', initialAngle: 225 },
        { id: 'item4-4', name: 'Data Analytics', initialAngle: 315 },
      ],
      speed: 50,
    },
  ];

  const shadowRings = [
    { id: 'shadow1', radius: 200 },
    { id: 'shadow2', radius: 320 },
    { id: 'shadow3', radius: 440 },
    { id: 'shadow4', radius: 560 },
  ];

  const categoryLabels = [
    { label: 'EDUCATION', radius: 200, angle: 225 },
    { label: 'ECOMMERCE', radius: 320, angle: 10 },
    { label: 'FINANCE', radius: 440, angle: 45 },
    { label: 'INSURANCE', radius: 560, angle: 315 },
  ];

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

  const baseSystemWidth = 900;

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
    <section className="mx-auto w-[90%] my-8 font-sans">
      <div className="mx-auto">
        <div className="border-t border-gray-200 pt-8">
          <div className="mx-auto max-w-3xl text-center pb-6">
            {isLoading ? (
              <div className="my-4 sm:my-6 h-10 sm:h-12 w-3/4 mx-auto bg-gray-200 rounded animate-pulse" />
            ) : (
              <h1 className="my-4 sm:my-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800">
                {section?.name}
              </h1>
            )}
          </div>

          <div className="flex justify-center pb-2 relative">
            <div
              ref={containerRef}
              className="relative flex items-center justify-center w-full max-w-[900px] aspect-square"
            >
              <motion.div
                className="absolute flex flex-col items-center justify-center bg-white p-4 rounded-full shadow-lg z-50"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src="https://placehold.co/100x100/4CAF50/FFFFFF?text=Fiora"
                  alt="Fiora Logo"
                  width={100}
                  height={100}
                  className="rounded-full"
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
                const adjustedDash = (dash / unitLength) * (circumference / units);
                const adjustedGap = (gap / unitLength) * (circumference / units);

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
                      stroke="#333"
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

              {scaledShadowRings.map((ring) => (
                <div
                  key={ring.id}
                  className="absolute rounded-full shadow-2xl"
                  style={{
                    width: `${ring.radius * 2}px`,
                    height: `${ring.radius * 2}px`,
                  }}
                />
              ))}

              {scaledCategoryLabels.map((label) => {
                const rad = (label.angle * Math.PI) / 180;
                const x = label.radius * Math.cos(rad);
                const y = label.radius * Math.sin(rad);
                const baseLabelFontSize = 18;

                return (
                  <div
                    key={label.label}
                    className="absolute font-bold text-green-700 select-none"
                    style={{
                      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                      fontSize: `${baseLabelFontSize * scaleFactor}px`,
                    }}
                  >
                    {label.label}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FioraSystem;
