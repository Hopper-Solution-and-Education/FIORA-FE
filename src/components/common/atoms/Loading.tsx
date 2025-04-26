import { cn } from '@/shared/utils';
import { AnimatePresence, motion } from 'framer-motion'; // Optional for animations
import { Loader2, RotateCw } from 'lucide-react';
import { FC, HTMLAttributes, JSX } from 'react';

type SpinnerType = 'default' | 'dots' | 'pulse' | 'rotate';
type LoadingSize = 'sm' | 'md' | 'lg';

interface LoadingProps extends HTMLAttributes<HTMLDivElement> {
  message?: string;
  description?: string;
  spinnerType?: SpinnerType;
  size?: LoadingSize;
  isInline?: boolean;
  color?: string;
  bgColor?: string;
  ariaLabel?: string;
}

const Loading: FC<LoadingProps> = ({
  message = 'Loading...',
  description = 'Please wait while we prepare your content',
  spinnerType = 'default',
  size = 'md',
  isInline = false,
  color = 'text-primary',
  bgColor = 'bg-gray-900 bg-opacity-50',
  ariaLabel = 'Loading',
  className,
}) => {
  // Size configurations
  const sizeStyles: Record<LoadingSize, { spinner: string; text: string }> = {
    sm: { spinner: 'h-8 w-8', text: 'text-lg' },
    md: { spinner: 'h-16 w-16', text: 'text-2xl' },
    lg: { spinner: 'h-24 w-24', text: 'text-3xl' },
  };

  // Spinner components
  const spinners: Record<SpinnerType, JSX.Element> = {
    default: <Loader2 className={cn(sizeStyles[size].spinner, color, 'animate-spin')} />,
    dots: (
      <div className="flex space-x-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={cn('h-3 w-3 rounded-full', color.replace('text-', 'bg-'))}
            animate={{ y: ['0%', '-50%', '0%'] }}
            transition={{ duration: 0.6, delay: i * 0.2, repeat: Infinity }}
          />
        ))}
      </div>
    ),
    pulse: (
      <motion.div
        className={cn(sizeStyles[size].spinner, color.replace('text-', 'bg-'), 'rounded-full')}
        animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      />
    ),
    rotate: <RotateCw className={cn(sizeStyles[size].spinner, color, 'animate-spin')} />,
  };

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
  };

  // Base container styles
  const baseStyles = cn(
    'flex flex-col items-center justify-center',
    isInline ? 'w-full h-auto' : 'fixed inset-0 w-full h-full backdrop-blur-sm z-[9999]',
    bgColor,
    className,
  );

  return (
    <AnimatePresence>
      <motion.div
        className={baseStyles}
        role="status"
        aria-label={ariaLabel}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="relative">
          {spinners[spinnerType]}
          {/* Optional glowing effect */}
          <div
            className={cn(
              'absolute inset-0 rounded-full blur-xl opacity-30',
              color.replace('text-', 'bg-'),
            )}
          />
        </div>
        {message && (
          <motion.h2
            className={cn(
              'font-semibold text-white mt-4',
              sizeStyles[size].text,
              isInline && 'text-gray-800 dark:text-white',
            )}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {message}
          </motion.h2>
        )}
        {description && (
          <motion.p
            className={cn(
              'text-gray-300 mt-2 text-sm',
              isInline && 'text-gray-600 dark:text-gray-300',
            )}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {description}
          </motion.p>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default Loading;
