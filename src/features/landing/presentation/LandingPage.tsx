'use client';

import { motion } from 'framer-motion';
import { Banner } from './organisms/Banner';
import { FioraSystem } from './organisms/FioraSystem';
import KPSSection from './organisms/KPSSection';
import OTS from './components/OTS';
import { PartnerLogo } from './organisms/PartnerLogo';
import { ReviewSection } from './organisms/ReviewSection';
import { ScrollToTop } from './components/ScrollToTop';
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
      {/* Banner - Slide Up Effect */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <Banner />
      </motion.div>

      {/* Vision & Mission - Fade In */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <VisionMission />
      </motion.div>

      {/* KPS Section - Fade In */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <KPSSection />
      </motion.div>

      {/* Fiora System - Fade In */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <FioraSystem />
      </motion.div>

      {/* Review Section - Fade In */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <ReviewSection />
      </motion.div>

      {/* Partner Logo - Zoom In Effect */}
      <motion.div
        variants={zoomIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <PartnerLogo />
      </motion.div>

      {/* Scroll To Top - Không cần hiệu ứng */}
      <ScrollToTop />

      {/* OTS - Fade In */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <OTS />
      </motion.div>
    </>
  );
};

export default LandingPage;
