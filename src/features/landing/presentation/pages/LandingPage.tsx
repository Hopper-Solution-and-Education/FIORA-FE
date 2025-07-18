'use client';

import Header from '@/features/landing/presentation/organisms/Header';
import { motion } from 'framer-motion';
import { PartnerLogo, ScrollToTop } from '../atoms';
import { Banner } from '../molecules/Banner';
import { FioraSystem } from '../molecules/FioraSystem';
import FeedbackSection from '../organisms/FeedbackSection';
import Footer from '../organisms/Footer';
import KPSSection from '../organisms/KSPSection';
import VisionMission from '../organisms/VisionMission';

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
};

const LandingPage = () => {
  return (
    <>
      <Header />

      {/* Banner */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 60 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: ['easeOut'] },
          },
        }}
      >
        <Banner />
      </motion.div>

      {/* Sections with stagger animation */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 60 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.8, ease: ['easeOut'] },
            },
          }}
        >
          <VisionMission />
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 60 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.8, ease: ['easeOut'] },
            },
          }}
        >
          <FioraSystem />
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 60 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.8, ease: ['easeOut'] },
            },
          }}
        >
          <KPSSection />
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 60 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.8, ease: ['easeOut'] },
            },
          }}
        >
          <FeedbackSection />
        </motion.div>
      </motion.div>

      {/* Partner logo - zoom effect */}
      <motion.div
        variants={{
          hidden: { scale: 0.9, opacity: 0 },
          visible: {
            scale: 1,
            opacity: 1,
            transition: { duration: 0.8, ease: 'easeOut' },
          },
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <PartnerLogo />
      </motion.div>

      {/* Footer - subtle fade in */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <Footer />
      </motion.div>

      <ScrollToTop />
    </>
  );
};

export default LandingPage;
