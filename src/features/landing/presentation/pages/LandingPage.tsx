'use client';

import { MainContent } from '@/components/layouts';
import Header from '@/features/landing/presentation/organisms/Header';
import { PartnerLogo } from '../atoms';
import { Banner } from '../molecules/Banner';
import { FioraSystem } from '../molecules/FioraSystem';
import FeedbackSection from '../organisms/FeedbackSection';
import Footer from '../organisms/Footer';
import KPSSection from '../organisms/KSPSection';
import VisionMission from '../organisms/VisionMission';

const LandingPage = () => {
  return (
    <>
      <Header />

      <MainContent>
        <Banner />
        <VisionMission />
        <FioraSystem />
        <KPSSection />
        <FeedbackSection />
        <PartnerLogo />
        <Footer />
      </MainContent>
    </>
  );
};

export default LandingPage;
