'use client';

import { Breadcrumbs } from '@/components/Breadcrumbs';
import { MainContent } from '@/components/layouts';

import Footer from '@/features/landing/presentation/organisms/Footer';

import Header from '@/features/landing/presentation/organisms/Header';
import { PropsWithChildren } from 'react';
import Page from './Page';

const StandaloneLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Header />

      <MainContent>
        <Page>
          <Breadcrumbs />
          {children}
        </Page>

        <Footer />
      </MainContent>
    </>
  );
};

export default StandaloneLayout;
