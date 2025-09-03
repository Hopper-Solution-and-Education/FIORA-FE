import { Shield } from 'lucide-react';
import { FC } from 'react';

type Props = { title: string };

export const SectionHeader: FC<Props> = ({ title }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center space-x-2">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="bg-yellow-500 p-2 rounded " aria-hidden>
        <Shield className="text-white" />
      </div>
    </div>
  );
};

export default SectionHeader;
