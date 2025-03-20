'use client';

import React from 'react';
import { TabActionHeader } from '../../components/TabActionHeader';
import { AddPartnerModal } from './components/AddPartnerModal';
import { TabComponentProps } from '../../types';

const PartnerSettingPage = ({ title, description }: TabComponentProps) => {
  return (
    <div className="space-y-6">
      <TabActionHeader
        title={title}
        description={description}
        buttonLabel=""
        modalComponent={AddPartnerModal}
      />
    </div>
  );
};

export default PartnerSettingPage;
