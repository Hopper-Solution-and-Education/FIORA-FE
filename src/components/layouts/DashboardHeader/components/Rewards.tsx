import { CommonTooltip } from '@/components/common/atoms/CommonTooltip';
import { ICON_SIZE } from '@/shared/constants/size';
import { Gift } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Rewards = () => {
  const router = useRouter();
  return (
    <CommonTooltip content="Rewards">
      <div
        className="flex flex-col gap-1 justify-center items-center group"
        onClick={() => router.push('/wallet/referral')}
      >
        <div className="p-2 rounded-lg transition-all duration-200 hover:bg-primary/10 dark:hover:bg-primary/20">
          <Gift
            size={ICON_SIZE.MD}
            className="transition-all duration-200 text-foreground group-hover:text-primary group-hover:scale-110 cursor-pointer"
          />
        </div>
        <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">
          Rewards
        </span>
      </div>
    </CommonTooltip>
  );
};

export default Rewards;
