'use client';

import React from 'react';
import { TabActionHeader } from '../../components/TabActionHeader';
import { AddPartnerModal } from './components/AddPartnerModal';
import { TabComponentProps } from '../../types';
import PositiveAndNegativeBarChart from '@/components/common/positive-negative-bar-chart';
import { BarItem } from '@/components/common/nested-bar-chart';

const mockData = [
  {
    transaction_id: 'a1b2c3d4-e5f6-4g7h-8i9j-0k1l2m3n4o5p',
    user_id: 'p9o8i7u6-5y4t-3r2e-1w0q-z9x8c7v6b5n4',
    date: '2025-04-01',
    type: 'Expense',
    amount: 300000.0, // Ăn uống tại Pho 24
    budget_id: 'm3n2b1v0-c9x8-7k6j-5h4g-f3d2s1a0q9w8',
    account_id: 'r4e3w2q1-t9y8-7u6i-5o4p-l3k2j1h0g9f8',
    category_id: 'z7x6c5v4-b9n8-7m6k-5j4h-g3f2d1s0a9q8',
    description: 'Dinner with friends at Pho 24',
    is_recurring: false,
    created_at: '2025-04-01 18:30:15.123',
    updated_at: '2025-04-01 18:30:15.123',
    created_by: 'p9o8i7u6-5y4t-3r2e-1w0q-z9x8c7v6b5n4',
    updated_by: 'p9o8i7u6-5y4t-3r2e-1w0q-z9x8c7v6b5n4',
    partner_category_id: 'z7x6c5v4-b9n8-7m6k-5j4h-g3f2d1s0a9q8',
    partner_id: 'k9j8h7g6-f5d4-3s2a-1q0w-e9r8t7y6u5i4',
    partner: {
      partner_id: 'k9j8h7g6-f5d4-3s2a-1q0w-e9r8t7y6u5i4',
      name: 'Pho 24',
      identify: 'PHO24ID',
      tax_number: '',
      address: 'Various locations across Vietnam',
      email: 'info@pho24.com.vn',
      phone: '+84 1900 6066',
      description: 'Popular Vietnamese noodle soup chain.',
      logo: '{}',
      children: [
        'x1y2z3w4-q5r6-7t8u-9i0o-p1a2s3d4f5g6', // Chi nhánh 1
        'm7n8b9v0-c1x2-3k4j-5h6g-f7d8s9a0q1w2', // Chi nhánh 2
      ],
      created_at: '2025-03-31 09:00:00.000',
      updated_at: '2025-03-31 09:00:00.000',
      created_by: 'k9j8h7g6-f5d4-3s2a-1q0w-e9r8t7y6u5i4',
    },
  },
  {
    transaction_id: 'b2c3d4e5-f6g7-4h8i-9j0k-l1m2n3o4p5q',
    user_id: 'p9o8i7u6-5y4t-3r2e-1w0q-z9x8c7v6b5n4',
    date: '2025-04-02',
    type: 'Income',
    amount: 8000000.0, // Lương từ Viettel
    budget_id: 'm3n2b1v0-c9x8-7k6j-5h4g-f3d2s1a0q9w8',
    from_account_id: 'n2b1v0c9-x8k7-6j5h-4g3f-d2s1a0q9w8e7',
    to_account_id: 'r4e3w2q1-t9y8-7u6i-5o4p-l3k2j1h0g9f8',
    tags: '[{"id": "t5y4u3i2-o9p8-7q6w-5e4r-z3x2c1v0b9n8"}]',
    category_id: 'w4e3r2t1-y9u8-7i6o-5p4q-z3x2c1v0b9n8',
    description: 'Monthly salary from Viettel',
    is_recurring: true,
    created_at: '2025-04-02 09:45:30.456',
    updated_at: '2025-04-02 09:45:30.456',
    created_by: 'p9o8i7u6-5y4t-3r2e-1w0q-z9x8c7v6b5n4',
    updated_by: 'p9o8i7u6-5y4t-3r2e-1w0q-z9x8c7v6b5n4',
    partner_category_id: 'w4e3r2t1-y9u8-7i6o-5p4q-z3x2c1v0b9n8',
    partner_id: 'l0k9j8h7-g6f5-4d3s-2a1q-w0e9r8t7y6u5',
    partner: {
      partner_id: 'l0k9j8h7-g6f5-4d3s-2a1q-w0e9r8t7y6u5',
      name: 'Viettel',
      identify: 'VTL001',
      tax_number: '',
      address: 'No. 1 Tran Huu Duc, My Dinh 2 Ward, Nam Tu Liem District, Hanoi',
      email: 'cskh@viettel.com.vn',
      phone: '1800 8098',
      description: 'One of the largest telecommunications and internet service providers.',
      logo: '{}',
      children: [
        'q1w2e3r4-t5y6-7u8i-9o0p-a1s2d3f4g5h6', // Viettel Telecom
        'z9x8c7v6-b5n4-3m2k-1j0h-g9f8d7s6a5q4', // Viettel Solutions
        'p3o2i1u0-y9t8-7r6e-5w4q-z3x2c1v0b9n8', // Viettel Post
      ],
      created_at: '2025-03-31 10:00:00.000',
      updated_at: '2025-03-31 10:00:00.000',
      created_by: 'l0k9j8h7-g6f5-4d3s-2a1q-w0e9r8t7y6u5',
    },
  },
  {
    transaction_id: 'c3d4e5f6-g7h8-4i9j-0k1l-m2n3o4p5q6r',
    user_id: 'p9o8i7u6-5y4t-3r2e-1w0q-z9x8c7v6b5n4',
    date: '2025-04-03',
    type: 'Expense',
    amount: 1500000.0, // Mua điện thoại tại FPT Shop
    budget_id: 'm3n2b1v0-c9x8-7k6j-5h4g-f3d2s1a0q9w8',
    account_id: 'r4e3w2q1-t9y8-7u6i-5o4p-l3k2j1h0g9f8',
    category_id: 'x5c4v3b2-n9m8-7k6j-5h4g-f3d2s1a0q9w8',
    description: 'Bought a new phone at FPT Shop',
    is_recurring: false,
    created_at: '2025-04-03 14:20:10.789',
    updated_at: '2025-04-03 14:20:10.789',
    created_by: 'p9o8i7u6-5y4t-3r2e-1w0q-z9x8c7v6b5n4',
    updated_by: 'p9o8i7u6-5y4t-3r2e-1w0q-z9x8c7v6b5n4',
    partner_category_id: 'x5c4v3b2-n9m8-7k6j-5h4g-f3d2s1a0q9w8',
    partner_id: 'm1n0b9v8-c7x6-5k4j-3h2g-f1d0s9a8q7w6',
    partner: {
      partner_id: 'm1n0b9v8-c7x6-5k4j-3h2g-f1d0s9a8q7w6',
      name: 'FPT Shop',
      identify: 'FPT001',
      tax_number: '',
      address: 'Various locations across Vietnam',
      email: 'support@fptshop.com.vn',
      phone: '+84 1800 6601',
      description: 'Leading electronics and mobile phone retailer in Vietnam.',
      logo: '{}',
      children: [
        't5y4u3i2-o9p8-7q6w-5e4r-z3x2c1v0b9n8', // FPT Shop HCM
        'r7t6y5u4-i9o8-7p6q-5w4e-z3x2c1v0b9n8', // FPT Shop HN
      ],
      created_at: '2025-03-31 11:00:00.000',
      updated_at: '2025-03-31 11:00:00.000',
      created_by: 'm1n0b9v8-c7x6-5k4j-3h2g-f1d0s9a8q7w6',
    },
  },
  {
    transaction_id: 'd4e5f6g7-h8i9-4j0k-1l2m-n3o4p5q6r7s',
    user_id: 'p9o8i7u6-5y4t-3r2e-1w0q-z9x8c7v6b5n4',
    date: '2025-04-04',
    type: 'Income',
    amount: 2000000.0, // Thanh toán freelance từ Highlands
    budget_id: 'm3n2b1v0-c9x8-7k6j-5h4g-f3d2s1a0q9w8',
    from_account_id: 'o3p2q1w0-e9r8-7t6y-5u4i-z3x2c1v0b9n8',
    to_account_id: 'r4e3w2q1-t9y8-7u6i-5o4p-l3k2j1h0g9f8',
    tags: '[{"id": "u6i5o4p3-q9w8-7e6r-5t4y-z3x2c1v0b9n8"}]',
    category_id: 'v3b2n1m0-c9x8-7k6j-5h4g-f3d2s1a0q9w8',
    description: 'Freelance payment from Highlands Coffee',
    is_recurring: false,
    created_at: '2025-04-04 16:10:25.234',
    updated_at: '2025-04-04 16:10:25.234',
    created_by: 'p9o8i7u6-5y4t-3r2e-1w0q-z9x8c7v6b5n4',
    updated_by: 'p9o8i7u6-5y4t-3r2e-1w0q-z9x8c7v6b5n4',
    partner_category_id: 'v3b2n1m0-c9x8-7k6j-5h4g-f3d2s1a0q9w8',
    partner_id: 'n2b1v0c9-x8k7-6j5h-4g3f-d2s1a0q9w8e7',
    partner: {
      partner_id: 'n2b1v0c9-x8k7-6j5h-4g3f-d2s1a0q9w8e7',
      name: 'Highlands Coffee',
      identify: 'HLC001',
      tax_number: '',
      address: 'Multiple locations in Vietnam',
      email: 'contact@highlandscoffee.com.vn',
      phone: '+84 1900 1234',
      description: 'Popular Vietnamese coffee chain.',
      logo: '{}',
      children: [
        'p9o8i7u6-y5t4-3r2e-1w0q-z9x8c7v6b5n4', // Highlands HCM
        'q0w9e8r7-t6y5-4u3i-2o1p-a9s8d7f6g5h4', // Highlands HN
        'r1t2y3u4-i5o6-7p8q-9w0e-z1x2c3v4b5n6', // Highlands DN
      ],
      created_at: '2025-03-31 12:00:00.000',
      updated_at: '2025-03-31 12:00:00.000',
      created_by: 'n2b1v0c9-x8k7-6j5h-4g3f-d2s1a0q9w8e7',
    },
  },
];

