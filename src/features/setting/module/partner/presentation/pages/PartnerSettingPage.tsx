'use client';

import PositiveAndNegativeBarChart, {
  BarItem,
} from '@/components/common/positive-negative-bar-chart';
import { Partner } from '@/features/setting/module/partner/domain/entities/Partner';
import { fetchPartners } from '@/features/setting/module/partner/slices/actions/fetchPartnersAsyncThunk';
import { COLORS } from '@/shared/constants/chart';
import { useAppDispatch, useAppSelector } from '@/store';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { TabActionHeader } from '../components/TabActionHeader';

const PartnerSettingPage = () => {
  const [barData, setBarData] = useState<BarItem[]>([]);
  const dispatch = useAppDispatch();
  const partners = useAppSelector((state) => state.partner.partners);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Always fetch partners data when the page loads to ensure we have the latest data
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      // Always fetch partners data to get the latest from the database
      dispatch(fetchPartners({ userId: session.user.id, page: 1, pageSize: 100 }));
    } else if (status === 'unauthenticated') {
      toast.error('User not authenticated. Please log in.');
    }
  }, [dispatch, status, session]);

  useEffect(() => {
    if (partners.length > 0) {
      const partnersWithNetAmount = partners.map((partner: Partner) => {
        const netAmount = partner.transactions.reduce((sum: number, t: any) => {
          const amount = Number(t.amount);
          return isNaN(amount) ? sum : sum + (t.type === 'Income' ? amount : -amount);
        }, 0);
        return { ...partner, netAmount };
      });

      const partnerMap = new Map<string, Partner>();
      partnersWithNetAmount.forEach((partner: Partner) => {
        partnerMap.set(partner.id, { ...partner, children: [] });
      });

      partnersWithNetAmount.forEach((partner: Partner) => {
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

      // Calculate total balance including children recursively
      const calculateTotalBalance = (partner: any): number => {
        const ownBalance = partner.netAmount || 0;
        const childrenBalance = partner.children.reduce(
          (sum: number, child: any) => sum + calculateTotalBalance(child),
          0,
        );
        return ownBalance + childrenBalance;
      };

      const createBarItem = (partner: any, depth = 0): BarItem => {
        const totalNetAmount = calculateTotalBalance(partner);

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
          icon: partner.logo || undefined, // Add the logo as the icon
        };
      };

      setBarData(topLevelPartners.map((partner) => createBarItem(partner)));
    }
  }, [partners]);

  const handleNavigateToUpdate = (item: BarItem) => {
    if (item.name === levelConfig.totalName || !item.id) {
      return;
    }
    router.push(`/setting/partner/update/${item.id}`);
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
      <TabActionHeader buttonLabel="" redirectPath="/setting/partner/create" />

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
        callback={handleNavigateToUpdate}
        baseBarHeight={50}
      />
    </div>
  );
};

export default PartnerSettingPage;
