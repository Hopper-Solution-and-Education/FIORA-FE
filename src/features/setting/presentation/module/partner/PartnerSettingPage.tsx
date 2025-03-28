'use client';

import PositiveAndNegativeBarChart, {
  BarItem,
} from '@/components/common/positive-negative-bar-chart';
import { COLORS } from '@/shared/constants/chart';
import { createPartnerAPI } from '@/features/setting/module/partner/data/api/partnerApi';
import { Partner } from '@/features/setting/module/partner/domain/entities/Partner';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { TabActionHeader } from '../../components/TabActionHeader';
import { AddPartnerModal } from './components/AddPartnerModal';
import { UpdatePartnerModal } from './components/UpdatePartnerModal';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  setSelectedPartner,
  setUpdatePartnerDialogOpen,
} from '@/features/setting/module/partner/slices';

const PartnerSettingPage = () => {
  const [barData, setBarData] = useState<BarItem[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);

  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  const { selectedPartner, isUpdatePartnerDialogOpen } = useAppSelector((state) => state.partner);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (status !== 'authenticated' || !session?.user?.id) {
          toast.error('User not authenticated. Please log in.');
          return;
        }
        const partnerApi = createPartnerAPI();
        const response = await partnerApi.getPartners({
          page: 1,
          pageSize: 1000,
          userId: session.user.id,
        });
        const fetchedPartners = response.data;
        setPartners(fetchedPartners);

        const partnersWithNetAmount = fetchedPartners.map((partner: Partner) => {
          const netAmount = partner.transactions.reduce((sum: number, t: any) => {
            const amount = Number(t.amount);
            return isNaN(amount) ? sum : sum + (t.type === 'Income' ? amount : -amount);
          }, 0);
          return { ...partner, netAmount };
        });

        const partnerMap = new Map<string, Partner>();
        partnersWithNetAmount.forEach((partner) => {
          partnerMap.set(partner.id, { ...partner, children: [] });
        });

        partnersWithNetAmount.forEach((partner) => {
          if (partner.parentId) {
            const parent = partnerMap.get(partner.parentId);
            if (parent) {
              parent.children.push(partnerMap.get(partner.id)!);
            }
          }
        });

        const topLevelPartners = Array.from(partnerMap.values()).filter(
          (partner) => !partner.parentId,
        );

        const calculateTotalNetAmount = (partner: any): number => {
          return (
            partner.netAmount +
            partner.children.reduce(
              (sum: number, child: any) => sum + calculateTotalNetAmount(child),
              0,
            )
          );
        };

        const createBarItem = (partner: any, depth = 0): BarItem => {
          const totalNetAmount = calculateTotalNetAmount(partner);
          const childrenBarItems = partner.children.map((child: any) =>
            createBarItem(child, depth + 1),
          );

          const isIncome = totalNetAmount >= 0;
          const colorLevel = Math.min(depth, 4);
          const color = isIncome
            ? COLORS.DEPS_SUCCESS[`LEVEL_${colorLevel + 1}` as keyof typeof COLORS.DEPS_SUCCESS]
            : COLORS.DEPS_DANGER[`LEVEL_${colorLevel + 1}` as keyof typeof COLORS.DEPS_DANGER];

          return {
            id: partner.id,
            name: partner.name,
            value: totalNetAmount,
            type: isIncome ? 'Income' : 'Expense',
            color,
            children: childrenBarItems,
            depth,
          };
        };

        setBarData(topLevelPartners.map((partner) => createBarItem(partner)));
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu partner:', error);
      }
    };

    fetchData();
  }, [status, session]);

  const handleOpenUpdateModal = (item: BarItem) => {
    const partner = partners.find((p) => p.id === item.id);
    if (partner) {
      dispatch(setSelectedPartner(partner));
      dispatch(setUpdatePartnerDialogOpen(true));
    }
  };

  type Depth = 0 | 1 | 2 | 3 | 4;

  const levelConfig: {
    totalName: string;
    colors: Record<Depth, string>;
  } = {
    totalName: 'Total',
    colors: {
      0: COLORS.DEPS_SUCCESS.LEVEL_1,
      1: COLORS.DEPS_SUCCESS.LEVEL_2,
      2: COLORS.DEPS_SUCCESS.LEVEL_3,
      3: COLORS.DEPS_SUCCESS.LEVEL_4,
      4: COLORS.DEPS_SUCCESS.LEVEL_5,
    },
  };

  return (
    <div className="space-y-6">
      <TabActionHeader buttonLabel="" modalComponent={AddPartnerModal} />
      <PositiveAndNegativeBarChart
        data={barData}
        title="Partner Transactions"
        currency="VND"
        locale="vi-VN"
        legendItems={[
          { name: 'Expense', color: COLORS.DEPS_DANGER.LEVEL_1 },
          { name: 'Income', color: COLORS.DEPS_SUCCESS.LEVEL_1 },
        ]}
        levelConfig={levelConfig}
        callback={handleOpenUpdateModal}
        baseBarHeight={50}
      />
      {isUpdatePartnerDialogOpen && selectedPartner && <UpdatePartnerModal partners={partners} />}
    </div>
  );
};

export default PartnerSettingPage;
