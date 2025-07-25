import { Icons } from '@/components/Icon';

export type OrbitLevel = {
  id: string;
  radius: number;
  items: { id: string; name: string; initialAngle: number }[];
  speed: number;
};

export type ShadowRing = {
  id: string;
  radius: number;
};

export type CategoryLabel = {
  label: string;
  initialAngle: number;
  radius: number;
  speed: number;
  iconSrc?: keyof typeof Icons;
};
export const orbitLevels: OrbitLevel[] = [
  {
    id: 'level1',
    radius: 140,
    items: [
      {
        id: 'item1-1',
        name: 'Learning course',
        initialAngle: 330,
      },
      {
        id: 'item1-2',
        name: 'Mentoring',
        initialAngle: 255,
      },
    ],
    speed: 50,
  },
  {
    id: 'level2',
    radius: 260,
    items: [
      {
        id: 'item2-4',
        name: 'Freelancer Portal',
        initialAngle: 270,
      },
      {
        id: 'item2-1',
        name: 'Talent Portal',
        initialAngle: 310,
      },
      {
        id: 'item2-2',
        name: 'Safe & Marketing Automation',
        initialAngle: 365,
      },
      {
        id: 'item2-3',
        name: 'White Label Ecom site',
        initialAngle: 40,
      },
      {
        id: 'item2-5',
        name: 'Wallet',
        initialAngle: 155,
      },
      {
        id: 'item2-6',
        name: 'Loan',
        initialAngle: 170,
      },
      {
        id: 'item2-7',
        name: 'Finance',
        initialAngle: 210,
      },
    ],
    speed: 50,
  },
  {
    id: 'level3',
    radius: 380,
    items: [
      {
        id: 'item3-1',
        name: 'Ecom Development Service',
        initialAngle: 360,
      },
      {
        id: 'item3-2',
        name: 'Insurance Broker Service',
        initialAngle: 90,
      },
      {
        id: 'item3-3',
        name: 'Education Insurance Bundling',
        initialAngle: 120,
      },
      {
        id: 'item3-4',
        name: 'Saving',
        initialAngle: 170,
      },
      {
        id: 'item3-5',
        name: 'Investment',
        initialAngle: 180,
      },
      {
        id: 'item3-6',
        name: 'Lending',
        initialAngle: 200,
      },
    ],
    speed: 50,
  },
  {
    id: 'level4',
    radius: 500,
    items: [
      {
        id: 'item4-1',
        name: 'Ecom Insurance Bundling',
        initialAngle: 100,
      },
      {
        id: 'item4-2',
        name: 'Finance Insurance Bundling',
        initialAngle: 125,
      },
    ],
    speed: 50,
  },
];

export const shadowRings: ShadowRing[] = [
  { id: 'shadow1', radius: 200 },
  { id: 'shadow2', radius: 330 },
  { id: 'shadow3', radius: 440 },
];

export const categoryLabels: CategoryLabel[] = [
  {
    label: 'EDUCATION',
    initialAngle: 290,
    radius: 200,
    speed: 50,
    iconSrc: 'education',
  },
  {
    label: 'ECOMMERCE',
    initialAngle: 20,
    radius: 330,
    speed: 50,
    iconSrc: 'shoppingCart',
  },
  {
    label: 'FINANCE',
    initialAngle: 190,
    radius: 330,
    speed: 50,
    iconSrc: 'wallet',
  },
  {
    label: 'INSURANCE',
    initialAngle: 110,
    radius: 440,
    speed: 50,
    iconSrc: 'shieldCheck',
  },
];
