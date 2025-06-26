import TierDataItem from '../atoms/TierDataItem';

const data = [
  {
    label: 'Referral Bonus',
    value: '100',
    suffix: '%',
  },
  {
    label: 'Referral Kickback',
    value: '100',
    suffix: '%',
  },
  {
    label: 'Saving Interest',
    value: '100',
    suffix: '%',
  },
  {
    label: 'Staking Interest',
    value: '100',
    suffix: '%',
  },
  {
    label: 'Loan Interest',
    value: '100',
    suffix: '%',
  },
  {
    label: 'BNPL Fee',
    value: '100',
    suffix: '%',
  },
  {
    label: 'Cashback',
    value: '100',
    suffix: '%',
  },
  {
    label: 'Investment Interest',
    value: '100',
    suffix: '%',
  },
];

const TierRank = () => {
  return (
    <div className="space-y-2">
      {data.map((item) => (
        <TierDataItem key={item.label} {...item} />
      ))}
    </div>
  );
};

export default TierRank;
