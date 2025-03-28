'use client';

import Header from '@/features/landing/presentation/components/Header';
import { motion } from 'framer-motion';
import Footer from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { Banner } from './organisms/Banner';
import { FioraSystem } from './organisms/FioraSystem';
import KPSSection from './organisms/KPSSection';
import { PartnerLogo } from './organisms/PartnerLogo';
import { ReviewSection } from './organisms/ReviewSection';
import VisionMission from './organisms/VisionMission';

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
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <VisionMission />
      </motion.div>

      <motion.div
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <FioraSystem />
      </motion.div>

      <motion.div
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <KPSSection />
      </motion.div>

      <motion.div
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <ReviewSection />
      </motion.div>

      <motion.div
        variants={zoomIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <PartnerLogo />
      </motion.div>

      <motion.div
        variants={zoomIn}
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
