import TierDataItem from '../atoms/TierDataItem';

export type TierRankData = {
  label: string;
  value: string;
  suffix: string;
};

interface TierRankProps {
  data: TierRankData[];
  nextTierRanks?: TierRankData[];
}

const TierRank = ({ data, nextTierRanks }: TierRankProps) => {
  return (
    <div className="space-y-2">
      {data.map((item) => {
        const next = nextTierRanks?.find((b) => b.label === item.label);
        const highlight = next && next.value !== item.value;
        return <TierDataItem key={item.label} {...item} highlight={highlight} />;
      })}
    </div>
  );
};

export default TierRank;
