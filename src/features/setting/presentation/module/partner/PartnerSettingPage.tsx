'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

const PartnerSettingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Partner Settings</h2>

      {/* Nút mở modal */}
      <Button onClick={() => setIsModalOpen(true)}>Add Partner</Button>

      {/* Tạm thời hiển thị text thay vì modal */}
      {isModalOpen && <p className="text-sm text-blue-500">[Modal Content Placeholder]</p>}
    </div>
  );
};

export default PartnerSettingPage;