const transformMockDataToBarItems = (mockData: any[]): BarItem[] => {
  return mockData.map((transaction) => {
    const { partner, amount, type } = transaction;
    const value = type === 'Expense' ? -amount : amount;

    const childrenItems: BarItem[] = (partner.children || []).map(
      (childId: string, index: number) => ({
        id: childId,
        name: `${partner.name} - Sub ${index + 1}`,
        value: value / partner.children.length,
        type,
        isChild: true,
        depth: 1,
      }),
    );

    return {
      id: partner.partner_id,
      name: partner.name,
      value,
      type,
      color: type === 'Expense' ? '#ef4444' : '#22c55e',
      children: childrenItems,
      depth: 0,
    };
  });
};

const barData: BarItem[] = transformMockDataToBarItems(mockData);

const PartnerSettingPage = ({ title, description }: TabComponentProps) => {
  return (
    <div className="space-y-6">
      <TabActionHeader
        title={title}
        description={description}
        buttonLabel=""
        modalComponent={AddPartnerModal}
      />

      <PositiveAndNegativeBarChart
        data={barData} // Truyền dữ liệu đã chuyển đổi
        title="Partner Transactions"
        currency="VND" // Đơn vị tiền tệ Việt Nam
        locale="vi-VN" // Định dạng tiếng Việt
        legendItems={[
          { name: 'Income', color: '#22c55e' },
          { name: 'Expense', color: '#ef4444' },
        ]}
        levelConfig={{
          totalName: 'Total',
          colors: {
            0: '#8884d8', // Màu cho cấp cha
            1: '#82ca9d', // Màu cho cấp con
          },
        }}
      />
    </div>
  );
};

export default PartnerSettingPage;
