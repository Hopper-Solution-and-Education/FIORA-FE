'use client';

import Header from '@/features/landing/presentation/organisms/Header';
import { motion, Variants } from 'framer-motion';
import { PartnerLogo } from '../atoms/PartnerLogo';
import { ScrollToTop } from '../atoms/ScrollToTop';
import { Banner } from '../molecules/Banner';
import { FioraSystem } from '../molecules/FioraSystem';
import Footer from '../organisms/Footer';
import KPSSection from '../organisms/KPSSection';
import { ReviewSection } from '../organisms/ReviewSection';
import VisionMission from '../organisms/VisionMission';

// Framer Motion Variants
const fadeIn = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

const zoomIn = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.8, ease: 'easeOut' } },
};

const LandingPage = () => {
  return (
    <>
      <Header />
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <Banner />
      </motion.div>

      <motion.div
        variants={fadeIn as Variants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <VisionMission />
      </motion.div>

      <motion.div
        variants={fadeIn as Variants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <FioraSystem />
      </motion.div>

      <motion.div
        variants={fadeIn as Variants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <KPSSection />
      </motion.div>

      <motion.div
        variants={fadeIn as Variants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <ReviewSection />
      </motion.div>

      <motion.div
        variants={zoomIn as Variants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <PartnerLogo />
      </motion.div>

      <motion.div
        variants={zoomIn as Variants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <Footer />
      </motion.div>

      {/* Scroll To Top - Không cần hiệu ứng */}
      <ScrollToTop />
    </>
  );
};

export default LandingPage;
