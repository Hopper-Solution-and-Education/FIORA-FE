'use client';

import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store';
import { motion } from 'framer-motion';
import { useCallback } from 'react';
import { changeShowDialog } from '../slices';
import OTS from './components/OTS';
import { ScrollToTop } from './components/ScrollToTop';
import SettingModal from './components/SettingModal';
import { Banner } from './organisms/Banner';
import { FioraSystem } from './organisms/FioraSystem';
import KPSSection from './organisms/KPSSection';
import { PartnerLogo } from './organisms/PartnerLogo';
import { ReviewSection } from './organisms/ReviewSection';
import VisionMission from './organisms/VisionMission';
import useAmplitudeContext from '@/hooks/useAmplitudeContext';

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
  const { isShowDialog } = useAppSelector((state) => state.landing);
  const { trackEvent } = useAmplitudeContext();
  const dispatch = useAppDispatch();
  const handleShowDialog = useCallback(
    (isShow: boolean) => {
      trackEvent('Show Dialog Click', {
        text: 'Show Dialog Click',
      });
      dispatch(changeShowDialog(isShow));
    },
    [isShowDialog],
  );

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
      <Button onClick={() => handleShowDialog(!isShowDialog)}>Open Dialog</Button>
      <SettingModal isOpen={isShowDialog} onClose={() => handleShowDialog(!isShowDialog)} />
    </>
  );
};

export default LandingPage;
