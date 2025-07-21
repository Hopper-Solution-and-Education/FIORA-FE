import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { useEffect } from 'react';

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
    });

    return () => animation.stop();
  }, [angle, orbit.speed, item.initialAngle]);

  const baseDotSize = 14;
  const baseFontSize = 16;

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
        className="bg-green-800 rounded-full shadow-xl -translate-x-1/2 -translate-y-1/2 relative flex items-center justify-center overflow-hidden"
        style={{
          width: `${baseDotSize * scaleFactor}px`,
          height: `${baseDotSize * scaleFactor}px`,
        }}
      ></div>
      <motion.span
        className="absolute font-medium text-green-800 whitespace-nowrap bottom-full mb-1 -translate-x-1/2"
        style={{
          fontSize: `${baseFontSize * scaleFactor}px`,
          marginBottom: `${20 * scaleFactor}px`,
        }}
      >
        {item.name}
      </motion.span>
    </motion.div>
  );
};

export default OrbitalItem;
