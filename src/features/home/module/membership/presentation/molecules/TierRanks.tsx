import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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
    <div className="h-full max-h-[448px] overflow-y-auto overflow-x-auto relative">
      <Table className="w-full min-w-[720px] table-fixed">
        {/* Định nghĩa độ rộng cột */}
        <colgroup>
          {/* No. */}
          <col className="hidden sm:table-column sm:w-[15%]" />
          <col className="w-1/2 sm:w-[35%]" />
          <col className="w-1/2 sm:w-[25%]" />
          {/* Unit */}
          <col className="w-auto sm:w-[25%]" />
        </colgroup>

        <TableHeader>
          <TableRow className="h-14">
            <TableHead className="hidden sm:table-cell text-center py-3 sticky top-0 z-20 bg-white">
              No.
            </TableHead>
            <TableHead className="text-center py-3 sticky top-0 z-20 bg-white">Benefit</TableHead>
            <TableHead className="text-center py-3 sticky top-0 z-20 bg-white">Value</TableHead>
            <TableHead className="text-center py-3 sticky top-0 z-20 bg-white">Unit</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item, index) => (
            <TableRow key={item.label} className="h-14">
              <TableCell className="hidden sm:table-cell text-center font-bold text-blue-400 py-3">
                {index + 1}
              </TableCell>
              <TableCell className="whitespace-normal break-words text-left py-3">
                {item.label}
              </TableCell>
              <TableCell className="whitespace-normal break-words text-right py-3">
                {item.value}
              </TableCell>
              <TableCell className="whitespace-normal break-words text-left py-3">
                {item.suffix}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TierRank;
