import { NavItem } from '@/features/landing/presentation/atoms/NavItem';
import { RouteEnum } from '@/shared/constants/RouteEnum';
import { ICON_SIZE } from '@/shared/constants/size';
import { Gift } from 'lucide-react';
import Link from 'next/link';

const Rewards = () => {
  return (
    <Link href={RouteEnum.WalletReferral}>
      <NavItem
        label="Rewards"
        icon={
          <Gift
            size={ICON_SIZE.MD}
            className="transition-all duration-200 text-foreground group-hover:text-primary group-hover:scale-110"
          />
        }
      />
    </Link>
  );
};

export default Rewards;
