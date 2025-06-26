import TierDataItem from '../atoms/TierDataItem';

export type TierRankData = {
  label: string;
  value: string;
  suffix: string;
};

interface TierRankProps {
  data: TierRankData[];
}

const TierRank = ({ data }: TierRankProps) => {
  return (
    <div className="space-y-2">
      {data.map((item) => (
        <TierDataItem key={item.label} {...item} />
      ))}
    </div>
  );
};

export default TierRank;
